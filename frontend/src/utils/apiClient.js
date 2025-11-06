import { API_BASE_URL } from '../config/environment.js';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Add authorization header if token exists
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      // If token is expired, try to refresh
      if (response.status === 401 && token) {
        try {
          await this.refreshToken();
          // Retry the request with new token
          const newToken = localStorage.getItem('token');
          if (newToken) {
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            };
            const retryResponse = await fetch(`${this.baseURL}${endpoint}`, options);
            
            // Handle retry responses without content
            if (retryResponse.status === 204 || retryResponse.headers.get('content-length') === '0') {
              if (!retryResponse.ok) {
                const error = new Error('Request failed');
                error.response = { status: retryResponse.status, data: null };
                throw error;
              }
              return { status: 'success', data: null };
            }
            
            // Parse the retry response
            const retryContentType = retryResponse.headers.get('content-type');
            if (retryContentType && retryContentType.includes('application/json')) {
              const responseData = await retryResponse.json();
              
              if (!retryResponse.ok) {
                const error = new Error(responseData.message || 'Request failed');
                error.response = { status: retryResponse.status, data: responseData };
                throw error;
              }
              
              return responseData;
            } else {
              const responseText = await retryResponse.text();
              
              if (!retryResponse.ok) {
                const error = new Error(responseText || 'Request failed');
                error.response = { status: retryResponse.status, data: responseText };
                throw error;
              }
              
              return { status: 'success', data: responseText };
            }
          }
        } catch (refreshErr) {
          console.error('Token refresh failed:', refreshErr);
          // Clear tokens on refresh failure
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          throw new Error('Authentication failed');
        }
      }
      
      // Handle responses without content (204 No Content, etc.)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        if (!response.ok) {
          const error = new Error('Request failed');
          error.response = { status: response.status, data: null };
          throw error;
        }
        return { status: 'success', data: null };
      }
      
      // Parse the response as JSON for responses with content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        
        if (!response.ok) {
          const error = new Error(responseData.message || 'Request failed');
          error.response = { status: response.status, data: responseData };
          throw error;
        }
        
        return responseData;
      } else {
        // Handle non-JSON responses
        const responseText = await response.text();
        
        if (!response.ok) {
          const error = new Error(responseText || 'Request failed');
          error.response = { status: response.status, data: responseText };
          throw error;
        }
        
        return { status: 'success', data: responseText };
      }
    } catch (error) {
      // Only log non-404 errors to avoid console spam for expected cases
      if (error.response?.status !== 404) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    // Update tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.token;
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();
