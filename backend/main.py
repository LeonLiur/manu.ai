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

@app.get("/query")
async def query(id: str, qstring: str):
    collection = chroma_client.get_collection(id)
    results = collection.query(
        query_texts=[qstring, "troubleshoot"],
        n_results=10,
    )

    result_distances = results["distances"]
    result_documents = results["documents"]

    openai_client = OpenAI(api_key=os.environ["OPEN_AI_KEY"])
    chat_completion = openai_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"You are a manufacturer's customer service helping a user troubleshoot an issue with their dishwasher."
                "You will be given an issue statement, some semantically similar embeddings in the manual, and "
                "their distances. Generate a succinct response to help the user. DO NOT redirect them to get help from others."
            },
            {
                "role": "user",
                "content": f"Help me: {qstring}, here are semantically similar embeddings: {result_documents}, and their distances: {result_distances}"
            }
        ],
        model="gpt-3.5-turbo-16k",
    )

    return {"result": chat_completion.choices[0].message.content, "query_distances" : result_distances, "query_documents": result_documents}


@app.post("/upload")
async def upload_item(
    manual_id: str,
    manual_name: str,
    file: UploadFile = File(...),
    chunk_size: int = 100,
    overlap: float = 0.3,
):
    # text = handle_pdf(file.file, manual_name, manual_id)

    # print(
    #     f"splitting text with chunk_size={chunk_size}, overlap={chunk_size * overlap}"
    # )
    # text_splitter = RecursiveCharacterTextSplitter(
    #     chunk_size=chunk_size,
    #     chunk_overlap=chunk_size * overlap,
    #     length_function=len,
    #     add_start_index=True,
    # )
    # chunks = text_splitter.create_documents([text])

    collection = chroma_client.get_or_create_collection(name=manual_id)

    # collection.add(
    #     documents=[document.page_content for document in chunks],
    #     metadatas=[document.metadata for document in chunks],
    #     ids=[str(_id) for _id in range(len(chunks))],
    # )
    
    tables = handle_tables(file.file)
    running_id = 0
    
    for k in tables:
        if len(tables[k]) == 0:
            continue
        collection.add(
            documents=[row for row in tables[k]],
            metadatas=[{"page_number":str(k)} for row in tables[k]],
            ids=[str(_id) for _id in range(running_id, running_id + len(tables[k]))]
        )
        running_id += len(tables[k])
    

    # return {"status": 200, "chunks": chunks}
    return {"status": 200, "tables" : tables}


def handle_pdf(pdf_in, manual_name, manual_id):
    text = extract_text(pdf_in)
    # os.makedirs(f"./storage/{manual_name}", exist_ok=True)
    # with open(f"./storage/{manual_name}/text.txt", "w") as f:
    #     f.write(text)

    # for page in tqdm(extract_pages(pdf_in)):
    #     save_images_from_page(page, manual_name, manual_id)
    return text
                    

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
                    current_row = '|'.join(str(df[col][ind]) for col in df.columns)

                    tables_on_this_page.append(current_row)
        tables[page] = set(tables_on_this_page)
        
    return tables


def save_images_from_page(page: pdfminer.layout.LTPage, manual_name, manual_id):
    images = list(filter(bool, map(get_image, page)))
    iw = ImageWriter(f"./storage/{manual_name}/images/")
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
