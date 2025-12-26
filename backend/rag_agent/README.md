# RAG Agent using OpenAI Agents SDK + FastAPI

A backend AI agent that answers questions using Retrieval-Augmented Generation (RAG) from Qdrant vector database.

## Features

- FastAPI-based REST API for accepting user queries
- Integration with OpenAI Agents SDK for intelligent responses
- Qdrant vector database for efficient context retrieval
- State-of-the-art RAG pipeline for documentation queries
- Asynchronous processing for high performance

## Prerequisites

- Python 3.8+
- OpenAI API key
- Qdrant instance (local or cloud)

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # Or if using pyproject.toml:
   pip install -e .
   ```

## Configuration

1. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your API keys and settings

## Usage

Start the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

## API Endpoints

- `GET /` - Root endpoint
- `POST /api/v1/query` - Submit a query and receive an answer
- `GET /api/v1/health` - Health check endpoint

## Architecture

The application follows a modular architecture with separation of concerns:

- `main.py` - Application entry point
- `api/` - API endpoints and routing
- `services/` - Business logic and service orchestration
- `agents/` - AI agent implementation
- `models/` - Data models and schemas
- `config/` - Configuration management

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `QDRANT_URL` - URL of your Qdrant instance
- `QDRANT_API_KEY` - Qdrant API key (if required)
- `QDRANT_COLLECTION_NAME` - Name of the collection containing documentation vectors
- `OPENAI_MODEL_NAME` - OpenAI model to use (default: gpt-4-turbo-preview)
- `APP_HOST` - Host to run the application on (default: 0.0.0.0)
- `APP_PORT` - Port to run the application on (default: 8000)