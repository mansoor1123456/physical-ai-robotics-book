import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FloatingChatbot from './FloatingChatbot';
import apiService from '../services/api';

// Mock the API service
jest.mock('../services/api');

describe('FloatingChatbot Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the floating chat button initially', () => {
    render(<FloatingChatbot />);

    // Initially, the chat button should be visible
    const chatButton = screen.getByLabelText('Open chatbot');
    expect(chatButton).toBeInTheDocument();
    expect(chatButton).toHaveTextContent('💬');

    // Chat container should not be visible initially
    expect(screen.queryByLabelText('Close chat')).not.toBeInTheDocument();
  });

  test('toggles chat interface when button is clicked', async () => {
    render(<FloatingChatbot />);

    // Initially, the chat container should not be visible
    expect(screen.queryByLabelText('Close chat')).not.toBeInTheDocument();

    // Click the floating chat button to open the chat
    const chatButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(chatButton);

    // After clicking, the chat container should be visible
    await waitFor(() => {
      expect(screen.getByLabelText('Close chat')).toBeInTheDocument();
    });

    // Click the close button to close the chat
    const closeButton = screen.getByLabelText('Close chat');
    fireEvent.click(closeButton);

    // After closing, the chat container should disappear again
    expect(screen.queryByLabelText('Close chat')).not.toBeInTheDocument();
  });

  test('allows sending a message', async () => {
    // Mock the API response
    const mockResponse = {
      id: 'test-id',
      answer_text: 'This is the test response',
      sources: [],
      confidence_score: 0.9,
      processing_time: 0.5,
      status: 'success',
      error_message: null,
      timestamp: new Date()
    };

    apiService.sendQuery.mockResolvedValue(mockResponse);

    render(<FloatingChatbot />);

    // Open the chat
    const chatButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(chatButton);

    // Wait for chat to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    // Enter a message
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Test question' } });

    // Send the message
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });

    // Wait for the response to appear
    await waitFor(() => {
      expect(screen.getByText('This is the test response')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock an API error
    apiService.sendQuery.mockRejectedValue(new Error('API Error'));

    render(<FloatingChatbot />);

    // Open the chat
    const chatButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(chatButton);

    // Wait for chat to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    // Enter a message
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Test question' } });

    // Send the message
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });

    // Wait for the error response to appear
    await waitFor(() => {
      expect(screen.getByText('Sorry, there was an error processing your request. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables send button when input is empty', () => {
    render(<FloatingChatbot />);

    // Open the chat
    const chatButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(chatButton);

    // Find the send button
    const sendButton = screen.getByText('Send');

    // Initially, if input is empty, send button should be disabled
    expect(sendButton).toBeDisabled();

    // Enter some text
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Test' } });

    // Now the send button should be enabled
    expect(sendButton).not.toBeDisabled();
  });

  test('allows sending message with Enter key', async () => {
    // Mock the API response
    const mockResponse = {
      id: 'test-id',
      answer_text: 'This is the test response',
      sources: [],
      confidence_score: 0.9,
      processing_time: 0.5,
      status: 'success',
      error_message: null,
      timestamp: new Date()
    };

    apiService.sendQuery.mockResolvedValue(mockResponse);

    render(<FloatingChatbot />);

    // Open the chat
    const chatButton = screen.getByLabelText('Open chatbot');
    fireEvent.click(chatButton);

    // Wait for chat to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    // Enter a message
    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'Test question' } });

    // Press Enter key
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', char: '\r' });

    // Wait for the message to appear
    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });
});