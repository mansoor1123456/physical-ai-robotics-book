import React, { useState } from 'react';
import PropTypes from 'prop-types';
import apiService from '../services/api';
import { QueryRequest, FrontendUIState } from '../services/dataModels';
import loadingStateManager, { withLoadingState } from '../services/loadingState';

/**
 * QueryInput component for entering and submitting queries to the RAG Agent
 */
const QueryInput = ({ onResponse, onError }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);

  /**
   * Validate the query input
   * @param {string} query - The query to validate
   * @returns {Object} Validation result with isValid flag and message
   */
  const validateQuery = (query) => {
    if (!query || !query.trim()) {
      return {
        isValid: false,
        message: 'Please enter a question'
      };
    }

    if (query.trim().length < 3) {
      return {
        isValid: false,
        message: 'Query must be at least 3 characters long'
      };
    }

    if (query.trim().length > 2000) {
      return {
        isValid: false,
        message: 'Query is too long (maximum 2000 characters)'
      };
    }

    // Additional validation could be added here
    // For example, check for profanity, specific patterns, etc.

    return {
      isValid: true,
      message: null
    };
  };

  /**
   * Retry the last failed query
   */
  const retryLastQuery = async () => {
    if (!lastQuery) {
      setError('No previous query to retry');
      if (onError) onError('No previous query to retry');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Submit the last query using the API service
      const response = await withLoadingState(
        'query-submission',
        () => apiService.sendQuery(lastQuery.queryText, lastQuery.context),
        'Retrying your query...'
      );

      // Update UI state
      setIsLoading(false);

      // Call the response callback if provided
      if (onResponse) {
        onResponse({
          ...response,
          queryText: queryRequest.queryText
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred while processing your query');

      // Call the error callback if provided
      if (onError) {
        onError(err);
      }
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate input
    const validation = validateQuery(inputValue);
    if (!validation.isValid) {
      setError(validation.message);
      if (onError) onError(validation.message);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create a new query request and store it for potential retry
      const queryRequest = new QueryRequest(inputValue);
      setLastQuery(queryRequest);

      // Submit the query using the API service
      const response = await withLoadingState(
        'query-submission',
        () => apiService.sendQuery(queryRequest.queryText, queryRequest.context),
        'Processing your query...'
      );

      // Update UI state
      setIsLoading(false);

      // Call the response callback if provided
      if (onResponse) {
        onResponse({
          ...response,
          queryText: queryRequest.queryText
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred while processing your query');

      // Call the error callback if provided
      if (onError) {
        onError(err);
      }
    }
  };

  return (
    <div className="query-input-container">
      <form onSubmit={handleSubmit} className="query-form">
        <div className="input-group">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your question here..."
            className="query-textarea"
            rows="4"
            disabled={isLoading}
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 'Processing...' : 'Submit Query'}
          </button>

          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <span>{error}</span>
              <button
                type="button"
                className="retry-button"
                onClick={retryLastQuery}
                disabled={isLoading}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </form>

      <style jsx>{`
        .query-input-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .query-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-group {
          width: 100%;
        }

        .query-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          resize: vertical;
          min-height: 120px;
        }

        .query-textarea:focus {
          outline: none;
          border-color: #007cba;
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .submit-button {
          padding: 12px 24px;
          background-color: #007cba;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #005a87;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .submit-button.loading {
          background-color: #ccc;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007cba;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          padding: 10px;
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          margin-top: 10px;
        }

        .error-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .retry-button {
          padding: 5px 10px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .retry-button:hover:not(:disabled) {
          background-color: #1976d2;
        }

        .retry-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

QueryInput.propTypes = {
  onResponse: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default QueryInput;