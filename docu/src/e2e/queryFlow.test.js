import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QueryPage from '../pages/QueryPage';
import { BackendStatusProvider } from '../contexts/BackendStatusContext';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

// Mock provider wrapper for tests
const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BackendStatusProvider>
      {children}
    </BackendStatusProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

describe('End-to-End: Complete Query-Response Flow', () => {
  beforeEach(() => {
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

  test('should handle successful query-response flow', async () => {
    // Mock the query response
    const mockQueryResponse = {
      query_id: 'test-query-123',
      answer: {
        id: 'test-answer-123',
        answer_text: 'This is the AI-generated answer to your question.',
        confidence_score: 0.92,
        sources: ['https://example.com/doc1', 'https://example.com/doc2'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-123'
      },
      retrieved_contexts: [],
      processing_time: 1.23,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').reply(200, mockQueryResponse);

    renderWithProviders(<QueryPage />);

    // Verify the page is loaded
    expect(screen.getByText('Query the RAG Agent')).toBeInTheDocument();
    expect(screen.getByText('Enter your question below to get an AI-generated response from the RAG Agent.')).toBeInTheDocument();

    // Find the query input and enter a question
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'What is the main concept of RAG?' } });

    // Find and click the submit button
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Verify loading state appears
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    // Wait for the response to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is the AI-generated answer to your question.')).toBeInTheDocument();
    });

    // Verify the response components are displayed
    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('Confidence:')).toBeInTheDocument();
    expect(screen.getByText('87.0%')).toBeInTheDocument(); // Note: This might be different based on actual implementation
    expect(screen.getByText('Took 1.23 seconds')).toBeInTheDocument();
  });

  test('should handle error response flow', async () => {
    // Mock an error response
    mock.onPost('/query').reply(500, {
      detail: 'Internal server error'
    });

    renderWithProviders(<QueryPage />);

    // Find the query input and enter a question
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Test query for error' } });

    // Find and click the submit button
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('An error occurred while processing your query')).toBeInTheDocument();
    });

    // Verify the error display includes a retry button
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('should handle validation error for empty query', async () => {
    renderWithProviders(<QueryPage />);

    // Find the query input but don't enter any text
    const queryInput = screen.getByRole('textbox');

    // Clear any existing text
    fireEvent.change(queryInput, { target: { value: '' } });

    // Find and click the submit button
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for the validation error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Please enter a question')).toBeInTheDocument();
    });
  });

  test('should handle validation error for short query', async () => {
    renderWithProviders(<QueryPage />);

    // Find the query input and enter a very short query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Hi' } });

    // Find and click the submit button
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for the validation error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Query must be at least 3 characters long')).toBeInTheDocument();
    });
  });

  test('should allow retry after error', async () => {
    // First, mock an error response
    mock.onPost('/query').replyOnce(500, {
      detail: 'Internal server error'
    });

    // Then, mock a successful response for the retry
    const mockSuccessResponse = {
      query_id: 'test-query-456',
      answer: {
        id: 'test-answer-456',
        answer_text: 'This is the successful answer after retry.',
        confidence_score: 0.88,
        sources: ['https://example.com/doc3'],
        timestamp: new Date().toISOString(),
        query_id: 'test-query-456'
      },
      retrieved_contexts: [],
      processing_time: 0.98,
      status: 'success',
      error_message: null
    };

    mock.onPost('/query').replyOnce(200, mockSuccessResponse);

    renderWithProviders(<QueryPage />);

    // Enter a query
    const queryInput = screen.getByRole('textbox');
    fireEvent.change(queryInput, { target: { value: 'Test query for retry' } });

    // Submit the query (first attempt - should fail)
    const submitButton = screen.getByText('Submit Query');
    fireEvent.click(submitButton);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('An error occurred while processing your query')).toBeInTheDocument();
    });

    // Click the retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Wait for the successful response to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is the successful answer after retry.')).toBeInTheDocument();
    });
  });

  test('should display offline indicator when backend is unavailable', async () => {
    // Mock a failed health check
    mock.onGet('/health').reply(500, {
      detail: 'Service unavailable'
    });

    renderWithProviders(<QueryPage />);

    // Wait for the offline indicator to appear
    await waitFor(() => {
      expect(screen.getByText('Backend is currently unavailable')).toBeInTheDocument();
    });
  });
});