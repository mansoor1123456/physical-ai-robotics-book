import React, { useState } from 'react';
import Layout from '@theme/Layout';
import QueryInput from '../components/QueryInput';
import ResponseDisplay from '../components/ResponseDisplay';
import OfflineIndicator from '../components/OfflineIndicator';
import { BackendStatusProvider } from '../contexts/BackendStatusContext';

/**
 * Test query page for interacting with the RAG Agent backend
 */
const QueryPage = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);

  /**
   * Handle successful response from the API
   */
  const handleResponse = (responseData) => {
    setResponse(responseData);
    setError(null);
    setIsLoading(false);

    // Add to query history (limit to last 10 queries)
    setQueryHistory(prevHistory => {
      const newEntry = {
        id: Date.now(),
        query: responseData.queryText || 'Unknown query', // This would come from the query input
        response: responseData,
        timestamp: new Date()
      };

      // Keep only the last 10 items
      const updatedHistory = [newEntry, ...prevHistory].slice(0, 10);
      return updatedHistory;
    });
  };

  /**
   * Handle error from the API
   */
  const handleError = (errorData) => {
    setError(errorData);
    setResponse(null);
    setIsLoading(false);
  };

  return (
    <BackendStatusProvider>
      <Layout title="Query RAG Agent" description="Test page for querying the RAG Agent backend">
        <OfflineIndicator />
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Query the RAG Agent</h1>
              <p>Enter your question below to get an AI-generated response from the RAG Agent.</p>

              <QueryInput
                onResponse={handleResponse}
                onError={handleError}
              />

              <ResponseDisplay response={response} isLoading={isLoading} />

              {queryHistory.length > 0 && (
                <div className="query-history-section margin-top--lg">
                  <h3>Recent Queries</h3>
                  <div className="history-list">
                    {queryHistory.map((entry) => (
                      <div key={entry.id} className="history-item">
                        <div className="history-query">
                          <strong>Q:</strong> {entry.query}
                        </div>
                        <div className="history-response">
                          <strong>A:</strong> {entry.response.answerText}
                        </div>
                        <div className="history-timestamp">
                          {entry.timestamp.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .response-section {
            margin-top: 2rem;
            padding: 1.5rem;
            border-radius: 8px;
            background-color: #f8f9fa;
          }

          .sources-section {
            margin-top: 1rem;
          }

          .sources-section ul {
            list-style-type: disc;
            margin-left: 1.5rem;
          }

          .confidence-section, .metadata-section {
            margin-top: 0.5rem;
            font-style: italic;
          }
        .query-history-section {
          margin-top: 2rem;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f8f9fa;
        }

        .history-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .history-item {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          margin-bottom: 0.5rem;
        }

        .history-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .history-query, .history-response {
          margin-bottom: 0.5rem;
        }

        .history-timestamp {
          font-size: 0.8em;
          color: #666;
        }
      `}</style>
      </Layout>
    </BackendStatusProvider>
  );
};

export default QueryPage;