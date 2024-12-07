// Error types
export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  UNKNOWN: 'UNKNOWN'
};

// Input validation
export const validateInput = (input, type) => {
  const validators = {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : 'Invalid email format';
    },
    phone: (value) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(value) ? null : 'Invalid phone number format';
    },
    date: (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? null : 'Invalid date format';
    },
    required: (value) => {
      return value && value.toString().trim() !== '' ? null : 'This field is required';
    }
  };

  return validators[type] ? validators[type](input) : null;
};

// API error handler
export const handleApiError = async (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        return {
          type: ErrorTypes.VALIDATION,
          message: 'Invalid request. Please check your input.',
          details: error.response.data
        };
      case 401:
        return {
          type: ErrorTypes.AUTH,
          message: 'Authentication required. Please log in again.',
        };
      case 403:
        return {
          type: ErrorTypes.AUTH,
          message: 'You don\'t have permission to perform this action.',
        };
      case 404:
        return {
          type: ErrorTypes.VALIDATION,
          message: 'Requested resource not found.',
        };
      case 429:
        return {
          type: ErrorTypes.NETWORK,
          message: 'Too many requests. Please try again later.',
        };
      default:
        return {
          type: ErrorTypes.UNKNOWN,
          message: 'An unexpected error occurred.',
        };
    }
  } else if (error.request) {
    // Request made but no response
    return {
      type: ErrorTypes.NETWORK,
      message: 'Network error. Please check your connection.',
    };
  } else {
    return {
      type: ErrorTypes.UNKNOWN,
      message: 'An unexpected error occurred.',
    };
  }
};

// Data formatter utilities
export const formatters = {
  phone: (value) => {
    // Remove non-numeric characters
    const numeric = value.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (numeric.length >= 10) {
      return `(${numeric.slice(0,3)}) ${numeric.slice(3,6)}-${numeric.slice(6,10)}`;
    }
    return numeric;
  },
  
  currency: (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return '0.00';
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  },
  
  date: (value) => {
    try {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }
};

// Retry mechanism for API calls
export const retryOperation = async (operation, maxAttempts = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};
