// Environment Configuration
const DEFAULT_PROD_URL = 'https://medhya.onrender.com';

export const getApiBaseUrl = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; // Default to development
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  }
  
  // Use env var if set, otherwise default to production
  return import.meta.env.VITE_API_BASE_URL || `${DEFAULT_PROD_URL}/api`;
};

export const getApiUrl = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Default to development
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  
  // Production URL
  return import.meta.env.VITE_API_URL || DEFAULT_PROD_URL;
};

export const isDevelopment = () => {
  if (typeof window === 'undefined') {
    return true; // Default to development
  }
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

export const isProduction = () => {
  return !isDevelopment();
};

// Export constants - use function calls to ensure they're evaluated at runtime
export const API_BASE_URL = getApiBaseUrl();
export const API_URL = getApiUrl();


export default {
  API_BASE_URL,
  API_URL,
  isDevelopment,
  isProduction,
  getApiBaseUrl,
  getApiUrl,
};
