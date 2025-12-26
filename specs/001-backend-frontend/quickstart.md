# Quickstart Guide: Backend-Frontend Integration

## Overview
This guide provides instructions for integrating the FastAPI backend (RAG Agent) with the Docusaurus frontend. The system enables the frontend to send queries to the backend and display AI-generated responses.

## Prerequisites
- Python 3.8+ for backend
- Node.js 14+ for frontend
- Both backend and frontend services running locally
- API keys configured for the RAG Agent

## Setup Instructions

### 1. Start the Backend Service
1. Navigate to the `rag_agent` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set environment variables in `.env` file
4. Start the FastAPI server: `uvicorn main:app --reload`
5. The backend will be available at `http://localhost:8000`

### 2. Configure Frontend API Service
1. In the frontend, create an API service to handle communication with the backend
2. Configure the base URL to point to your backend (e.g., `http://localhost:8000`)
3. Implement the API service with methods for:
   - Sending queries to `/api/v1/query` endpoint
   - Handling responses and errors appropriately
   - Managing loading states

### 3. Enable CORS (Backend Configuration)
1. In the FastAPI app, add CORS middleware:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],  # Frontend URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### 4. Implement Frontend Query Component
1. Create a query input component in the frontend
2. Add event handler to send queries to the backend API
3. Display responses in the UI with appropriate formatting
4. Implement error handling for API failures

## API Endpoint
The backend provides a `/api/v1/query` endpoint that accepts POST requests with JSON payload:
```json
{
  "query_text": "Your question here",
  "context": "Optional additional context"
}
```

The response will be in the format:
```json
{
  "query_id": "unique-id",
  "answer_text": "AI-generated answer",
  "sources": ["source1", "source2"],
  "confidence_score": 0.95,
  "processing_time": 1.23,
  "status": "success"
}
```

## Error Handling
- Network errors: Display user-friendly message and allow retry
- Backend unavailable: Show offline indicator
- Query processing errors: Display error details without exposing internal information
- Timeout: Implement reasonable timeout limits (e.g., 30 seconds)

## Testing the Integration
1. Start both backend and frontend services
2. Enter a question in the frontend query interface
3. Submit the query and verify the response appears
4. Test error scenarios by stopping the backend temporarily
5. Verify that loading states are displayed during processing

## Troubleshooting
- If CORS errors occur, verify the origin settings in backend middleware
- If requests fail, check that both services are running and URLs are correct
- For authentication issues, ensure API keys are properly configured