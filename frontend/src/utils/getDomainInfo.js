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

export const logDomainInfo = () => {
  const domainInfo = getDomainInfo();
  
  return domainInfo;
};

