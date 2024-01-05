from typing import Union
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2 as pypdf
from tqdm import tqdm
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
import os
from langchain.chat_models import ChatOpenAI
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

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.environ["AWS_ACCESS_KEY"],
    aws_secret_access_key=os.environ["AWS_SECRET_KEY"],
    region_name="us-east-2",
)

supabase_url = os.environ["SUPABASE_URL"]
supabase_key = os.environ["SUPABASE_KEY"]
supabase_client = create_client(supabase_url, supabase_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    results = pinecone_store.similarity_search_with_score(query=qstring, namespace=id)

    result_documents = [result[0].page_content for result in results]
    result_distances = [result[1] for result in results]

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
        base64_image = encode_image(file.file)
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
    pdf_content = handle_pdf(file)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_size * overlap,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.create_documents(
        [page["text"] for page in pdf_content],
        metadatas=[{"page_number": str(i + 1)} for i in range(len(pdf_content))],
    )

    pinecone_store.add_texts(
        texts=[chunk.page_content for chunk in chunks],
        metadatas=[chunk.metadata for chunk in chunks],
        namespace=manual_id,
    )

    print("[+] Added texts to Pinecone")

    for k in range(len(pdf_content)):
        if len(pdf_content[k]["tables"]) == 0:
            continue

        pinecone_store.add_texts(
            texts=[row for row in pdf_content[k]["tables"]],
            metadatas=[{"page_number": str(k + 1)}],
            namespace=manual_id,
        )

    print("[+] Added tables to Pinecone")

    return {"status": 200, "pdf_content": pdf_content}


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
    print("add manual to DBB")
    try:
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
    except Exception as e:
        print(f"[-] ERROR in /add_manual_to_db: {e}")
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}"
        )


@app.get("/retrieve_manual_from_db")
def retrieve_manual_from_db(companyName: str, productName: str):
    try:
        response = (
            supabase_client.table("manuals")
            .select("manual_id, file_name, company_name, product_name, product_device")
            .eq("company_name", companyName)
            .eq("product_name", productName)
            .limit(1)
            .single()
            .execute()
        )

        url = get_file_link(response.data["file_name"])
        return {
            "status": 200,
            "url": url,
            "manual_id": response.data["manual_id"],
            "product_name": response.data["product_name"],
            "product_device": response.data["product_device"],
        }
    except Exception as e:
        print(f"[-] ERROR in /retrieve_manual_from_db: {e}")
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving manual from database: {e}",
        )

@app.get("/get_products")
def get_products():
    try:
        response = (
            supabase_client.table("manuals")
            .select("company_name, product_name")
            .execute()
        )
        company_products = [(row['company_name'], row['product_name']) for row in response.data]
        print(company_products)
        return  {"company_products": company_products}
    except Exception as e:
        print(f"[-] ERROR in /get_products: {e}")
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{e}",
        )

@app.get("/get_company_products")
def get_manuals_by_company(companyName: str):
    try:
        response = (
            supabase_client.table("manuals")
            .select("product_name")
            .eq("company_name", companyName)
            .execute()
        )

        return {"products": [row["product_name"] for row in response.data]}
    except Exception as e:
        print(f"[-] ERROR in /get_company_products: {e}")
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{e}",
        )

@app.get("/get_companies")
def get_companies():
    try:
        response = (
            supabase_client.table("manuals")
            .select("company_name")
            .execute()
        )
        company_names = {row['company_name'] for row in response.data}  # Using a set for uniqueness
        return {"companies": list(company_names)}
    except Exception as e:
        print(f"[-] ERROR in /get_companies: {e}")
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{e}",
        )

        


def handle_pdf(file):
    pdf = pypdf.PdfReader(file.file)
    length = len(pdf.pages)
    page_contents = []

    for i, page in tqdm(enumerate(pdf.pages)):
        page_contents.append({})
        page_contents[i]["text"] = page.extract_text()

        dfs = tabula.read_pdf(file.file, pages=str(i + 1))
        tables_on_this_page = []
        for df in dfs:
            df = df.ffill()
            for ind in df.index:
                for col in df.columns:
                    current_row = "|".join(str(df[col][ind]) for col in df.columns)

                    tables_on_this_page.append(current_row)
        page_contents[i]["tables"] = list(set(tables_on_this_page))

    if not upload_file_s3(file, os.environ["BUCKET_NAME"]):
        print("[-] FAILED TO UPLOAD TO S3")
    else:
        print("[+] uploaded to S3")

    return page_contents


# Function to encode the image
def encode_image(image_file):
    return base64.b64encode(image_file.read()).decode("utf-8")


def upload_file_s3(file, bucket):
    try:
        file.file.seek(0)
        contents = file.file.read()
        temp_file = io.BytesIO()
        temp_file.write(contents)
        temp_file.seek(0)
        s3_client.upload_fileobj(temp_file, bucket, file.filename)
        temp_file.close()
        file.file.close()
    except ClientError as e:
        print(e)
        return False
    return True
