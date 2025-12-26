import os
from fastapi import FastAPI, Query
from pydantic import BaseModel
import asyncio
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dataclasses import dataclass
from typing import List, Optional
import logging
import uuid
from dotenv import load_dotenv

# ----------------- Setup -----------------
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(title="RAG Pipeline API")

# ----------------- Data Classes -----------------
@dataclass
class DocumentContent:
    url: str
    title: str
    content: str
    created_at: float = time.time()

@dataclass
class TextChunk:
    id: str
    document_url: str
    content: str
    chunk_index: int
    metadata: dict = None

# ----------------- Helper Functions -----------------
def get_all_urls(base_url: str) -> List[str]:
    urls = set()
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                urls.add(full_url)
        sitemap_url = urljoin(base_url, 'sitemap.xml')
        try:
            sitemap_response = requests.get(sitemap_url)
            if sitemap_response.status_code == 200:
                sitemap_soup = BeautifulSoup(sitemap_response.content, 'xml')
                for loc in sitemap_soup.find_all('loc'):
                    url = loc.text.strip()
                    if url.startswith(base_url):
                        urls.add(url)
        except:
            logger.info("No sitemap found, continuing with discovered URLs")
        return list(urls)
    except Exception as e:
        logger.error(f"Error discovering URLs: {e}")
        return []

def extract_text_from_url(url: str) -> Optional[DocumentContent]:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        for element in soup(['script','style','nav','header','footer','aside']):
            element.decompose()
        title = soup.title.get_text().strip() if soup.title else url.split('/')[-1] or url
        content = soup.get_text(separator=' ', strip=True)
        content = ' '.join(content.split())
        if not content:
            return None
        return DocumentContent(url=url, title=title, content=content)
    except Exception as e:
        logger.error(f"Error extracting text from {url}: {e}")
        return None

def chunk_text(text: str, chunk_size: int = 512, overlap: float = 0.2) -> List[TextChunk]:
    if not text:
        return []
    chunks = []
    chunk_overlap = int(chunk_size * overlap)
    start = 0
    chunk_index = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk_content = text[start:end]
        chunk = TextChunk(
            id=str(uuid.uuid4()),
            document_url="",
            content=chunk_content,
            chunk_index=chunk_index,
            metadata={"created_at": time.time()}
        )
        chunks.append(chunk)
        start = end - chunk_overlap if end < len(text) else end
        chunk_index += 1
    return chunks

def embed(texts: List[str]) -> List[List[float]]:
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise ValueError("COHERE_API_KEY environment variable is required")
    co = cohere.Client(cohere_api_key)
    response = co.embed(texts=texts, model="embed-english-v3.0", input_type="search_document")
    return [embedding for embedding in response.embeddings]

def create_collection(client: QdrantClient, collection_name: str = "rag_embedding"):
    collections = client.get_collections()
    existing_collections = [col.name for col in collections.collections]
    if collection_name not in existing_collections:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE)
        )

def save_chunk_to_qdrant(client: QdrantClient, chunk: TextChunk, embedding: List[float],
                         collection_name: str = "rag_embedding"):
    payload = {
        "source_url": chunk.document_url,
        "title": chunk.metadata.get("title", "") if chunk.metadata else "",
        "chunk_index": chunk.chunk_index,
        "content": chunk.content,
        "timestamp": time.time()
    }
    client.upsert(
        collection_name=collection_name,
        points=[models.PointStruct(id=chunk.id, vector=embedding, payload=payload)]
    )

# ----------------- Main Pipeline -----------------
async def run_pipeline(limit: int = 10):
    target_url = os.getenv("TARGET_URL", "https://physical-ai-robotics-book-beta.vercel.app/")
    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key) if qdrant_api_key else QdrantClient(url=qdrant_url)
    create_collection(qdrant_client, "rag_embedding")

    urls = get_all_urls(target_url)
    if not urls:
        logger.error("No URLs found, exiting")
        return

    for i, url in enumerate(urls[:limit]):
        doc_content = extract_text_from_url(url)
        if not doc_content:
            continue
        chunks = chunk_text(doc_content.content)
        for chunk in chunks:
            chunk.document_url = url
            if chunk.metadata is None:
                chunk.metadata = {}
            chunk.metadata["title"] = doc_content.title
        try:
            texts = [chunk.content for chunk in chunks]
            embeddings = embed(texts)
            for chunk, embedding in zip(chunks, embeddings):
                save_chunk_to_qdrant(qdrant_client, chunk, embedding)
        except Exception as e:
            logger.error(f"Error processing {url}: {e}")
            continue

# ----------------- FastAPI Endpoints -----------------
@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/start_pipeline")
async def start_pipeline(limit: int = Query(10, description="Number of URLs to process")):
    asyncio.create_task(run_pipeline(limit))
    return {"message": f"RAG pipeline started with limit={limit}"}

# ----------------- Query Endpoint -----------------
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

@app.post("/query")
async def query_rag(request: QueryRequest):
    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    client = (
        QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
        if qdrant_api_key
        else QdrantClient(url=qdrant_url)
    )

    # Embed the question
    cohere_api_key = os.getenv("COHERE_API_KEY")
    co = cohere.Client(cohere_api_key)

    question_embedding = co.embed(
        texts=[request.question],
        model="embed-english-v3.0",
        input_type="search_query"
    ).embeddings[0]

    # ✅ Fixed method for latest Qdrant client
    search_result = client.search(
        collection_name="rag_embedding",
        query_vector=question_embedding,
        limit=request.top_k
    )

    answers = []
    for hit in search_result:
        answers.append({
            "content": hit.payload.get("content", ""),
            "source_url": hit.payload.get("source_url", "")
        })

    return {
        "question": request.question,
        "answers": answers
    }
