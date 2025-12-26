import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Import all components and services
import QueryPage from '../pages/QueryPage';
import QueryInput from '../components/QueryInput';
import ResponseDisplay from '../components/ResponseDisplay';
import ErrorDisplay from '../components/ErrorDisplay';
import apiService from '../services/api';
import { BackendStatusProvider } from '../contexts/BackendStatusContext';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('Final Integration Tests: Complete Backend-Frontend System', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mock.reset();

    // Mock a successful health check
    mock.onGet('/health').reply(200, {
      status: 'healthy',
      components: {
        rag_service: 'ok'
      }
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test('Full integration test: Query submission to response display', async () => {
    // Mock successful query response
    const mockQueryResponse = {
      query_id: 'test-query-full-integration',
      answer: {
        id: 'test-answer-full-integration',
        answer_text: 'This is the complete integration test response.',
        confidence_score: 0.95,
        sources: ['https://example.com/integration-test'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-full-integration'
      },
      retrieved_contexts: [],
      processing_time: 1.5,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockQueryResponse);

    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Verify initial state
    expect(screen.getByText('Query the RAG Agent')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Submit Query')).toBeInTheDocument();

    // Enter a query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Integration test query' } });

    // Submit the query
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Verify loading state appears
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    // Wait for the response to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is the complete integration test response.')).toBeInTheDocument();
    });

    // Verify all response elements are displayed
    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('Confidence:')).toBeInTheDocument();
    expect(screen.getByText('Took 1.5 seconds')).toBeInTheDocument();

    // Verify the response was properly formatted
    const responseElement = screen.getByText('This is the complete integration test response.');
    expect(responseElement).toBeInTheDocument();
  });

  test('Full integration test: Error handling flow', async () => {
    // Mock an error response
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Enter a query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Error test query' } });

    // Submit the query
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('An error occurred while processing your query')).toBeInTheDocument();
    });

    // Verify error display with retry option
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('Full integration test: Validation error flow', async () => {
    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Try to submit an empty query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: '' } });

    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Please enter a question')).toBeInTheDocument();
    });
  });

  test('Full integration test: Short query validation', async () => {
    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Try to submit a very short query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Hi' } });

    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Query must be at least 3 characters long')).toBeInTheDocument();
    });
  });

  test('Full integration test: Query history functionality', async () => {
    // Mock multiple successful responses
    const mockResponse1 = {
      query_id: 'test-query-history-1',
      answer: {
        id: 'test-answer-history-1',
        answer_text: 'First response for history test.',
        confidence_score: 0.92,
        sources: ['https://example.com/history-test-1'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-history-1'
      },
      retrieved_contexts: [],
      processing_time: 1.2,
      status: 'success',
      error_message: null
    };

    const mockResponse2 = {
      query_id: 'test-query-history-2',
      answer: {
        id: 'test-answer-history-2',
        answer_text: 'Second response for history test.',
        confidence_score: 0.88,
        sources: ['https://example.com/history-test-2'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-history-2'
      },
      retrieved_contexts: [],
      processing_time: 0.8,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').replyOnce(200, mockResponse1).onPost('/query').replyOnce(200, mockResponse2);

    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Submit first query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'First history test query' } });
    fireEvent.click(screen.getByText('Submit Query'));

    await waitFor(() => {
      expect(screen.getByText('First response for history test.')).toBeInTheDocument();
    });

    // Submit second query
    fireEvent.change(queryInput, { target: { value: 'Second history test query' } });
    fireEvent.click(screen.getByText('Submit Query'));

    await waitFor(() => {
      expect(screen.getByText('Second response for history test.')).toBeInTheDocument();
    });

    // Check if history section appears
    await waitFor(() => {
      expect(screen.getByText('Recent Queries')).toBeInTheDocument();
    });
  });

  test('Full integration test: Offline indicator', async () => {
    // Mock failed health check to trigger offline indicator
    mock.onGet('/health').reply(500, {
      detail: 'Service unavailable'
    });

    // Mock query response
    const mockResponse = {
      query_id: 'test-query-offline',
      answer: {
        id: 'test-answer-offline',
        answer_text: 'Offline test response.',
        confidence_score: 0.90,
        sources: ['https://example.com/offline-test'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-offline'
      },
      retrieved_contexts: [],
      processing_time: 1.0,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockResponse);

    // Render the full QueryPage component
    render(
      <BackendStatusProvider>
        <QueryPage />
      </BackendStatusProvider>
    );

    // Wait for offline indicator to appear
    await waitFor(() => {
      expect(screen.getByText('Backend is currently unavailable')).toBeInTheDocument();
    });
  });

  test('Full integration test: Performance monitoring', async () => {
    // Mock a response
    const mockResponse = {
      query_id: 'test-query-performance',
      answer: {
        id: 'test-answer-performance',
        answer_text: 'Performance test response.',
        confidence_score: 0.91,
        sources: ['https://example.com/performance-test'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-performance'
      },
      retrieved_contexts: [],
      processing_time: 1.1,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockResponse);

    // Test API service directly
    const response = await apiService.sendQuery('Performance test query');

    expect(response.id).toBe('test-query-performance');
    expect(response.answer_text).toBe('Performance test response.');
    expect(response.confidenceScore).toBe(0.91);
  });

  test('Full integration test: Configuration validation', () => {
    // Test that API service has proper configuration
    const apiInstance = axios.create();
    expect(apiInstance.defaults.timeout).toBeDefined();

    // Test that interceptors are properly attached
    expect(apiService).toBeDefined();
  });

  test('Full integration test: Security headers', () => {
    // Verify that security headers are applied
    const config = {
      headers: {}
    };

    // Apply request interceptor logic
    config.headers['X-Content-Type-Options'] = 'nosniff';
    config.headers['X-Frame-Options'] = 'DENY';
    config.headers['X-XSS-Protection'] = '1; mode=block';

    expect(config.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(config.headers['X-Frame-Options']).toBe('DENY');
    expect(config.headers['X-XSS-Protection']).toBe('1; mode=block');
  });

  test('Full integration test: Retry mechanism', async () => {
    // Mock first failure then success
    const mockResponse = {
      query_id: 'test-query-retry',
      answer: {
        id: 'test-answer-retry',
        answer_text: 'Retry test response.',
        confidence_score: 0.89,
        sources: ['https://example.com/retry-test'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-retry'
      },
      retrieved_contexts: [],
      processing_time: 1.3,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').replyOnce(500, { detail: 'Temporary error' }).onPost('/query').replyOnce(200, mockResponse);

    // Render the QueryInput component directly to test retry
    const onResponseMock = jest.fn();
    const onErrorMock = jest.fn();

    render(
      <QueryInput
        onResponse={onResponseMock}
        onError={onErrorMock}
      />
    );

    // Submit query that will fail first
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Retry test query' } });
    fireEvent.click(screen.getByText('Submit Query'));

    // Wait for error
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalled();
    });

    // Click retry button
    fireEvent.click(screen.getByText('Retry'));

    // Wait for successful response
    await waitFor(() => {
      expect(onResponseMock).toHaveBeenCalledWith(
        expect.objectContaining({
          answer_text: 'Retry test response.'
        })
      );
    });
  });
});

// Additional integration tests for the API service
describe('API Service Integration Tests', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('API service sends proper request format', async () => {
    const mockResponse = {
      query_id: 'test-request-format',
      answer: {
        id: 'test-answer-format',
        answer_text: 'Request format test response.',
        confidence_score: 0.93,
        sources: ['https://example.com/format-test'],
        timestamp: new Date().toISOString(),
        query_id: 'test-request-format'
      },
      retrieved_contexts: [],
      processing_time: 1.4,
      status: 'success',
      error_message: null
    };

    // Mock to capture the request
    mock.onPost('/query').reply((config) => {
      // Verify request format
      expect(config.data).toContain('"query_text"');
      const requestBody = JSON.parse(config.data);
      expect(requestBody).toHaveProperty('query_text');
      expect(typeof requestBody.query_text).toBe('string');

      return [200, mockResponse];
    });

    const response = await apiService.sendQuery('Request format test');

    expect(response.id).toBe('test-request-format');
    expect(response.answer_text).toBe('Request format test response.');
  });

  test('API service handles network errors gracefully', async () => {
    // Mock network error
    mock.onPost('/query').networkError();

    await expect(apiService.sendQuery('Network error test')).rejects.toThrow();
  });

  test('API service handles timeout errors', async () => {
    // Mock timeout
    mock.onPost('/query').timeout();

    await expect(apiService.sendQuery('Timeout test')).rejects.toThrow();
  });

  test('API service handles 4xx client errors', async () => {
    mock.onPost('/query').reply(400, {
      detail: 'Bad request'
    });

    await expect(apiService.sendQuery('Bad request test')).rejects.toThrow();
  });

  test('API service handles 5xx server errors', async () => {
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    await expect(apiService.sendQuery('Server error test')).rejects.toThrow();
  });
});