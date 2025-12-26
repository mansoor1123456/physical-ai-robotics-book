/**
 * Loading state management for the frontend
 * Provides utilities for managing loading states during API calls
 */

/**
 * Loading state manager class
 */
class LoadingStateManager {
  constructor() {
    this.loadingStates = new Map(); // Store loading states by request ID
  }

  /**
   * Set loading state for a specific request
   * @param {string} requestId - Unique identifier for the request
   * @param {boolean} isLoading - Whether the request is loading
   * @param {string} [message] - Optional message to display
   */
  setLoading(requestId, isLoading, message = null) {
    this.loadingStates.set(requestId, {
      isLoading,
      message,
      timestamp: new Date()
    });
  }

  /**
   * Check if a specific request is loading
   * @param {string} requestId - Unique identifier for the request
   * @returns {boolean} True if loading, false otherwise
   */
  isLoading(requestId) {
    const state = this.loadingStates.get(requestId);
    return state ? state.isLoading : false;
  }

  /**
   * Get the loading message for a specific request
   * @param {string} requestId - Unique identifier for the request
   * @returns {string|null} Loading message or null
   */
  getLoadingMessage(requestId) {
    const state = this.loadingStates.get(requestId);
    return state ? state.message : null;
  }

  /**
   * Clear loading state for a specific request
   * @param {string} requestId - Unique identifier for the request
   */
  clearLoading(requestId) {
    this.loadingStates.delete(requestId);
  }

  /**
   * Get all loading states
   * @returns {Map} Map of all loading states
   */
  getAllLoadingStates() {
    return this.loadingStates;
  }

  /**
   * Check if any request is currently loading
   * @returns {boolean} True if any request is loading, false otherwise
   */
  isAnyLoading() {
    for (const [_, state] of this.loadingStates) {
      if (state.isLoading) {
        return true;
      }
    }
    return false;
  }
}

// Create a singleton instance
const loadingStateManager = new LoadingStateManager();
export default loadingStateManager;

/**
 * React hook for loading state management (if using React components)
 * This would be used in Docusaurus if creating React-based components
 */
export const useLoadingState = () => {
  return {
    setLoading: loadingStateManager.setLoading.bind(loadingStateManager),
    isLoading: loadingStateManager.isLoading.bind(loadingStateManager),
    getLoadingMessage: loadingStateManager.getLoadingMessage.bind(loadingStateManager),
    clearLoading: loadingStateManager.clearLoading.bind(loadingStateManager),
    isAnyLoading: loadingStateManager.isAnyLoading.bind(loadingStateManager)
  };
};

/**
 * Higher-order function to wrap async operations with loading state
 * @param {string} requestId - Unique identifier for the operation
 * @param {Function} asyncOperation - The async function to wrap
 * @param {string} [loadingMessage] - Optional message to show during loading
 * @returns {Promise} Promise that resolves with the result of the operation
 */
export const withLoadingState = async (requestId, asyncOperation, loadingMessage = null) => {
  try {
    loadingStateManager.setLoading(requestId, true, loadingMessage);
    const result = await asyncOperation();
    loadingStateManager.setLoading(requestId, false);
    return result;
  } catch (error) {
    loadingStateManager.setLoading(requestId, false);
    throw error;
  }
};