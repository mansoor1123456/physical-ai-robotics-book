import logging
from typing import List, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from config.settings import settings
from models.query_models import RetrievedContext
import time


logger = logging.getLogger(__name__)


class QdrantService:
    def __init__(self):
        # Initialize Qdrant client
        if settings.QDRANT_API_KEY:
            self.client = QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
            )
        else:
            self.client = QdrantClient(url=settings.QDRANT_URL)

        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """Ensure the collection exists in Qdrant"""
        try:
            collections = self.client.get_collections()
            existing_collections = [col.name for col in collections.collections]

            if self.collection_name not in existing_collections:
                # Create collection with appropriate vector size (assuming 1536-dim for text-embedding-ada-002)
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error checking/creating Qdrant collection: {e}")
            raise

    def search_context(self, query_vector: List[float], limit: int = 5) -> List[RetrievedContext]:
        """
        Search for relevant context in Qdrant based on the query vector.

        Args:
            query_vector: The vector representation of the query
            limit: Maximum number of results to return

        Returns:
            List of RetrievedContext objects
        """
        try:
            # Perform vector search in Qdrant
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True,
            )

            contexts = []
            for result in search_results:
                context = RetrievedContext(
                    id=str(result.id),
                    content=result.payload.get("content", ""),
                    source_url=result.payload.get("source_url", ""),
                    similarity_score=result.score,
                    metadata=result.payload.get("metadata", {})
                )
                contexts.append(context)

            logger.info(f"Retrieved {len(contexts)} context chunks from Qdrant")
            return contexts

        except Exception as e:
            logger.error(f"Error searching Qdrant: {e}")
            raise

    def add_document(self, doc_id: str, vector: List[float], content: str, source_url: str, metadata: dict = None):
        """
        Add a document to the Qdrant collection.

        Args:
            doc_id: Unique identifier for the document
            vector: The vector representation of the document
            content: The text content of the document
            source_url: URL or identifier of the original source
            metadata: Additional metadata for the document
        """
        try:
            if metadata is None:
                metadata = {}

            point = PointStruct(
                id=doc_id,
                vector=vector,
                payload={
                    "content": content,
                    "source_url": source_url,
                    "metadata": metadata
                }
            )

            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )

            logger.info(f"Added document {doc_id} to Qdrant collection")

        except Exception as e:
            logger.error(f"Error adding document to Qdrant: {e}")
            raise

    def health_check(self) -> bool:
        """
        Check if Qdrant service is accessible.

        Returns:
            True if service is accessible, False otherwise
        """
        try:
            # Try to get collection info as a basic health check
            self.client.get_collection(self.collection_name)
            return True
        except Exception:
            return False