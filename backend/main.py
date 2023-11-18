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


chroma_client = chromadb.PersistentClient(path="./db/")
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

    return {"result": llm_result, "query_distances" : result_distances, "query_documents": result_documents}


@app.post("/upload")
async def upload_item(
    manual_id: str,
    manual_name: str,
    file: UploadFile = File(...),
    chunk_size: int = 300,
    overlap: float = 0.5,
):
    text = handle_pdf(file.file, manual_name, manual_id)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_size * overlap, length_function=len, add_start_index=True)
    chunks = text_splitter.create_documents([text])

    collection = chroma_client.create_collection(name=manual_id)
    collection.add(
        documents=[document.page_content for document in chunks],
        metadatas=[document.metadata for document in chunks],
        ids=[str(_id) for _id in range(len(chunks))],
    )

    return {"status": 200}


def handle_pdf(pdf_in, manual_name, manual_id):
    text = extract_text(pdf_in)
    os.makedirs(f"./storage/{manual_name}", exist_ok=True)
    with open(f"./storage/{manual_name}/text.txt", "w") as f:
        f.write(text)
        
    for page in tqdm(extract_pages(pdf_in)):
        save_images_from_page(page, manual_name, manual_id)
        
    return text
        
    

def save_images_from_page(page: pdfminer.layout.LTPage, manual_name, manual_id):
    images = list(filter(bool, map(get_image, page)))
    iw = ImageWriter(f'./storage/{manual_name}/images/')
    for image in images:
        iw.export_image(image)
        

def get_image(layout_object):
    if isinstance(layout_object, pdfminer.layout.LTImage):
        return layout_object
    if isinstance(layout_object, pdfminer.layout.LTContainer):
        for child in layout_object:
            return get_image(child)
    else:
        return None
        
