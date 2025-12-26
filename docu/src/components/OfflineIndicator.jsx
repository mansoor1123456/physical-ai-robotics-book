import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useBackendStatus } from '../contexts/BackendStatusContext';

/**
 * OfflineIndicator component to show backend availability status
 */
const OfflineIndicator = () => {
  const { isBackendAvailable, lastChecked, checkBackendStatus } = useBackendStatus();
  const [isChecking, setIsChecking] = useState(false);

  const handleManualCheck = async () => {
    setIsChecking(true);
    await checkBackendStatus();
    setIsChecking(false);
  };

  if (isBackendAvailable) {
    return null; // Don't show anything when backend is available
  }

  return (
    <div className="offline-indicator">
      <div className="indicator-content">
        <span className="indicator-icon">🔴</span>
        <span className="indicator-text">Backend is currently unavailable</span>
        <button
          className="check-button"
          onClick={handleManualCheck}
          disabled={isChecking}
        >
          {isChecking ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {lastChecked && (
        <div className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      <style jsx>{`
        .offline-indicator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #ffcdd2;
          color: #c62828;
          padding: 8px 16px;
          text-align: center;
          z-index: 10000;
          border-bottom: 1px solid #b71c1c;
        }

        .indicator-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .indicator-icon {
          font-size: 1.2em;
        }

        .check-button {
          background-color: #c62828;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 0.9em;
        }

        .check-button:hover:not(:disabled) {
          background-color: #b71c1c;
        }

        .check-button:disabled {
          background-color: #e57373;
          cursor: not-allowed;
        }

        .last-checked {
          font-size: 0.8em;
          text-align: center;
          margin-top: 4px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

// This component uses the BackendStatusContext and doesn't take props
// It displays an indicator when the backend is unavailable

export default OfflineIndicator;