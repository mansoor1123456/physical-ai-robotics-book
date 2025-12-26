/**
 * API connection cleanup utilities for graceful shutdown handling
 */

// Store active requests for potential cancellation
const activeRequests = new Map();

/**
 * Registers an active request
 * @param {string} requestId - Unique identifier for the request
 * @param {Object} cancelToken - Axios cancel token source
 */
function registerActiveRequest(requestId, cancelToken) {
  activeRequests.set(requestId, cancelToken);
}

/**
 * Unregisters an active request
 * @param {string} requestId - Unique identifier for the request
 */
function unregisterActiveRequest(requestId) {
  activeRequests.delete(requestId);
}

/**
 * Cancels a specific request
 * @param {string} requestId - Unique identifier for the request
 * @param {string} message - Optional cancellation message
 */
function cancelRequest(requestId, message = 'Request cancelled') {
  const cancelToken = activeRequests.get(requestId);
  if (cancelToken) {
    cancelToken.cancel(message);
    activeRequests.delete(requestId);
  }
}

/**
 * Cancels all active requests
 * @param {string} message - Optional cancellation message
 */
function cancelAllRequests(message = 'All requests cancelled') {
  for (const [requestId, cancelToken] of activeRequests) {
    cancelToken.cancel(message);
  }
  activeRequests.clear();
}

/**
 * Cleanup function to be called when the application shuts down
 * or when components unmount
 */
function cleanup() {
  cancelAllRequests('Application cleanup');
}

/**
 * Hook for use in React components to handle cleanup
 * @param {Function} callback - Optional callback to run during cleanup
 * @returns {Function} Cleanup function
 */
function useApiCleanup(callback) {
  return function performCleanup() {
    cancelAllRequests('Component unmount');
    if (callback && typeof callback === 'function') {
      callback();
    }
  };
}

export {
  registerActiveRequest,
  unregisterActiveRequest,
  cancelRequest,
  cancelAllRequests,
  cleanup,
  useApiCleanup
};

// Add event listener for page unload to ensure cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanup);
}

export default cleanup;