from typing import Union
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import chromadb
import PyPDF2 as pypdf
from tqdm import tqdm
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from langchain.embeddings import OpenAIEmbeddings
import os
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import pdfminer
from pdfminer.high_level import extract_text, extract_pages
from pdfminer.image import ImageWriter
from openai import OpenAI
import tabula
import base64
import requests

chroma_client = chromadb.PersistentClient(path="./db/")
chroma_client.heartbeat()
# chroma_client = chromadb.Client()
load_dotenv()
app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/back_and_forth")
async def back_and_forth(messages):
    return


@app.post("/query")
async def query(id: str, qstring: str, file: UploadFile = File(...)):
    OPEN_AI_KEY = os.environ["OPEN_AI_KEY"]
    collection = chroma_client.get_collection(id)
    results = collection.query(
        query_texts=[qstring, "troubleshoot"],
        n_results=10,
    )

    result_distances = results["distances"]
    result_documents = results["documents"]

    base64_image = encode_image(file.file)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPEN_AI_KEY}",
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "system",
                "content": f"You are a manufacturer's customer service agent helping a user troubleshoot an issue with their device."
                "You will be given a problem, and some semantically similar embeddings in the manual ranked by similiarities."
                "You will also be given an image of their problem"
                "Generate a response in less than three sentences to instruct the user what to do. BRIEFLY describe the image, DO NOT redirect them to get help from others or from sections in their manual.",
            },
            {
                "role": "user",
                "content": f"Help me: {qstring}, here are semantically similar embeddings ranked by similarity: {result_documents}",
            },
            {
                "role": "user",
                "content": [{
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",
                        "detail": "high",
                    },
                }],
            },
        ],
        "max_tokens": 300,
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions", headers=headers, json=payload
    ).json()
    
    print(response)

    return {
        "result": response["choices"][0]["message"]["content"],
        "query_documents": result_documents,
    }


@app.post("/upload")
async def upload_item(
    manual_id: str,
    manual_name: str,
    file: UploadFile = File(...),
    chunk_size: int = 300,
    overlap: float = 0.3,
):
    # all ID must be above 3 characters long
    manual_id = "man" + manual_id
    
    print(f"[+] received uploaded PDF with ID {manual_id}")
    collection = chroma_client.get_or_create_collection(name=manual_id)
    running_id = 0

    text, tables = handle_pdf(file.file, manual_name, manual_id)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_size * overlap,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.create_documents([text])

    collection.add(
        documents=[document.page_content for document in chunks],
        metadatas=[document.metadata for document in chunks],
        ids=[str(running_id + _id) for _id in range(len(chunks))],
    )
    running_id += len(chunks)

    for k in tables:
        if len(tables[k]) == 0:
            continue

        collection.add(
            documents=[row for row in tables[k]],
            metadatas=[{"page_number": str(k)} for row in tables[k]],
            ids=[str(running_id + _id) for _id in range(len(tables[k]))],
        )
        running_id += len(tables[k])

    return {"status": 200, "chunks": chunks, "tables": tables}


def handle_pdf(pdf_in, manual_name, manual_id):
    text = extract_text(pdf_in)
    # os.makedirs(f"./storage/{manual_name}", exist_ok=True)
    # with open(f"./storage/{manual_name}/text.txt", "w") as f:
    #     f.write(text)

    # for page in tqdm(extract_pages(pdf_in)):
    #     save_images_from_page(page, manual_name, manual_id)
    tables = handle_tables(pdf_in)
    return text, tables


def handle_tables(pdf_in):
    length = len(pypdf.PdfReader(pdf_in).pages)
    print("doing tables")
    tables = {}
    for page in tqdm(range(1, length + 1)):
        dfs = tabula.read_pdf(pdf_in, pages=str(page))
        tables_on_this_page = []
        for df in dfs:
            df = df.ffill()
            for ind in df.index:
                for col in df.columns:
                    current_row = "|".join(str(df[col][ind]) for col in df.columns)

                    tables_on_this_page.append(current_row)
        tables[page] = set(tables_on_this_page)

    return tables


# Function to encode the image
def encode_image(image_file):
    return base64.b64encode(image_file.read()).decode("utf-8")
