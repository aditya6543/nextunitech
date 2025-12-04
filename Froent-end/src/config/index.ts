// Frontend configuration
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'NextUnitech',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // API Endpoints
  endpoints: {
    users: '/api/users',
    auth: '/api/auth',
    messages: '/api/messages',
    conversations: '/api/conversations',
    waitlist: '/api/waitlist'
  }
};

// Validation function to check if required environment variables are set
export const validateConfig = (): void => {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_APP_NAME'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
  }
};

// Initialize config validation
if (config.enableDebug) {
  validateConfig();
}
