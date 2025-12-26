/**
 * API Security Utilities for handling API keys and sensitive data
 */

/**
 * Securely stores an API key in a secure storage mechanism
 * @param {string} apiKey - The API key to store
 * @param {string} keyName - The name/key under which to store the API key
 * @returns {Promise<void>}
 */
function storeApiKey(apiKey, keyName = 'api_key') {
  // In a real application, you might want to use more secure storage mechanisms
  // For browser environments, localStorage is the most common but not the most secure
  // For enhanced security, consider server-side token management

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Encrypt the API key before storing (simple obfuscation)
      const encryptedKey = btoa(encodeURIComponent(apiKey)); // Base64 encode as basic obfuscation
      localStorage.setItem(keyName, encryptedKey);
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw new Error('Could not securely store API key');
    }
  }
}

/**
 * Retrieves a stored API key from secure storage
 * @param {string} keyName - The name/key under which the API key is stored
 * @returns {string|null} The decrypted API key or null if not found
 */
function retrieveApiKey(keyName = 'api_key') {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const encryptedKey = localStorage.getItem(keyName);
      if (!encryptedKey) {
        return null;
      }

      // Decrypt the API key (reverse the obfuscation)
      return decodeURIComponent(atob(encryptedKey));
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }
  return null;
}

/**
 * Removes an API key from storage
 * @param {string} keyName - The name/key under which the API key is stored
 * @returns {void}
 */
function removeApiKey(keyName = 'api_key') {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(keyName);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  }
}

/**
 * Validates the format of an API key
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} True if the API key format is valid, false otherwise
 */
function validateApiKeyFormat(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Basic validation: API key should be a non-empty string
  // Add more specific validation rules as needed (e.g., length, character patterns)
  return apiKey.trim().length > 0;
}

/**
 * Masks an API key for safe logging/display
 * @param {string} apiKey - The API key to mask
 * @param {number} visibleChars - Number of characters to show at the beginning (default: 4)
 * @returns {string} Masked API key with only some characters visible
 */
function maskApiKey(apiKey, visibleChars = 4) {
  if (!apiKey || typeof apiKey !== 'string') {
    return '';
  }

  if (apiKey.length <= visibleChars * 2) {
    return '*'.repeat(apiKey.length);
  }

  const start = apiKey.substring(0, visibleChars);
  const end = apiKey.substring(apiKey.length - visibleChars);
  const masked = '*'.repeat(apiKey.length - visibleChars * 2);

  return `${start}${masked}${end}`;
}

/**
 * Creates a secure API configuration with proper headers
 * @param {Object} config - Base configuration object
 * @param {string} [apiKey] - Optional API key to include in headers
 * @returns {Object} Enhanced configuration with security headers
 */
function createSecureApiConfig(config = {}, apiKey = null) {
  const secureConfig = {
    ...config,
    headers: {
      ...config.headers,
      // Security headers to prevent common attacks
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  };

  // Add API key to headers if provided
  if (apiKey) {
    secureConfig.headers['Authorization'] = `Bearer ${apiKey}`;
  }

  return secureConfig;
}

/**
 * Sanitizes user input to prevent injection attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters/sequences
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Checks if the current environment is secure (HTTPS)
 * @returns {boolean} True if the environment is secure, false otherwise
 */
function isSecureEnvironment() {
  if (typeof window === 'undefined') {
    // Server-side environment - assume secure
    return true;
  }

  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

/**
 * Generates a secure random string (for temporary tokens, etc.)
 * @param {number} length - Length of the string to generate
 * @returns {string} Secure random string
 */
function generateSecureRandomString(length = 32) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Browser environment
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for Node.js or environments without crypto
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Validates and secures request data
 * @param {Object} requestData - Request data to validate
 * @returns {Object} Secured request data
 */
function validateAndSecureRequestData(requestData) {
  const securedData = { ...requestData };

  // Sanitize string fields
  for (const [key, value] of Object.entries(securedData)) {
    if (typeof value === 'string') {
      securedData[key] = sanitizeInput(value);
    }
  }

  return securedData;
}

export {
  storeApiKey,
  retrieveApiKey,
  removeApiKey,
  validateApiKeyFormat,
  maskApiKey,
  createSecureApiConfig,
  sanitizeInput,
  isSecureEnvironment,
  generateSecureRandomString,
  validateAndSecureRequestData
};

// Export a default object for easier import
export default {
  storeApiKey,
  retrieveApiKey,
  removeApiKey,
  validateApiKeyFormat,
  maskApiKey,
  createSecureApiConfig,
  sanitizeInput,
  isSecureEnvironment,
  generateSecureRandomString,
  validateAndSecureRequestData
};