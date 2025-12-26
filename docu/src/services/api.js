import axios from 'axios';
import getValidatedConfig from './configValidation';
import { registerActiveRequest, unregisterActiveRequest } from './apiCleanup';
import { addRequestTiming, recordResponseTime, recordErrorTime } from './performanceMonitoring';

// Get validated configuration
const configResult = getValidatedConfig();
const config = configResult.config;

// Create axios instance
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

const QUERY_ENDPOINT_TIMEOUT = 5000; // 5 seconds

// Request interceptor
apiClient.interceptors.request.use((config) => {
  config = addRequestTiming(config);

  const source = axios.CancelToken.source();
  config.cancelToken = source.token;

  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  config.headers['X-Request-ID'] = requestId;

  registerActiveRequest(requestId, source);
  config.headers['X-Request-Time'] = new Date().toISOString();

  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    response = recordResponseTime(response);
    const requestId = response.config.headers['X-Request-ID'];
    if (requestId) unregisterActiveRequest(requestId);
    return response;
  },
  (error) => {
    recordErrorTime(error);
    const requestId = error.config?.headers?.['X-Request-ID'];
    if (requestId) unregisterActiveRequest(requestId);
    return Promise.reject(error);
  }
);

/**
 * API Service
 */
class ApiService {
  async sendQuery(queryText) {
    try {
      // ✅ BACKEND KE MUTABIQ BODY
      const requestBody = {
        question: queryText,
        top_k: 3
      };

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Query timeout - exceeded 5 seconds')),
          QUERY_ENDPOINT_TIMEOUT
        );
      });

      const requestPromise = apiClient.post('/query', requestBody);
      const response = await Promise.race([requestPromise, timeoutPromise]);

      // ✅ BACKEND RESPONSE KE MUTABIQ RETURN
      return {
        answer_text: response.data.answers?.[0]?.content || 'No answer found',
        sources: response.data.answers || [],
        timestamp: new Date()
      };

    } catch (error) {
      if (error.message?.includes('timeout')) {
        throw { message: 'Query timeout' };
      }
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.detail || 'Backend error'
        };
      }
      throw { message: 'Network error' };
    }
  }
}

const apiService = new ApiService();
export default apiService;
