import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResponseDisplay component for showing RAG Agent responses
 */
const ResponseDisplay = ({ response, isLoading = false }) => {
  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="response-display loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Processing your query...</p>
        </div>
      </div>
    );
  }

  // If no response, show empty state
  if (!response) {
    return (
      <div className="response-display empty">
        <p>Submit a query to see the AI-generated response here.</p>
      </div>
    );
  }

  // If response has an error, show error state
  if (response.status === 'error' || response.error_message) {
    return (
      <div className="response-display error">
        <h3>Error</h3>
        <p>{response.error_message || 'An error occurred while processing your query.'}</p>
      </div>
    );
  }

  // Show the response
  return (
    <div className="response-display">
      <div className="response-header">
        <h3>Response</h3>
        {response.processingTime && (
          <span className="processing-time">Took {response.processingTime} seconds</span>
        )}
      </div>

      {response.answerText && (
        <div className="answer-section">
          <h4>Answer:</h4>
          <div className="answer-content">
            {response.answerText}
          </div>
        </div>
      )}

      {response.confidenceScore !== null && response.confidenceScore !== undefined && (
        <div className="confidence-section">
          <h4>Confidence:</h4>
          <div className="confidence-score">
            <span className="score">{(response.confidenceScore * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {response.sources && response.sources.length > 0 && (
        <div className="sources-section">
          <h4>Sources:</h4>
          <ul className="sources-list">
            {response.sources.map((source, index) => (
              <li key={index} className="source-item">
                <a href={source} target="_blank" rel="noopener noreferrer">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .response-display {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          background-color: #fff;
        }

        .response-display.loading {
          text-align: center;
          padding: 40px;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007cba;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .response-display.empty {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }

        .response-display.error {
          border-color: #f44336;
          background-color: #ffebee;
          padding: 20px;
        }

        .response-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .processing-time {
          font-size: 0.9em;
          color: #666;
        }

        .answer-section {
          margin-bottom: 20px;
        }

        .answer-content {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          line-height: 1.6;
        }

        .confidence-section {
          margin-bottom: 20px;
        }

        .confidence-score {
          display: inline-block;
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 5px 10px;
          border-radius: 12px;
          font-weight: bold;
        }

        .sources-section {
          margin-top: 20px;
        }

        .sources-list {
          list-style: none;
          padding: 0;
        }

        .source-item {
          margin-bottom: 8px;
        }

        .source-item a {
          color: #007cba;
          text-decoration: none;
        }

        .source-item a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

ResponseDisplay.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.string,
    answerText: PropTypes.string,
    sources: PropTypes.arrayOf(PropTypes.string),
    confidenceScore: PropTypes.number,
    processingTime: PropTypes.number,
    status: PropTypes.string,
    error_message: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date)
  }),
  isLoading: PropTypes.bool
};

ResponseDisplay.defaultProps = {
  response: null,
  isLoading: false
};

export default ResponseDisplay;