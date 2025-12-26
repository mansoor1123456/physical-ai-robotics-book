import asyncio
import logging
from typing import Dict, Any
from openai import AsyncOpenAI
from config.settings import settings
from models.query_models import UserQuery, GeneratedAnswer, RetrievedContext
from services.qdrant_service import QdrantService
from agents.rag_agent import RAGAgent
import uuid
from datetime import datetime


logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Initialize Qdrant service
        self.qdrant_service = QdrantService()

        # Initialize RAG agent
        self.rag_agent = RAGAgent()

        # Initialize embedding model
        self.embedding_model = "text-embedding-ada-002"

    async def process_query(self, user_query: UserQuery) -> Dict[str, Any]:
        """
        Process a user query through the RAG pipeline.

        Args:
            user_query: The user's query

        Returns:
            Dictionary containing the answer and retrieved contexts
        """
        try:
            # Step 1: Generate embedding for the query
            query_embedding = await self._get_embedding(user_query.query_text)

            # Step 2: Retrieve relevant contexts from Qdrant
            contexts = self.qdrant_service.search_context(query_embedding, limit=5)

            # Step 3: Generate answer using the RAG agent
            answer_text = await self.rag_agent.generate_answer(user_query.query_text, contexts)

            # Step 4: Create answer object
            answer = GeneratedAnswer(
                id=f"answer-{uuid.uuid4()}",
                answer_text=answer_text,
                confidence_score=0.9,  # Placeholder - would be calculated based on context relevance
                sources=[ctx.source_url for ctx in contexts],
                timestamp=datetime.now(),
                query_id=f"query-{uuid.uuid4()}"
            )

            return {
                "answer": answer,
                "contexts": contexts
            }

        except Exception as e:
            logger.error(f"Error processing query: {e}")
            raise

    async def _get_embedding(self, text: str) -> list:
        """
        Get embedding for text using OpenAI's embedding API.

        Args:
            text: Text to embed

        Returns:
            List of floats representing the embedding
        """
        try:
            response = await self.openai_client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error getting embedding: {e}")
            raise

    async def health_check(self) -> bool:
        """
        Check if the RAG service and its dependencies are healthy.

        Returns:
            True if all components are healthy, False otherwise
        """
        try:
            # Check if OpenAI client is accessible
            await self._get_embedding("health check")

            # Check if Qdrant service is accessible
            is_qdrant_healthy = self.qdrant_service.health_check()

            # Check if agent is initialized
            is_agent_healthy = self.rag_agent is not None

            return is_qdrant_healthy and is_agent_healthy

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False