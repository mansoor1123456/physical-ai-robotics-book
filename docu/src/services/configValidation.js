/**
 * Configuration validation for API endpoints
 */

/* ================= DEFAULT CONFIG ================= */

const DEFAULT_CONFIG = {
 API_BASE_URL: 'http://127.0.0.1:8000',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

/* ================= VALIDATION SCHEMA ================= */

const CONFIG_SCHEMA = {
  API_BASE_URL: {
    type: 'string',
    required: true,
    validator: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    errorMessage: 'API_BASE_URL must be a valid URL',
  },

  TIMEOUT: {
    type: 'number',
    required: true,
    validator: (value) => Number.isInteger(value) && value > 0,
    errorMessage: 'TIMEOUT must be a positive integer',
  },

  MAX_RETRIES: {
    type: 'number',
    required: true,
    validator: (value) => Number.isInteger(value) && value >= 0,
    errorMessage: 'MAX_RETRIES must be a non-negative integer',
  },

  RETRY_DELAY: {
    type: 'number',
    required: true,
    validator: (value) => Number.isInteger(value) && value > 0,
    errorMessage: 'RETRY_DELAY must be a positive integer',
  },
};

/* ================= HELPERS ================= */

function validateConfigValue(key, value) {
  const rule = CONFIG_SCHEMA[key];
  if (!rule) return { isValid: true, value };

  if (rule.required && (value === undefined || value === null)) {
    return { isValid: false, error: `${key} is required` };
  }

  if (typeof value !== rule.type) {
    return {
      isValid: false,
      error: `${key} must be of type ${rule.type}`,
    };
  }

  if (rule.validator && !rule.validator(value)) {
    return { isValid: false, error: rule.errorMessage };
  }

  return { isValid: true, value };
}

function validateConfig(config = {}) {
  const errors = [];
  const finalConfig = { ...DEFAULT_CONFIG };

  for (const key of Object.keys(CONFIG_SCHEMA)) {
    const value = config[key] ?? DEFAULT_CONFIG[key];
    const result = validateConfigValue(key, value);

    if (!result.isValid) errors.push(result.error);
    else finalConfig[key] = value;
  }

  return {
    isValid: errors.length === 0,
    config: finalConfig,
    errors,
  };
}

/* ================= FINAL EXPORT ================= */

function getValidatedConfig(userConfig = {}) {
  const result = validateConfig(userConfig);

  if (!result.isValid) {
    console.error('Config validation failed:', result.errors);
    return { isValid: false, config: DEFAULT_CONFIG, errors: result.errors };
  }

  return result;
}

export default getValidatedConfig;
export { DEFAULT_CONFIG, CONFIG_SCHEMA };
