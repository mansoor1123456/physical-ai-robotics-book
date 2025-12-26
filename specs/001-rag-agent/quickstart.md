# Quickstart Guide: RAG Agent using OpenAI Agents SDK + FastAPI

## Overview
This guide provides instructions for setting up and running the RAG agent that answers questions using documentation content stored in Qdrant. The system uses FastAPI for the web framework, OpenAI Agents SDK for AI processing, and Qdrant for vector storage.

## Prerequisites
- Python 3.11+
- OpenAI API key
- Qdrant instance (local or cloud)
- Required Python packages (fastapi, openai, qdrant-client, python-dotenv, uvicorn)

## Installation
1. Clone or create the project directory
2. Install dependencies: `pip install fastapi openai qdrant-client python-dotenv uvicorn`
3. Set up environment variables (see Configuration section)

## Configuration
The system uses environment variables for sensitive information:
- `OPENAI_API_KEY`: Your OpenAI API key
- `QDRANT_URL`: Qdrant instance URL
- `QDRANT_API_KEY`: Qdrant API key (if required)
- `QDRANT_COLLECTION_NAME`: Name of the collection containing documentation vectors

Create a `.env` file with these variables.

## Running the Service
1. Start the service: `uvicorn main:app --reload`
2. The API will be available at `http://localhost:8000`
3. API documentation available at `http://localhost:8000/docs`

## API Usage
Send a POST request to `/query` with JSON payload:
```json
{
  "query_text": "Your question here",
  "context": "Optional additional context"
}
```

The response will include the answer and metadata about the retrieval process.

## Components Overview
- `main.py`: Main application entry point with FastAPI app
- `agents/rag_agent.py`: Implementation of the RAG agent using OpenAI Agents SDK
- `services/qdrant_service.py`: Qdrant vector database operations
- `services/rag_service.py`: RAG pipeline orchestration
- `api/query_endpoint.py`: Query endpoint for user requests
- `models/query_models.py`: Request/response models
- `config/settings.py`: Configuration management

## Testing
The system includes comprehensive error handling and validation. Test with various queries to ensure proper context retrieval and answer generation. Monitor response times to ensure they meet the 3-second requirement.