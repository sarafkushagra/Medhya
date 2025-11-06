// Get Domain Information for OAuth Configuration
export const getDomainInfo = () => {
  if (typeof window === 'undefined') {
    return {
      hostname: 'server-side',
      protocol: 'https',
      port: '',
      origin: 'https://server-side'
    };
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  const origin = window.location.origin;

  return {
    hostname,
    protocol,
    port,
    origin,
    fullUrl: window.location.href
  };
};

// Log domain information for OAuth configuration
export const logDomainInfo = () => {
  const domainInfo = getDomainInfo();
  
  console.log('🌐 Domain Information for OAuth Configuration:');
  console.log('==============================================');
  console.log('Hostname:', domainInfo.hostname);
  console.log('Protocol:', domainInfo.protocol);
  console.log('Port:', domainInfo.port || 'default');
  console.log('Origin:', domainInfo.origin);
  console.log('Full URL:', domainInfo.fullUrl);
  console.log('');
  console.log('📝 Add these to Google Cloud Console OAuth settings:');
  console.log('===================================================');
  console.log('Authorized JavaScript origins:');
  console.log(`  ${domainInfo.origin}`);
  console.log('');
  console.log('Authorized redirect URIs:');
  console.log(`  ${domainInfo.origin}`);
  console.log('==============================================');
  
  return domainInfo;
};

// Auto-log domain info when imported
if (typeof window !== 'undefined') {
  // Log after a short delay to ensure the page is loaded
  setTimeout(() => {
    logDomainInfo();
  }, 1000);
}
