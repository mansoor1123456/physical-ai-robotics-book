import apiService from '../api';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('API Service - Error Handling', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should handle network error properly', async () => {
    mock.onPost('/query').networkError();

    await expect(apiService.sendQuery('Test query')).rejects.toEqual({
      status: null,
      message: 'Network error - unable to reach backend',
      error: 'No response received from server'
    });
  });

  test('should handle timeout error properly', async () => {
    mock.onPost('/query').timeout();

    await expect(apiService.sendQuery('Test query')).rejects.toEqual({
      status: null,
      message: 'Network error - unable to reach backend',
      error: 'No response received from server'
    });
  });

  test('should handle 4xx client error properly', async () => {
    mock.onPost('/query').reply(400, {
      detail: 'Bad request'
    });

    await expect(apiService.sendQuery('Test query')).rejects.toEqual({
      status: 400,
      message: 'Backend error occurred',
      error: { detail: 'Bad request' }
    });
  });

  test('should handle 5xx server error properly', async () => {
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    await expect(apiService.sendQuery('Test query')).rejects.toEqual({
      status: 500,
      message: 'Backend error occurred',
      error: { detail: 'Internal server error' }
    });
  });

  test('should handle health check when backend is healthy', async () => {
    const mockHealthResponse = {
      status: 'healthy',
      components: {
        rag_service: 'ok'
      }
    };

    mock.onGet('/health').reply(200, mockHealthResponse);

    const result = await apiService.healthCheck();

    expect(result).toEqual({
      isHealthy: true,
      data: mockHealthResponse
    });
  });

  test('should handle health check when backend is not available', async () => {
    mock.onGet('/health').networkError();

    const result = await apiService.healthCheck();

    expect(result).toEqual({
      isHealthy: false,
      error: expect.anything()
    });
  });

  test('should return false for backend availability when offline', async () => {
    mock.onGet('/health').networkError();

    const result = await apiService.isBackendAvailable();

    expect(result).toBe(false);
  });

  test('should return true for backend availability when online', async () => {
    const mockHealthResponse = {
      status: 'healthy',
      components: {
        rag_service: 'ok'
      }
    };

    mock.onGet('/health').reply(200, mockHealthResponse);

    const result = await apiService.isBackendAvailable();

    expect(result).toBe(true);
  });
});

describe('API Service - Error Message Formatting', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should format error message for network issues', async () => {
    mock.onPost('/query').networkError();

    try {
      await apiService.sendQuery('Test query');
    } catch (error) {
      expect(error.message).toBe('Network error - unable to reach backend');
    }
  });

  test('should format error message for server errors', async () => {
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    try {
      await apiService.sendQuery('Test query');
    } catch (error) {
      expect(error.message).toBe('Backend error occurred');
    }
  });

  test('should format error message for client errors', async () => {
    mock.onPost('/query').reply(400, {
      detail: 'Bad request'
    });

    try {
      await apiService.sendQuery('Test query');
    } catch (error) {
      expect(error.message).toBe('Backend error occurred');
    }
  });
});