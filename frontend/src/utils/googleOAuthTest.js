// Google OAuth Configuration Test
export const testGoogleOAuth = () => {
  
  // Check if Google OAuth script is loaded
  if (typeof window.google === 'undefined') {
    console.error('❌ Google OAuth script not loaded');
    return false;
  }
  
  // Check if client ID is configured
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'your-google-client-id') {
    console.error('❌ Google Client ID not configured');
    return false;
  }
  
  
  // Test OAuth initialization
  try {
    window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile'
    });
    return true;
  } catch (error) {
    console.error('❌ OAuth client initialization failed:', error);
    return false;
  }
};

// Run test on import
if (typeof window !== 'undefined') {
  setTimeout(testGoogleOAuth, 1000);
}

