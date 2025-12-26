# Quickstart Guide: Embedding Pipeline

## Overview
This guide provides a conceptual overview of the RAG pipeline implementation. The system collects URLs from deployed sites, extracts and cleans text, chunks the text, generates embeddings using Cohere, and stores them in Qdrant.

## Prerequisites
- Python 3.11+
- Cohere API key
- Qdrant instance (local or cloud)
- Required Python packages (requests, beautifulsoup4, cohere, qdrant-client)

## Conceptual Implementation
The pipeline is designed as a single `main.py` file with the following functions:

### 1. get_all_urls()
- Discovers internal URLs from a deployed site
- Handles URL validation and filtering
- Returns a list of valid URLs to process

### 2. extract_text_from_url()
- Fetches content from a given URL
- Uses beautifulsoup4 to parse HTML
- Extracts clean text while filtering out navigation elements

### 3. chunk_text()
- Splits long text into smaller chunks
- Maintains context with overlapping chunks
- Prepares text for embedding generation

### 4. embed()
- Sends text chunks to Cohere API
- Receives embedding vectors
- Handles API rate limits and errors

### 5. create_collection()
- Sets up Qdrant collection for embeddings
- Defines schema and configuration
- Prepares database for storage

### 6. save_chunk_to_qdrant()
- Stores embeddings with metadata in Qdrant
- Links embeddings back to source content
- Handles storage errors and retries

### 7. main()
- Coordinates the entire pipeline
- Manages flow from URL collection to storage
- Implements error handling and logging

## Execution Flow
1. Initialize configuration (API keys, target URLs)
2. Collect URLs from target site
3. For each URL: extract → clean → chunk → embed → store
4. Monitor processing status
5. Handle errors and retries

## Configuration
The system uses environment variables for sensitive information:
- `COHERE_API_KEY`: Your Cohere API key
- `QDRANT_URL`: Qdrant instance URL
- `QDRANT_API_KEY`: Qdrant API key (if required)
- `TARGET_SITE_URL`: The site to process

## Error Handling
- Network errors: Retry with exponential backoff
- API limits: Respect rate limits with appropriate delays
- Storage failures: Retry failed operations
- Invalid content: Skip and log errors