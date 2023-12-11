from typing import Union
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2 as pypdf
from tqdm import tqdm
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
import os
from langchain.chat_models import ChatOpenAI
import pdfminer
from pdfminer.high_level import extract_text, extract_pages
from pdfminer.image import ImageWriter
from openai import OpenAI
import tabula
import base64
import io
import requests
import boto3
import logging
import random
from botocore.exceptions import ClientError
from supabase import create_client, Client
import pinecone
from langchain.vectorstores import Pinecone


BURN_MONEY = True

load_dotenv()

logger = logging.getLogger()
logger.setLevel(logging.ERROR)

pinecone.init(api_key=os.environ["PINECONE_API_KEY"], environment="gcp-starter")
index = pinecone.Index("manu-ai")
embeddings = OpenAIEmbeddings()
pinecone_store = Pinecone(index, embeddings, "text")

s3_client = boto3.client("s3")

supabase_url = os.environ["SUPABASE_URL"]
supabase_key = os.environ["SUPABASE_PWD"]
supabase_client = create_client(supabase_url, supabase_key)

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "public, max-age=5"
    return response


@app.get("/")
def read_root():
    return {"Hello": "World", "Roulette": random.randint(1, 6)}


@app.post("/query")
async def query(
    id: str, qstring: str, device: str, file: Union[UploadFile, None] = None
):
    id = "man" + id

    results = pinecone_store.similarity_search_with_score(
        query=qstring, namespace=id
    )

    result_documents = [result[0].page_content for result in results]
    result_distances = [result[1] for result in results]

    if not BURN_MONEY:
        print(results)
        return {
            "result": "SAMPLE_TEST_TEST",
            "query_documents": result_,
        }

    if file:
        base64_image = encode_image(file.file)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
    }

    payload = {
        "model": "gpt-4-vision-preview" if file else "gpt-4",
        "messages": [
            {
                "role": "system",
                "content": f"You are a manufacturer's customer service agent helping a user troubleshoot an issue with their {device}."
                "You will be given a problem, and some semantically similar embeddings in the manual ranked by similiarities."
                "You will also be given an image of their problem"
                "Generate a response in less than three sentences to instruct the user what to do. DO NOT redirect them to get help from others or from sections in their manual.",
            },
            {
                "role": "user",
                "content": f"Help me: {qstring}, here are semantically similar embeddings ranked by similarity: {result_documents}",
            },
        ],
        "max_tokens": 300,
    }

    if file:
        payload.messages.append(
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                        },
                    }
                ],
            },
        )

    response = requests.post(
        "https://api.openai.com/v1/chat/completions", headers=headers, json=payload
    ).json()

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
    text, tables = handle_pdf(file, manual_name, manual_id)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_size * overlap,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.create_documents([text])

    pinecone_store.add_texts(
        texts=[chunk.page_content for chunk in chunks],
        metadatas=[chunk.metadata for chunk in chunks],
        namespace=manual_id,
    )

    print("[+] Added texts to Pinecone")

    for k in tables:
        if len(tables[k]) == 0:
            continue

        pinecone_store.add_texts(
            texts=[row for row in tables[k]],
            metadatas=[{"page_number": str(k)} for row in tables[k]],
            namespace=manual_id,
        )

    print("[+] Added tables to Pinecone")

    return {"status": 200, "chunks": chunks, "tables": tables}


@app.get("/get_file")
def get_file_link(file_name: str, expiration: int = 3600):
    print("[*] Generating presigned link for", file_name)
    try:
        response = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": os.environ["BUCKET_NAME"], "Key": file_name},
            ExpiresIn=expiration,
        )
    except ClientError as e:
        logger.error(e)
        return None

    # The response contains the presigned URL
    return response


@app.post("/add_manual_to_db")
def add_manual_to_db(
    company_name: str, product_name: str, product_device: str, file_name: str
):
    db_res = (
        supabase_client.table("manuals")
        .insert(
            [
                {
                    "company_name": company_name,
                    "product_name": product_name,
                    "product_device": product_device,
                    "file_name": file_name,
                }
            ]
        )
        .execute()
    )
    # Return the manual_id
    return {"manual_id": db_res.data[0]["manual_id"], "status": 200}


def handle_pdf(file, manual_name, manual_id):
    if not upload_file_s3(file, os.environ["BUCKET_NAME"]):
        print("[-] FAILED TO UPLOAD TO S3")
    else:
        print("[+] uploaded to S3")
    print("[*] processing text")
    text = extract_text(file.file)
    print("[*] processing tables")
    tables = handle_tables(file.file)
    return text, tables


def handle_tables(pdf_in):
    length = len(pypdf.PdfReader(pdf_in).pages)
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


def upload_file_s3(file, bucket):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file
    s3_client = boto3.client("s3")
    try:
        contents = file.file.read()
        temp_file = io.BytesIO()
        temp_file.write(contents)
        temp_file.seek(0)
        s3_client.upload_fileobj(temp_file, bucket, file.filename)
        temp_file.close()
    except ClientError as e:
        logger.error(e)
        return False
    return True
