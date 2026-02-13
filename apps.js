// ============================================
// NUVOLA365 - Cloud Applications Only
// Clean version with essential apps
// ============================================

const Applications = {
  
  // ==================== WINDOWS 365 CLOUD PC ====================
  'cloud-pc': {
    name: 'Windows 365 Cloud PC',
    icon: 'fas fa-desktop',
    color: '#0078d4',
    description: 'Your Windows 365 Cloud PC',
    isCloudApp: true,
    url: 'https://windows.cloud.microsoft/',
    openInTab: true
  },

  // ==================== AZURE VIRTUAL DESKTOP ====================
  'avd': {
    name: 'Azure Virtual Desktop',
    icon: 'fas fa-cloud',
    color: '#0078d4',
    description: 'Remote apps and desktops',
    isCloudApp: true,
    url: 'https://client.wvd.microsoft.com/arm/webclient/',
    openInTab: true
  },

  // ==================== MICROSOFT 365 APPS ====================
  'teams': {
    name: 'Teams',
    icon: 'fas fa-users',
    color: '#6264a7',
    description: 'Microsoft Teams',
    isCloudApp: true,
    url: 'https://teams.microsoft.com',
    openInTab: true
  },

  'outlook': {
    name: 'Outlook',
    icon: 'fas fa-envelope',
    color: '#0078d4',
    description: 'Outlook Mail',
    isCloudApp: true,
    url: 'https://outlook.office.com',
    openInTab: true
  },

  'word': {
    name: 'Word',
    icon: 'fas fa-file-word',
    color: '#2b579a',
    description: 'Microsoft Word',
    isCloudApp: true,
    url: 'https://office.com/launch/word',
    openInTab: true
  },

  'excel': {
    name: 'Excel',
    icon: 'fas fa-file-excel',
    color: '#217346',
    description: 'Microsoft Excel',
    isCloudApp: true,
    url: 'https://office.com/launch/excel',
    openInTab: true
  },

  'powerpoint': {
    name: 'PowerPoint',
    icon: 'fas fa-file-powerpoint',
    color: '#d24726',
    description: 'Microsoft PowerPoint',
    isCloudApp: true,
    url: 'https://office.com/launch/powerpoint',
    openInTab: true
  },

  'onedrive': {
    name: 'OneDrive',
    icon: 'fas fa-cloud-upload-alt',
    color: '#0078d4',
    description: 'OneDrive Storage',
    isCloudApp: true,
    url: 'https://onedrive.live.com',
    openInTab: true
  },

  'onenote': {
    name: 'OneNote',
    icon: 'fas fa-book',
    color: '#80397b',
    description: 'Microsoft OneNote',
    isCloudApp: true,
    url: 'https://www.onenote.com/notebooks',
    openInTab: true
  },

  'sharepoint': {
    name: 'SharePoint',
    icon: 'fas fa-share-alt',
    color: '#036c70',
    description: 'SharePoint Sites',
    isCloudApp: true,
    url: 'https://www.office.com/launch/sharepoint',
    openInTab: true
  }
};

// ============================================
// CLOUD CONFIGURATION
// Optional: Direct launch URLs
// ============================================

const CloudConfig = {
  // Windows 365 Cloud PC
  windows365: {
    cloudPcId: null,  // Set your Cloud PC ID here for direct launch
    getLaunchUrl: function() {
      if (this.cloudPcId) {
        return `https://windows.cloud.microsoft/?cloudPcId=${this.cloudPcId}`;
      }
      return 'https://windows.cloud.microsoft/';
    }
  },
  
  // Azure Virtual Desktop
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

window.CloudConfig = CloudConfig;

console.log('✅ Nuvola365 Cloud Apps loaded');
