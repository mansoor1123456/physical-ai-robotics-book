import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorDisplay component for showing error messages to the user
 */
const ErrorDisplay = ({ error, onRetry, onClose }) => {
  // If no error is provided, don't render anything
  if (!error) {
    return null;
  }

  // Determine error type and message based on the error object
  let errorMessage = 'An unexpected error occurred.';
  let errorType = 'unknown';
  let showRetry = false;

  if (typeof error === 'string') {
    // Simple string error
    errorMessage = error;
  } else if (error.message) {
    // Error object with message
    errorMessage = error.message;

    // Check for specific error types
    if (error.status === null || error.message.includes('Network error')) {
      errorType = 'network';
      errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      showRetry = true;
    } else if (error.status >= 500) {
      errorType = 'server';
      errorMessage = `Server error (${error.status}). ${error.message || 'The server encountered an error.'}`;
      showRetry = true;
    } else if (error.status >= 400) {
      errorType = 'client';
      errorMessage = `Request failed (${error.status}). ${error.message || 'Please check your request and try again.'}`;
    }
  } else if (error.error) {
    // Error object with error property
    errorMessage = error.error;
  }

  return (
    <div className={`error-display error-type-${errorType}`}>
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-message">
          <h4>Error</h4>
          <p>{errorMessage}</p>
        </div>
        <div className="error-actions">
          {onRetry && showRetry && (
            <button className="retry-button" onClick={onRetry}>
              Try Again
            </button>
          )}
          {onClose && (
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .error-display {
          border: 1px solid #f44336;
          border-radius: 8px;
          background-color: #ffebee;
          margin: 10px 0;
          padding: 15px;
          color: #c62828;
        }

        .error-type-network {
          border-color: #ff9800;
          background-color: #fff3e0;
          color: #e65100;
        }

        .error-type-server {
          border-color: #f44336;
          background-color: #ffebee;
          color: #c62828;
        }

        .error-type-client {
          border-color: #ff9800;
          background-color: #fff3e0;
          color: #e65100;
        }

        .error-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .error-icon {
          font-size: 1.5em;
        }

        .error-message h4 {
          margin: 0 0 5px 0;
          font-size: 1.1em;
        }

        .error-message p {
          margin: 0;
          line-height: 1.4;
        }

        .error-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          width: 100%;
        }

        .retry-button, .close-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
        }

        .retry-button {
          background-color: #2196f3;
          color: white;
        }

        .retry-button:hover {
          background-color: #1976d2;
        }

        .close-button {
          background-color: #f5f5f5;
          color: #666;
        }

        .close-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
      status: PropTypes.number,
      error: PropTypes.any
    })
  ]),
  onRetry: PropTypes.func,
  onClose: PropTypes.func
};

ErrorDisplay.defaultProps = {
  error: null,
  onRetry: null,
  onClose: null
};

export default ErrorDisplay;