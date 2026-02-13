// ============================================
// NUVOLA365 - BACKEND CONFIGURATION
// ============================================

const Config = {
  // Backend API Base URL
  // DEVELOPMENT: Use localhost
  // PRODUCTION: Use your Azure App Service URL
  apiBaseUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api/v1'
    : 'https://nuvola365-api.azurewebsites.net/api/v1',
  
  // Provisioning endpoints
  endpoints: {
    initiateProvisioning: '/provisioning/initiate',
    getProvisioningStatus: '/provisioning/:id/status',
    cancelProvisioning: '/provisioning/:id/cancel',
    retryProvisioning: '/provisioning/:id/retry'
  },
  
  // Polling configuration
  polling: {
    interval: 3000,        // Poll every 3 seconds
    maxAttempts: 200,      // Max 10 minutes (200 * 3s)
    timeout: 600000        // 10 minute timeout
  },
  
  // Feature flags
  features: {
    mockProvisioning: true,  // Set to false when real API is ready
    allowCancel: true,
    showDebugInfo: false
  }
};

window.Config = Config;

console.log('✅ Config loaded:', Config.apiBaseUrl);
