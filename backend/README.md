# RAG Pipeline Backend

A backend service that extracts text from Docusaurus URLs, generates embeddings using Cohere, and stores them in Qdrant for RAG-based retrieval.

## Features

- Discovers URLs from deployed Docusaurus sites
- Extracts and cleans text content from web pages
- Chunks text with overlap to preserve context
- Generates embeddings using Cohere API
- Stores embeddings in Qdrant vector database with metadata

## Setup

1. Install dependencies using UV:
   ```bash
   cd backend
   uv pip install -r requirements.txt
   # Or if using pyproject.toml directly:
   uv sync
   ```

2. Create a `.env` file with your API keys:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=http://localhost:6333
   QDRANT_API_KEY=your_qdrant_api_key_here
   TARGET_URL=https://physical-ai-robotics-book-beta.vercel.app/
   ```

## Usage

Run the main pipeline:
```bash
cd backend
uv run python main.py
```

## Functions

The implementation includes these core functions:

- `get_all_urls()`: Discovers internal URLs from deployed site
- `extract_text_from_url()`: Extracts and cleans text from URL
- `chunk_text()`: Splits text into manageable chunks
- `embed()`: Generates embeddings using Cohere
- `create_collection()`: Creates Qdrant collection named 'rag_embedding'
- `save_chunk_to_qdrant()`: Stores embeddings with metadata
- `main()`: Coordinates the complete pipeline execution