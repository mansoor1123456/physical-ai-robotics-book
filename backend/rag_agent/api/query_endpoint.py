from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
import time
import logging
from models.query_models import UserQuery, APIResponse
from services.rag_service import RAGService
from config.settings import settings


logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize RAG service
rag_service = RAGService()


@router.post("/query", response_model=APIResponse)
async def query_endpoint(user_query: UserQuery):
    """
    Endpoint to accept user queries and return answers based on RAG.
    """
    start_time = time.time()
    query_id = f"query-{int(start_time)}"

    try:
        # Process the query using the RAG service
        result = await rag_service.process_query(user_query)

        processing_time = time.time() - start_time

        # Create API response
        api_response = APIResponse(
            query_id=query_id,
            answer=result.get("answer"),
            retrieved_contexts=result.get("contexts", []),
            processing_time=processing_time,
            status="success"
        )

        logger.info(f"Query {query_id} processed successfully in {processing_time:.2f}s")
        return api_response

    except Exception as e:
        processing_time = time.time() - start_time
        error_msg = str(e)
        logger.error(f"Error processing query {query_id}: {error_msg}")

        # Return error response
        error_response = APIResponse(
            query_id=query_id,
            answer=None,
            retrieved_contexts=[],
            processing_time=processing_time,
            status="error",
            error_message=error_msg
        )

        # Raise HTTP exception for server errors
        raise HTTPException(status_code=500, detail=error_msg)


@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    # Check if RAG service is healthy
    is_rag_healthy = await rag_service.health_check()

    if is_rag_healthy:
        return {"status": "healthy", "components": {"rag_service": "ok"}}
    else:
        return {"status": "degraded", "components": {"rag_service": "unhealthy"}}


# Include the router in the main app
def include_router(app):
    app.include_router(router, prefix="/api/v1", tags=["query"])