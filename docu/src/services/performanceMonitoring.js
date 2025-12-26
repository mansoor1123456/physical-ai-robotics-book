/**
 * Performance monitoring for API response times
 */

// Store performance metrics
const performanceMetrics = {
  requests: [],
  averages: {
    query: null,
    health: null
  },
  percentiles: {
    query: null,
    health: null
  }
};

// Maximum number of requests to keep in memory for calculating averages
const MAX_REQUESTS_FOR_METRICS = 100;

/**
 * Records a performance metric for an API request
 * @param {string} endpoint - The API endpoint that was called
 * @param {number} responseTime - The response time in milliseconds
 * @param {number} statusCode - The HTTP status code of the response
 */
function recordPerformanceMetric(endpoint, responseTime, statusCode) {
  const metric = {
    endpoint,
    responseTime,
    statusCode,
    timestamp: Date.now()
  };

  // Add to requests array
  performanceMetrics.requests.push(metric);

  // Keep only the most recent requests to avoid memory issues
  if (performanceMetrics.requests.length > MAX_REQUESTS_FOR_METRICS) {
    performanceMetrics.requests = performanceMetrics.requests.slice(-MAX_REQUESTS_FOR_METRICS);
  }

  // Update averages
  updateAverages();
}

/**
 * Updates the average response times for each endpoint
 */
function updateAverages() {
  // Calculate averages for each endpoint
  const endpoints = [...new Set(performanceMetrics.requests.map(req => req.endpoint))];

  for (const endpoint of endpoints) {
    const endpointRequests = performanceMetrics.requests.filter(req => req.endpoint === endpoint);
    if (endpointRequests.length > 0) {
      const totalResponseTime = endpointRequests.reduce((sum, req) => sum + req.responseTime, 0);
      performanceMetrics.averages[endpoint] = totalResponseTime / endpointRequests.length;
    }
  }
}

/**
 * Calculates percentile values for response times
 * @param {string} endpoint - The endpoint to calculate percentiles for
 * @param {number} percentile - The percentile to calculate (e.g., 95 for 95th percentile)
 * @returns {number|null} The calculated percentile value or null if no data
 */
function calculatePercentile(endpoint, percentile) {
  const endpointRequests = performanceMetrics.requests.filter(req => req.endpoint === endpoint);
  if (endpointRequests.length === 0) {
    return null;
  }

  // Sort response times in ascending order
  const sortedTimes = endpointRequests.map(req => req.responseTime).sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * (sortedTimes.length - 1));

  return sortedTimes[index];
}

/**
 * Gets performance metrics for a specific endpoint
 * @param {string} endpoint - The endpoint to get metrics for
 * @returns {Object} Performance metrics for the endpoint
 */
function getPerformanceMetrics(endpoint) {
  const endpointRequests = performanceMetrics.requests.filter(req => req.endpoint === endpoint);
  const count = endpointRequests.length;

  if (count === 0) {
    return {
      count: 0,
      average: null,
      min: null,
      max: null,
      p95: null,
      p99: null,
      successRate: null
    };
  }

  const responseTimes = endpointRequests.map(req => req.responseTime);
  const statusCodes = endpointRequests.map(req => req.statusCode);

  const min = Math.min(...responseTimes);
  const max = Math.max(...responseTimes);
  const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  const p95 = calculatePercentile(endpoint, 95);
  const p99 = calculatePercentile(endpoint, 99);

  // Calculate success rate (assuming 2xx status codes are successful)
  const successfulRequests = statusCodes.filter(code => code >= 200 && code < 300).length;
  const successRate = successfulRequests / statusCodes.length;

  return {
    count,
    average,
    min,
    max,
    p95,
    p99,
    successRate
  };
}

/**
 * Gets overall performance metrics
 * @returns {Object} Overall performance metrics
 */
function getOverallMetrics() {
  const allEndpoints = [...new Set(performanceMetrics.requests.map(req => req.endpoint))];
  const metrics = {};

  for (const endpoint of allEndpoints) {
    metrics[endpoint] = getPerformanceMetrics(endpoint);
  }

  return metrics;
}

/**
 * Logs performance metrics to console (for development)
 */
function logPerformanceMetrics() {
  console.group('Performance Metrics');
  const metrics = getOverallMetrics();

  for (const [endpoint, data] of Object.entries(metrics)) {
    console.log(`${endpoint}:`, {
      count: data.count,
      average: `${data.average?.toFixed(2)}ms`,
      min: `${data.min}ms`,
      max: `${data.max}ms`,
      p95: `${data.p95?.toFixed(2)}ms`,
      p99: `${data.p99?.toFixed(2)}ms`,
      successRate: `${(data.successRate * 100).toFixed(2)}%`
    });
  }

  console.groupEnd();
}

/**
 * Performance monitoring middleware for axios requests
 * @param {Object} config - Axios request config
 * @returns {Object} Modified config with timing information
 */
function addRequestTiming(config) {
  // Add start time to request config
  config.metadata = config.metadata || {};
  config.metadata.startTime = Date.now();

  return config;
}

/**
 * Performance monitoring response interceptor
 * @param {Object} response - Axios response object
 * @returns {Object} Response object (unchanged)
 */
function recordResponseTime(response) {
  const startTime = response.config?.metadata?.startTime;
  if (startTime) {
    const responseTime = Date.now() - startTime;
    const endpoint = response.config.url.split('/').pop(); // Simple endpoint extraction
    recordPerformanceMetric(endpoint, responseTime, response.status);
  }

  return response;
}

/**
 * Performance monitoring error interceptor
 * @param {Object} error - Axios error object
 * @returns {Promise} Rejected promise with the error
 */
function recordErrorTime(error) {
  const startTime = error.config?.metadata?.startTime;
  if (startTime) {
    const responseTime = Date.now() - startTime;
    const endpoint = error.config.url.split('/').pop(); // Simple endpoint extraction
    // Record error response time with a 0 status code to indicate failure
    recordPerformanceMetric(endpoint, responseTime, 0);
  }

  return Promise.reject(error);
}

export {
  recordPerformanceMetric,
  getPerformanceMetrics,
  getOverallMetrics,
  logPerformanceMetrics,
  addRequestTiming,
  recordResponseTime,
  recordErrorTime
};

// Export default for easier import
export default {
  recordPerformanceMetric,
  getPerformanceMetrics,
  getOverallMetrics,
  logPerformanceMetrics,
  addRequestTiming,
  recordResponseTime,
  recordErrorTime
};