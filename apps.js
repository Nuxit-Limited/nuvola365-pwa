// ============================================
// NUVOLA365 - THE 3 ESSENTIAL PORTALS
// Your Phone is Your Desktop
// ============================================

const Portals = {
  
  // Windows 365 Cloud PC - Full Windows desktop
  windows365: {
    name: 'Windows 365 Cloud PC',
    description: 'Your full Windows desktop in the cloud',
    url: 'https://windows.cloud.microsoft/',
    icon: 'fab fa-windows',
    features: ['Full Windows 11', 'All your apps', 'Your files']
  },
  
  // Azure Virtual Desktop - Enterprise apps
  avd: {
    name: 'Azure Virtual Desktop',
    description: 'Enterprise apps and remote desktops',
    url: 'https://client.wvd.microsoft.com/arm/webclient/',
    icon: 'fas fa-server',
    features: ['Business apps', 'Secure access', 'Multi-session']
  },
  
  // Microsoft 365 - All Office apps in one portal
  office365: {
    name: 'Microsoft 365',
    description: 'All your Office apps in one place',
    url: 'https://portal.office.com',
    icon: 'fas fa-th',
    features: ['Word, Excel, PowerPoint', 'Teams, Outlook, OneDrive', 'All apps included']
  }
};

// ============================================
// CLOUD CONFIGURATION (Optional)
// Direct launch URLs for Cloud PC / AVD
// ============================================

const CloudConfig = {
  windows365: {
    cloudPcId: null,  // Set your Cloud PC ID for direct launch
    getLaunchUrl: function() {
      if (this.cloudPcId) {
        return `https://windows.cloud.microsoft/?cloudPcId=${this.cloudPcId}`;
      }
      return 'https://windows.cloud.microsoft/';
    }
  },
  
  avd: {
    workspaceId: null,  // Set your workspace ID
    resourceId: null,   // Set your resource ID
    getLaunchUrl: function() {
      if (this.workspaceId && this.resourceId) {
        return `https://client.wvd.microsoft.com/arm/webclient/?workspaceId=${this.workspaceId}&resourceId=${this.resourceId}`;
      }
      return 'https://client.wvd.microsoft.com/arm/webclient/';
    }
  }
};

window.Portals = Portals;
window.CloudConfig = CloudConfig;

console.log('✅ Nuvola365 portals loaded');
console.log('📱 Your phone is your desktop');
