# Usage Examples and Documentation

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Components Usage](#components-usage)
5. [API Service](#api-service)
6. [Error Handling](#error-handling)
7. [Performance Monitoring](#performance-monitoring)
8. [Configuration](#configuration)
9. [Security Features](#security-features)

## Overview

This documentation provides usage examples for the backend-frontend integration that connects a FastAPI backend (RAG Agent) with a Docusaurus frontend. The system enables the frontend to send queries and receive AI-generated responses from the RAG Agent backend.

## Installation

First, install the required dependencies:

```bash
# Install frontend dependencies
npm install axios prop-types

# Make sure backend is running
cd backend/rag_agent
python -m uvicorn main:app --reload
```

## Basic Usage

### Query Page Setup

To create a page that uses the query functionality, import the necessary components:

```jsx
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QueryInput from '../components/QueryInput';
import ResponseDisplay from '../components/ResponseDisplay';
import OfflineIndicator from '../components/OfflineIndicator';
import { BackendStatusProvider } from '../contexts/BackendStatusContext';

const QueryPage = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResponse = (responseData) => {
    setResponse(responseData);
    setError(null);
    setIsLoading(false);
  };

  const handleError = (errorData) => {
    setError(errorData);
    setResponse(null);
    setIsLoading(false);
  };

  return (
    <BackendStatusProvider>
      <Layout title="Query RAG Agent" description="Query the RAG Agent backend">
        <OfflineIndicator />
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Query the RAG Agent</h1>
              <QueryInput
                onResponse={handleResponse}
                onError={handleError}
              />
              <ResponseDisplay response={response} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </Layout>
    </BackendStatusProvider>
  );
};

export default QueryPage;
```

## Components Usage

### QueryInput Component

The `QueryInput` component allows users to enter and submit queries:

```jsx
import QueryInput from '../components/QueryInput';

// Usage
<QueryInput
  onResponse={(response) => {
    console.log('Received response:', response);
  }}
  onError={(error) => {
    console.error('Error occurred:', error);
  }}
/>
```

**Props:**
- `onResponse`: Function called when a response is successfully received
- `onError`: Function called when an error occurs

### ResponseDisplay Component

The `ResponseDisplay` component shows the response from the backend:

```jsx
import ResponseDisplay from '../components/ResponseDisplay';

// Usage
<ResponseDisplay
  response={responseObject}
  isLoading={isLoadingState}
/>
```

**Props:**
- `response`: The response object from the API
- `isLoading`: Boolean indicating if a request is in progress

### ErrorDisplay Component

The `ErrorDisplay` component shows error messages to users:

```jsx
import ErrorDisplay from '../components/ErrorDisplay';

// Usage
<ErrorDisplay
  error={errorObject}
  onRetry={retryFunction}
  onClose={closeFunction}
/>
```

**Props:**
- `error`: Error object or message to display
- `onRetry`: Function to call when user clicks retry
- `onClose`: Function to call when user clicks close

## API Service

### Making Requests

The API service provides methods to interact with the backend:

```javascript
import apiService from '../services/api';

// Send a query
try {
  const response = await apiService.sendQuery('What is RAG?', 'I am learning about AI');
  console.log('Answer:', response.answer_text);
} catch (error) {
  console.error('Query failed:', error.message);
}

// Check health status
try {
  const healthStatus = await apiService.healthCheck();
  console.log('Health status:', healthStatus);
} catch (error) {
  console.error('Health check failed:', error);
}
```

### Response Format

The API service returns responses in the following format:

```javascript
{
  id: 'query-123',
  answer_text: 'AI-generated answer text',
  sources: ['https://example.com/doc1', 'https://example.com/doc2'],
  confidence_score: 0.92,
  processing_time: 1.23,
  status: 'success',
  error_message: null,
  timestamp: new Date()
}
```

## Error Handling

The system provides comprehensive error handling:

```javascript
// Example error response format
{
  status: 500, // HTTP status code or null for network errors
  message: 'Backend error occurred', // User-friendly message
  error: { // Original error details
    detail: 'Internal server error'
  }
}

// Handle different error types
apiService.sendQuery(query)
  .then(response => {
    // Handle successful response
  })
  .catch(error => {
    if (error.status === null) {
      // Network error
      console.error('Network error - check connection');
    } else if (error.status >= 500) {
      // Server error
      console.error('Server error - please try again later');
    } else if (error.status >= 400) {
      // Client error
      console.error('Request error - check your input');
    }
  });
```

### Retry Mechanism

Failed requests can be retried:

```javascript
// The QueryInput component includes a retry button for errors
// Or you can implement your own retry logic:

const retryQuery = async (originalQuery, context) => {
  try {
    const response = await apiService.sendQuery(originalQuery, context);
    return response;
  } catch (error) {
    // Implement exponential backoff or other retry strategies
    console.log('Retrying request...');
    return await new Promise(resolve => setTimeout(resolve, 1000))
      .then(() => apiService.sendQuery(originalQuery, context));
  }
};
```

## Performance Monitoring

The system includes performance monitoring:

```javascript
import { getPerformanceMetrics, logPerformanceMetrics } from '../services/performanceMonitoring';

// Get metrics for a specific endpoint
const queryMetrics = getPerformanceMetrics('query');
console.log('Query performance:', queryMetrics);

// Log all performance metrics to console
logPerformanceMetrics();

// Metrics include:
// - Average response time
// - Min/Max response times
// - 95th and 99th percentiles
// - Success rate
// - Request count
```

## Configuration

### Environment Variables

Set environment variables for configuration:

```env
# API configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_API_TIMEOUT=30000
REACT_APP_API_MAX_RETRIES=3
REACT_APP_API_RETRY_DELAY=1000
```

### Configuration Validation

The system validates configuration settings:

```javascript
import getValidatedConfig from '../services/configValidation';

const configResult = getValidatedConfig();
if (!configResult.isValid) {
  console.error('Configuration errors:', configResult.errors);
  // Uses defaults
}
const config = configResult.config;
```

## Security Features

### Security Headers

The API service includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### CORS Configuration

The backend is configured to allow specific origins:

```python
# In backend/rag_agent/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Offline Handling

The system detects when the backend is unavailable:

```jsx
// The OfflineIndicator component shows when backend is offline
import OfflineIndicator from '../components/OfflineIndicator';

// Usage
<OfflineIndicator />

// Or check status programmatically
import { useBackendStatus } from '../contexts/BackendStatusContext';

const MyComponent = () => {
  const { isBackendAvailable, lastChecked, checkBackendStatus } = useBackendStatus();

  return (
    <div>
      {isBackendAvailable ? (
        <p>Backend is available</p>
      ) : (
        <p>Backend is currently unavailable</p>
      )}
    </div>
  );
};
```

## Query History

The system maintains a history of recent queries:

```javascript
// Query history is managed in the QueryPage component
// History items include:
// - Original query text
// - Response data
// - Timestamp
// - Limited to last 10 queries
```

## Testing

### Unit Tests

Unit tests are available for the API service:

```bash
# Run tests
npm test
```

### End-to-End Tests

End-to-end tests verify the complete flow:

```javascript
// Example end-to-end test
test('should handle successful query-response flow', async () => {
  // Mock the query response
  mock.onPost('/query').reply(200, mockResponse);

  // Test the flow
  const queryInput = screen.getByRole('textbox');
  fireEvent.change(queryInput, { target: { value: 'Test question' } });

  const submitButton = screen.getByText('Submit Query');
  fireEvent.click(submitButton);

  // Verify response display
  await waitFor(() => {
    expect(screen.getByText('Expected answer')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration allows the frontend origin
2. **Network Errors**: Check that both backend and frontend are running
3. **Validation Errors**: Check that queries meet minimum length requirements
4. **Timeout Errors**: Increase timeout values if processing is slow

### Debugging

Enable detailed logging by adding:

```javascript
// Log API requests and responses
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  }
);
```

This documentation provides comprehensive examples for using the backend-frontend integration system. For additional support, refer to the individual component and service documentation files.