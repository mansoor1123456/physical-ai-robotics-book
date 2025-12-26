/**
 * Data models for the frontend that correspond to backend response structures
 */

/**
 * Represents the query request sent from the frontend to the backend
 */
export class QueryRequest {
  /**
   * @param {string} queryText - The user's question or query text
   * @param {string} [context] - Optional additional context provided with the query
   * @param {Object} [metadata] - Additional metadata such as user information or session data
   */
  constructor(queryText, context = null, metadata = null) {
    this.queryText = queryText;
    this.context = context;
    this.metadata = metadata;
    this.timestamp = new Date();
  }

  /**
   * Validate the query request
   * @returns {boolean} True if valid, false otherwise
   */
  validate() {
    return this.queryText && this.queryText.trim().length > 0;
  }

  /**
   * Convert to backend-compatible format
   * @returns {Object} Backend-compatible request object
   */
  toBackendFormat() {
    const result = {
      query_text: this.queryText
    };

    if (this.context) {
      result.context = this.context;
    }

    if (this.metadata) {
      result.metadata = this.metadata;
    }

    return result;
  }
}

/**
 * Represents the response from the backend to the frontend after processing the query
 */
export class QueryResponse {
  /**
   * @param {string} id - Unique identifier for the response
   * @param {string} answerText - The AI-generated answer text
   * @param {Array<string>} sources - List of source URLs or documents that contributed to the answer
   * @param {number} confidenceScore - Confidence level in the answer's accuracy
   * @param {number} processingTime - Time taken to process the query in seconds
   * @param {string} status - Status of the request (success, error, timeout)
   * @param {string} [errorMessage] - Error message if the status is error
   */
  constructor(id, answerText, sources, confidenceScore, processingTime, status, errorMessage = null) {
    this.id = id;
    this.answerText = answerText;
    this.sources = sources || [];
    this.confidenceScore = confidenceScore;
    this.processingTime = processingTime;
    this.status = status;
    this.errorMessage = errorMessage;
    this.timestamp = new Date();
  }

  /**
   * Create QueryResponse instance from backend response
   * @param {Object} backendResponse - Raw response from backend
   * @returns {QueryResponse} Instance of QueryResponse
   */
  static fromBackendResponse(backendResponse) {
    return new QueryResponse(
      backendResponse.query_id,
      backendResponse.answer ? backendResponse.answer.answer_text : null,
      backendResponse.answer ? backendResponse.answer.sources : [],
      backendResponse.answer ? backendResponse.answer.confidence_score : null,
      backendResponse.processing_time,
      backendResponse.status,
      backendResponse.error_message
    );
  }

  /**
   * Check if the response indicates success
   * @returns {boolean} True if successful, false otherwise
   */
  isSuccess() {
    return this.status === 'success' && this.answerText !== null;
  }
}

/**
 * Represents the state of communication between frontend and backend
 */
export class CommunicationStatus {
  /**
   * @param {string} requestId - Identifier linking to the original request
   * @param {string} status - Current status (idle, loading, success, error)
   * @param {number} [progress] - Progress percentage (0.0 to 1.0) if applicable
   * @param {string} [message] - Additional status information
   */
  constructor(requestId, status, progress = 0.0, message = null) {
    this.requestId = requestId;
    this.status = status;
    this.progress = progress;
    this.message = message;
    this.timestamp = new Date();
  }

  /**
   * Check if the communication is in progress
   * @returns {boolean} True if loading, false otherwise
   */
  isLoading() {
    return this.status === 'loading';
  }

  /**
   * Check if the communication was successful
   * @returns {boolean} True if successful, false otherwise
   */
  isSuccess() {
    return this.status === 'success';
  }

  /**
   * Check if the communication had an error
   * @returns {boolean} True if error, false otherwise
   */
  isError() {
    return this.status === 'error';
  }
}

/**
 * Represents the state of the frontend user interface during query processing
 */
export class FrontendUIState {
  /**
   * @param {string} inputValue - Current value in the query input field
   * @param {boolean} isLoading - Whether the system is currently processing a query
   * @param {QueryResponse} [response] - The response data if available
   * @param {string} [error] - Error message to display to the user
   * @param {Array<Object>} [history] - History of previous queries and responses
   */
  constructor(inputValue = '', isLoading = false, response = null, error = null, history = []) {
    this.inputValue = inputValue;
    this.isLoading = isLoading;
    this.response = response;
    this.error = error;
    this.history = history;
    this.lastUpdated = new Date();
  }

  /**
   * Update the input value
   * @param {string} newValue - New input value
   */
  updateInputValue(newValue) {
    this.inputValue = newValue;
    this.lastUpdated = new Date();
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether the system is loading
   */
  setLoading(loading) {
    this.isLoading = loading;
    this.lastUpdated = new Date();
  }

  /**
   * Set response data
   * @param {QueryResponse} response - Response data
   */
  setResponse(response) {
    this.response = response;
    this.lastUpdated = new Date();
  }

  /**
   * Set error message
   * @param {string} error - Error message
   */
  setError(error) {
    this.error = error;
    this.lastUpdated = new Date();
  }

  /**
   * Add to history
   * @param {Object} queryResponsePair - Object containing query and response
   */
  addToHistory(queryResponsePair) {
    this.history.push(queryResponsePair);
    this.lastUpdated = new Date();
  }
}