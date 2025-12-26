# Data Model: Backend-Frontend Integration

## Query Request Entity
**Description**: Represents the query request sent from the frontend to the backend

**Fields**:
- `query_text` (string): The user's question or query text
- `context` (string, optional): Additional context provided with the query
- `metadata` (object, optional): Additional metadata such as user information or session data
- `timestamp` (datetime): When the query was submitted

**Validation**:
- query_text must not be empty
- query_text length should be within API limits
- metadata keys must be valid strings

## Query Response Entity
**Description**: Represents the response from the backend to the frontend after processing the query

**Fields**:
- `id` (string): Unique identifier for the response
- `answer_text` (string): The AI-generated answer text
- `sources` (array[string]): List of source URLs or documents that contributed to the answer
- `confidence_score` (float): Confidence level in the answer's accuracy
- `processing_time` (float): Time taken to process the query in seconds
- `status` (string): Status of the request (success, error, timeout)
- `error_message` (string, optional): Error message if the status is error
- `timestamp` (datetime): When the response was generated

**Validation**:
- answer_text must not be empty when status is success
- sources must be valid URLs or document identifiers
- confidence_score must be between 0 and 1
- processing_time must be positive
- status must be one of the defined values

## Communication Status Entity
**Description**: Represents the state of communication between frontend and backend

**Fields**:
- `request_id` (string): Identifier linking to the original request
- `status` (string): Current status (idle, loading, success, error)
- `progress` (float): Progress percentage (0.0 to 1.0) if applicable
- `message` (string, optional): Additional status information
- `timestamp` (datetime): When the status was last updated

**Validation**:
- status must be one of the defined values
- progress must be between 0.0 and 1.0
- request_id must correspond to an active request

## Frontend UI State Entity
**Description**: Represents the state of the frontend user interface during query processing

**Fields**:
- `input_value` (string): Current value in the query input field
- `is_loading` (boolean): Whether the system is currently processing a query
- `response` (Query Response, optional): The response data if available
- `error` (string, optional): Error message to display to the user
- `history` (array[object]): History of previous queries and responses
- `last_updated` (datetime): When the state was last modified

**Validation**:
- history should have reasonable size limits to prevent memory issues
- input_value should be sanitized before submission
- is_loading should correlate with active API calls