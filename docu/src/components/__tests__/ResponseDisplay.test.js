import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseDisplay from '../ResponseDisplay';

describe('ResponseDisplay Component', () => {
  test('should display loading state when isLoading is true', () => {
    render(<ResponseDisplay isLoading={true} />);

    expect(screen.getByText('Processing your query...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // The spinner
  });

  test('should display empty state when no response is provided', () => {
    render(<ResponseDisplay />);

    expect(screen.getByText('Submit a query to see the AI-generated response here.')).toBeInTheDocument();
  });

  test('should display error state when response has error status', () => {
    const errorResponse = {
      status: 'error',
      error_message: 'An error occurred while processing your query.'
    };

    render(<ResponseDisplay response={errorResponse} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while processing your query.')).toBeInTheDocument();
  });

  test('should display error state when response has error_message', () => {
    const errorResponse = {
      status: 'success',
      error_message: 'Specific error message'
    };

    render(<ResponseDisplay response={errorResponse} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Specific error message')).toBeInTheDocument();
  });

  test('should display answer content when response has answerText', () => {
    const response = {
      answerText: 'This is the AI-generated answer to your question.',
      processingTime: 1.23,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText('This is the AI-generated answer to your question.')).toBeInTheDocument();
  });

  test('should display processing time when available', () => {
    const response = {
      answerText: 'Test answer',
      processingTime: 2.45,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Took 2.45 seconds')).toBeInTheDocument();
  });

  test('should display confidence score when available', () => {
    const response = {
      answerText: 'Test answer',
      confidenceScore: 0.87,
      processingTime: 1.5,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Confidence:')).toBeInTheDocument();
    expect(screen.getByText('87.0%')).toBeInTheDocument();
  });

  test('should display sources when available', () => {
    const response = {
      answerText: 'Test answer',
      sources: ['https://example.com/source1', 'https://example.com/source2'],
      processingTime: 1.0,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com/source1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com/source2' })).toBeInTheDocument();
  });

  test('should format confidence score to one decimal place', () => {
    const response = {
      answerText: 'Test answer',
      confidenceScore: 0.8765,
      processingTime: 1.0,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('87.7%')).toBeInTheDocument(); // Should be rounded to one decimal place
  });

  test('should handle response with all fields', () => {
    const response = {
      answerText: 'Comprehensive answer text',
      sources: ['https://example.com/doc1'],
      confidenceScore: 0.92,
      processingTime: 1.75,
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Comprehensive answer text')).toBeInTheDocument();
    expect(screen.getByText('Took 1.75 seconds')).toBeInTheDocument();
    expect(screen.getByText('92.0%')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://example.com/doc1' })).toBeInTheDocument();
  });

  test('should handle response without optional fields', () => {
    const response = {
      answerText: 'Answer without optional fields',
      status: 'success'
    };

    render(<ResponseDisplay response={response} />);

    expect(screen.getByText('Answer without optional fields')).toBeInTheDocument();
    // Processing time and confidence should not be displayed if not provided
    expect(screen.queryByText('Took')).not.toBeInTheDocument();
    expect(screen.queryByText('Confidence:')).not.toBeInTheDocument();
  });
});