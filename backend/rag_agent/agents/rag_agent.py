import asyncio
import logging
from typing import List, Dict, Any
from openai import AsyncOpenAI
from config.settings import settings
from models.query_models import RetrievedContext


logger = logging.getLogger(__name__)


class RAGAgent:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model_name = settings.OPENAI_MODEL_NAME
        self.temperature = settings.OPENAI_TEMPERATURE
        self.max_tokens = settings.OPENAI_MAX_TOKENS

    async def generate_answer(self, query: str, contexts: List[RetrievedContext]) -> str:
        """
        Generate an answer based on the query and retrieved contexts.

        Args:
            query: The user's query
            contexts: List of retrieved contexts

        Returns:
            Generated answer text
        """
        try:
            # Prepare the context information
            context_texts = []
            for i, ctx in enumerate(contexts):
                context_texts.append(f"Context {i+1} (Source: {ctx.source_url}, Score: {ctx.similarity_score:.2f}):\n{ctx.content}")

            context_str = "\n\n".join(context_texts)

            # Create the system prompt
            system_prompt = f"""
            You are a helpful AI assistant that answers questions based on provided documentation.
            Your answers should be grounded in the provided context and not rely on general knowledge.
            If the provided context does not contain information to answer the question, clearly state that the information is not available in the documentation.
            Be concise but thorough in your responses.
            """

            # Create the user message
            user_message = f"""
            Context Information:
            {context_str}

            Question: {query}

            Please provide an answer based only on the provided context information.
            """

            # Call the OpenAI API
            response = await self.openai_client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )

            answer = response.choices[0].message.content.strip()
            return answer

        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            raise

    def validate_context_grounding(self, answer: str, contexts: List[RetrievedContext]) -> bool:
        """
        Validate that the answer is grounded in the provided contexts.

        Args:
            answer: The generated answer
            contexts: List of contexts used to generate the answer

        Returns:
            True if the answer appears to be grounded in the contexts, False otherwise
        """
        # This is a simplified validation - in practice, you might want more sophisticated checks
        answer_lower = answer.lower()

        # Check if key terms from contexts appear in the answer
        for ctx in contexts:
            ctx_content_lower = ctx.content.lower()
            # Simple check: if more than 10% of context content words appear in the answer
            ctx_words = set(ctx_content_lower.split())
            answer_words = set(answer_lower.split())
            common_words = ctx_words.intersection(answer_words)

            if len(common_words) > 0.1 * len(ctx_words):  # 10% overlap threshold
                return True

        # If no significant overlap found, check if the answer acknowledges lack of information
        no_info_phrases = ["not available in the documentation", "not found in the provided context", "no information provided"]
        for phrase in no_info_phrases:
            if phrase in answer_lower:
                return True

        return False