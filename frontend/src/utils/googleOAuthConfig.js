// Dynamic Google OAuth Configuration
export const getGoogleOAuthConfig = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'email profile'
    };
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  
  // Build the current origin
  const currentOrigin = port 
    ? `${protocol}//${hostname}:${port}`
    : `${protocol}//${hostname}`;

  console.log('🔧 Google OAuth Configuration:', {
    hostname,
    protocol,
    port,
    currentOrigin,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  });

  return {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: 'email profile',
    origin: currentOrigin
  };
};

// Validate OAuth configuration
export const validateGoogleOAuthConfig = () => {
  const config = getGoogleOAuthConfig();
  
  if (!config.clientId || config.clientId === 'your-google-client-id') {
    console.error('❌ Google Client ID not configured');
    return false;
  }

  if (typeof window.google === 'undefined') {
    console.error('❌ Google OAuth script not loaded');
    return false;
  }

  console.log('✅ Google OAuth configuration valid');
  return true;
};

// Initialize Google OAuth with proper error handling
export const initializeGoogleOAuth = () => {
  if (!validateGoogleOAuthConfig()) {
    throw new Error('Google OAuth configuration is invalid');
  }

  const config = getGoogleOAuthConfig();
  
  try {
    // Initialize the OAuth client
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: config.clientId,
      scope: config.scope,
      callback: (response) => {
        console.log('✅ Google OAuth callback received:', response);
      }
    });

    console.log('✅ Google OAuth client initialized successfully');
    return client;
  } catch (error) {
    console.error('❌ Google OAuth initialization failed:', error);
    throw new Error('Failed to initialize Google OAuth');
  }
};

// Get OAuth error message for user-friendly display
export const getOAuthErrorMessage = (error) => {
  if (error.message.includes('access blocked') || error.message.includes('invalid')) {
    return 'Google OAuth is not configured for this domain. Please contact support.';
  }
  
  if (error.message.includes('popup_closed')) {
    return 'Google OAuth popup was closed. Please try again.';
  }
  
  if (error.message.includes('access_denied')) {
    return 'Access was denied. Please try again and grant the required permissions.';
  }
  
  return 'Google OAuth failed. Please try again.';
};
