import apiService from '../api';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('API Service - Query Transmission', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should successfully transmit a query to the backend', async () => {
    // Mock the backend response
    const mockResponse = {
      query_id: 'test-query-123',
      answer: {
        id: 'test-answer-123',
        answer_text: 'This is a test answer from the RAG agent.',
        confidence_score: 0.95,
        sources: ['https://example.com/doc1', 'https://example.com/doc2'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-123'
      },
      retrieved_contexts: [],
      processing_time: 1.23,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockResponse);

    const queryText = 'What is the main concept of RAG?';
    const context = 'I am learning about AI systems';

    const response = await apiService.sendQuery(queryText, context);

    expect(response.id).toBe('test-query-123');
    expect(response.answer_text).toBe('This is a test answer from the RAG agent.');
    expect(response.sources).toEqual(['https://example.com/doc1', 'https://example.com/doc2']);
    expect(response.confidence_score).toBe(0.95);
    expect(response.processing_time).toBe(1.23);
    expect(response.status).toBe('success');
  });

  test('should handle empty context parameter', async () => {
    // Mock the backend response
    const mockResponse = {
      query_id: 'test-query-456',
      answer: {
        id: 'test-answer-456',
        answer_text: 'This is another test answer.',
        confidence_score: 0.85,
        sources: ['https://example.com/doc3'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-456'
      },
      retrieved_contexts: [],
      processing_time: 0.98,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockResponse);

    const queryText = 'How does the system work?';

    const response = await apiService.sendQuery(queryText);

    expect(response.id).toBe('test-query-456');
    expect(response.answer_text).toBe('This is another test answer.');
  });

  test('should handle backend error response', async () => {
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    const queryText = 'Test query for error handling';

    await expect(apiService.sendQuery(queryText)).rejects.toEqual({
      status: 500,
      message: 'Backend error occurred',
      error: { detail: 'Internal server error' }
    });
  });

  test('should handle network error', async () => {
    mock.onPost('/query').networkError();

    const queryText = 'Test query for network error';

    await expect(apiService.sendQuery(queryText)).rejects.toEqual({
      status: null,
      message: 'Network error - unable to reach backend',
      error: 'No response received from server'
    });
  });

  test('should handle timeout error', async () => {
    mock.onPost('/query').timeout();

    const queryText = 'Test query for timeout';

    await expect(apiService.sendQuery(queryText)).rejects.toEqual({
      status: null,
      message: 'Network error - unable to reach backend',
      error: 'No response received from server'
    });
  });
});

// Test for health check functionality
describe('API Service - Health Check', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should return health status', async () => {
    const mockHealthResponse = {
      status: 'healthy',
      components: {
        rag_service: 'ok'
      }
    };

    mock.onGet('/health').reply(200, mockHealthResponse);

    const response = await apiService.healthCheck();

    expect(response).toEqual(mockHealthResponse);
  });
});

// Test for proper request formatting
describe('API Service - Request Formatting', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should format request with query_text field', async () => {
    const mockResponse = {
      query_id: 'test-query-789',
      answer: {
        id: 'test-answer-789',
        answer_text: 'Test answer',
        confidence_score: 0.9,
        sources: [],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-789'
      },
      retrieved_contexts: [],
      processing_time: 0.5,
      status: 'success',
      error_message: null
    };

    // Mock to capture the request body
    mock.onPost('/query').reply((config) => {
      // Check that the request body has the correct format
      expect(config.data).toContain('"query_text"');
      expect(JSON.parse(config.data).query_text).toBe('Test query for formatting');
      return [200, mockResponse];
    });

    await apiService.sendQuery('Test query for formatting');

    // Verify that the mock was called
    expect(mock.history.post.length).toBe(1);
  });

  test('should format request with optional context field', async () => {
    const mockResponse = {
      query_id: 'test-query-790',
      answer: {
        id: 'test-answer-790',
        answer_text: 'Test answer with context',
        confidence_score: 0.85,
        sources: [],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-790'
      },
      retrieved_contexts: [],
      processing_time: 0.6,
      status: 'success',
      error_message: null
    };

    // Mock to capture the request body
    mock.onPost('/query').reply((config) => {
      const requestBody = JSON.parse(config.data);
      // Check that the request body has both query_text and context fields
      expect(requestBody).toHaveProperty('query_text');
      expect(requestBody).toHaveProperty('context');
      expect(requestBody.query_text).toBe('Test query with context');
      expect(requestBody.context).toBe('Additional context for testing');
      return [200, mockResponse];
    });

    await apiService.sendQuery('Test query with context', 'Additional context for testing');

    // Verify that the mock was called
    expect(mock.history.post.length).toBe(1);
  });

  test('should not include context field when not provided', async () => {
    const mockResponse = {
      query_id: 'test-query-791',
      answer: {
        id: 'test-answer-791',
        answer_text: 'Test answer without context',
        confidence_score: 0.88,
        sources: [],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-791'
      },
      retrieved_contexts: [],
      processing_time: 0.55,
      status: 'success',
      error_message: null
    };

    // Mock to capture the request body
    mock.onPost('/query').reply((config) => {
      const requestBody = JSON.parse(config.data);
      // Check that the request body has query_text but not context
      expect(requestBody).toHaveProperty('query_text');
      expect(requestBody).not.toHaveProperty('context');
      expect(requestBody.query_text).toBe('Test query without context');
      return [200, mockResponse];
    });

    await apiService.sendQuery('Test query without context');

    // Verify that the mock was called
    expect(mock.history.post.length).toBe(1);
  });
});