// Centralized error handling utility for the frontend
import { toast } from 'react-hot-toast'

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  PAYMENT: 'PAYMENT_ERROR',
  SERVICE: 'SERVICE_ERROR',
  AUTH: 'AUTH_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

// Error messages in English
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Connection error. Check your internet connection.',
  [ERROR_TYPES.VALIDATION]: 'The provided data is not valid.',
  [ERROR_TYPES.PAYMENT]: 'Error processing payment.',
  [ERROR_TYPES.SERVICE]: 'Service error. Please try again.',
  [ERROR_TYPES.AUTH]: 'Authentication error. Verify your credentials.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error has occurred.'
}

// HTTP status code to error type mapping
const STATUS_TO_ERROR_TYPE = {
  400: ERROR_TYPES.VALIDATION,
  401: ERROR_TYPES.AUTH,
  402: ERROR_TYPES.PAYMENT,
  403: ERROR_TYPES.AUTH,
  404: ERROR_TYPES.SERVICE,
  429: ERROR_TYPES.SERVICE,
  500: ERROR_TYPES.SERVICE,
  502: ERROR_TYPES.NETWORK,
  503: ERROR_TYPES.SERVICE,
  504: ERROR_TYPES.NETWORK
}

/**
 * Determines error type based on error object
 */
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return ERROR_TYPES.NETWORK
  }

  // HTTP errors
  if (error.response?.status) {
    return STATUS_TO_ERROR_TYPE[error.response.status] || ERROR_TYPES.SERVICE
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.message?.includes('validation')) {
    return ERROR_TYPES.VALIDATION
  }

  return ERROR_TYPES.UNKNOWN
}

/**
 * Gets user-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES[ERROR_TYPES.UNKNOWN]

  // Use custom message if available
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.message && typeof error.message === 'string') {
    return error.message
  }

  // Fallback to type-based message
  const errorType = getErrorType(error)
  return ERROR_MESSAGES[errorType]
}

/**
 * Handles errors with toast notifications
 */
export const handleError = (error, customMessage = null) => {
  const errorType = getErrorType(error)
  const message = customMessage || getErrorMessage(error)

  console.error('Error handled:', {
    type: errorType,
    message,
    originalError: error
  })

  // Show toast notification
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#1e293b',
      color: '#f1f5f9',
      border: '1px solid #475569'
    }
  })

  return {
    type: errorType,
    message,
    originalError: error
  }
}

/**
 * Handles API errors specifically
 */
export const handleApiError = (error, context = '') => {
  const errorInfo = {
    context,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method
  }

  console.error('API Error:', errorInfo)

  // Special handling for payment required
  if (error.response?.status === 402) {
    return {
      type: ERROR_TYPES.PAYMENT,
      message: 'Payment required to use this service',
      paymentInfo: error.response.data,
      originalError: error
    }
  }

  return handleError(error)
}

/**
 * Handles service-specific errors
 */
export const handleServiceError = (error, serviceName) => {
  const customMessage = `Error in service ${serviceName}: ${getErrorMessage(error)}`
  return handleError(error, customMessage)
}

/**
 * Validates form data and returns errors
 */
export const validateFormData = (data, rules) => {
  const errors = {}

  Object.keys(rules).forEach(field => {
    const rule = rules[field]
    const value = data[field]

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = `${rule.label || field} is required`
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must have at least ${rule.minLength} characters`
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} cannot have more than ${rule.maxLength} characters`
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${rule.label || field} has an invalid format`
    }

    if (value && rule.custom && !rule.custom(value)) {
      errors[field] = rule.customMessage || `${rule.label || field} is invalid`
    }
  })

  return errors
}

/**
 * Creates a retry function with exponential backoff
 */
export const createRetryFunction = (fn, maxRetries = 3, baseDelay = 1000) => {
  return async (...args) => {
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries) {
          throw error
        }

        // Don't retry on certain error types
        const errorType = getErrorType(error)
        if ([ERROR_TYPES.VALIDATION, ERROR_TYPES.AUTH].includes(errorType)) {
          throw error
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}

export default {
  ERROR_TYPES,
  getErrorType,
  getErrorMessage,
  handleError,
  handleApiError,
  handleServiceError,
  validateFormData,
  createRetryFunction
}