# API Service Documentation

## Overview
The API service provides a centralized interface for communicating with the RAG Agent backend. It handles query submission, response processing, error handling, and loading states.

## Installation
The API service requires `axios` as a dependency. Install it using:
```bash
npm install axios
```

## Configuration
The API service is configured with the following default settings:
- Base URL: `http://localhost:8000/api/v1`
- Timeout: 30 seconds
- Security headers for XSS protection
- Request and response interceptors

## API Methods

### sendQuery(queryText, context = null)
Sends a query to the RAG Agent backend.

**Parameters:**
- `queryText` (string): The user's query text
- `context` (string, optional): Additional context for the query

**Returns:**
- Promise<Object>: Formatted response object with the following properties:
  - `id`: Response ID
  - `answer_text`: AI-generated answer
  - `sources`: Array of source URLs
  - `confidence_score`: Confidence level (0-1)
  - `processing_time`: Time taken in seconds
  - `status`: Response status
  - `error_message`: Error message if applicable
  - `timestamp`: Response timestamp

**Example:**
```javascript
import apiService from './services/api';

try {
  const response = await apiService.sendQuery("What is RAG?", "I'm learning about AI");
  console.log(response.answer_text);
} catch (error) {
  console.error('Query failed:', error.message);
}
```

### healthCheck()
Checks the health status of the backend service.

**Returns:**
- Promise<Object>: Health check response

## Security Measures
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
- CORS configured for specific origins only
- Request/response interceptors for additional security

## Error Handling
The API service handles various types of errors:
- Network errors
- Server errors (5xx)
- Client errors (4xx)
- Timeout errors
- Formatted error messages for user display

## Loading State Management
The API service integrates with the loading state management system to track request status.

## Components Documentation

### QueryInput Component
A React component for entering and submitting queries to the RAG Agent backend.

**Props:**
- `onResponse`: Callback function called when a response is received
- `onError`: Callback function called when an error occurs

**Features:**
- Input validation (minimum 3 characters, maximum 2000 characters)
- Loading state display
- Error handling with retry mechanism
- Accessibility features

### ResponseDisplay Component
A React component for displaying RAG Agent responses.

**Props:**
- `response`: Response object to display
- `isLoading`: Boolean indicating if a request is in progress

**Features:**
- Answer text display
- Sources attribution
- Confidence score display
- Processing time display
- Error state handling
- Loading state display

### ErrorDisplay Component
A React component for displaying error messages to users.

**Props:**
- `error`: Error object or message to display
- `onRetry`: Callback function for retry button
- `onClose`: Callback function for close button

### OfflineIndicator Component
A React component that displays when the backend is unavailable.

**Features:**
- Fixed position at top of screen
- Manual check button
- Last checked timestamp
- Visual indication of offline status

## Contexts Documentation

### BackendStatusContext
A React context that tracks backend availability status.

**Provides:**
- `isBackendAvailable`: Boolean indicating backend status
- `lastChecked`: Timestamp of last status check
- `checkBackendStatus`: Function to manually check status

## Data Models Documentation

### QueryRequest
Represents a query request to be sent to the backend.

**Properties:**
- `queryText`: The user's question
- `context`: Additional context (optional)
- `metadata`: Additional metadata (optional)
- `timestamp`: Creation timestamp

### QueryResponse
Represents the response from the backend.

**Properties:**
- `id`: Response ID
- `answerText`: AI-generated answer
- `sources`: Array of source URLs
- `confidenceScore`: Confidence level
- `processingTime`: Time taken in seconds
- `status`: Response status
- `errorMessage`: Error message if applicable

### CommunicationStatus
Represents the status of communication between frontend and backend.

**Properties:**
- `requestId`: Request identifier
- `status`: Communication status (idle, loading, success, error)
- `progress`: Progress percentage (0-1)
- `message`: Additional status message

### FrontendUIState
Represents the state of the frontend UI during query processing.

**Properties:**
- `inputValue`: Current input value
- `isLoading`: Loading state
- `response`: Current response
- `error`: Current error
- `history`: Query/response history

## Usage Examples

### Basic Query Submission
```javascript
import QueryInput from './components/QueryInput';

const MyPage = () => {
  const handleResponse = (response) => {
    console.log('Answer:', response.answer_text);
  };

  const handleError = (error) => {
    console.error('Error:', error.message);
  };

  return (
    <QueryInput onResponse={handleResponse} onError={handleError} />
  );
};
```

### Response Display
```javascript
import ResponseDisplay from './components/ResponseDisplay';

const MyPage = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ResponseDisplay response={response} isLoading={isLoading} />
  );
};
```

## Testing
The API service includes comprehensive tests for:
- Query transmission
- Error handling
- Timeout scenarios
- Response formatting
- End-to-end flows

Run tests with:
```bash
npm test
```