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


chroma_client = chromadb.PersistentClient(path="./")
chroma_client.heartbeat()
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


@app.get("/query")
async def query(id: str, qstring: str):
    collection = chroma_client.get_collection(id)
    results = collection.query(
        query_texts=[qstring, "troubleshoot"],
        n_results=5,
    )

    result_distances = results["distances"]
    result_documents = results["documents"]

    chat_params = {
        "model": "gpt-3.5-turbo-16k",
        "openai_api_key": os.environ["OPEN_AI_KEY"],
        "temperature": 0.5,
        "max_tokens": 8192,
    }
    llm = ChatOpenAI(**chat_params)
    
    llm_result = await llm.apredict(f"You are a user manual helping a user troubleshoot their issue: {qstring}. Generate succinct instructions. Here are some embeddings from the user's manual that are the most relevant: {result_documents}, with their respective distances: {result_distances}")

    return llm_result


@app.post("/upload")
async def upload_item(
    id: str,
    file: UploadFile = File(...),
    chunk_size: int = 300,
    overlap: float = 0,
):
    contents = await file.read()
    pdf = pypdf.PdfReader(file.file)

    document_text = ""
    page_count = len(pdf.pages)

    print("[*] reading in pdf:")
    for i in tqdm(range(page_count)):
        document_text += pdf.pages[i].extract_text()

    document_length = len(document_text)
    no_chunks = document_length // chunk_size + 1
    print(f"[+] pdf done reading. size: {document_length}, no_chunks: {no_chunks}")

    print("[*] chunking pdf")
    text_splitter = RecursiveCharacterTextSplitter(
        # Set a really small chunk size, just to show.
        chunk_size=chunk_size,
        chunk_overlap=chunk_size * overlap,
        length_function=len,
        add_start_index=True,
    )

    chunks = text_splitter.create_documents([document_text])
    print("[+] chunking done")

    print("[*] creating chroma db")

    collection = chroma_client.create_collection(name=id)
    collection.add(
        documents=[document.page_content for document in chunks],
        metadatas=[document.metadata for document in chunks],
        ids=[str(_id) for _id in range(len(chunks))],
    )

    print(f"[+] created chroma db with ID: {id}")

    return {"status": 200}
