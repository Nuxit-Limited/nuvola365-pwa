// ============================================
// NUVOLA365 SYSTEM
// Your Phone is Your Desktop
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  bootSystem();
});

// ============================================
// BOOT SEQUENCE
// ============================================

function bootSystem() {
  // Show loading for 2 seconds
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
    initializeWelcome();
  }, 2000);
}

// ============================================
// WELCOME SCREEN
// ============================================

function initializeWelcome() {
  // Sign In button
  document.getElementById('signInBtn').addEventListener('click', () => {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    initializeDesktop();
    showNotification('Welcome!', 'Your desktop workspace is ready');
  });
  
  // Create Instance button
  document.getElementById('createInstanceBtn').addEventListener('click', () => {
    showProvisioningForm();
  });
}

// ============================================
// PROVISIONING WORKFLOW
// ============================================

let currentProvisioningId = null;
let pollingInterval = null;

function showProvisioningForm() {
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('provisioningForm').classList.remove('hidden');
  
  // Set max date for DOB (18 years ago)
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  document.getElementById('dateOfBirth').max = eighteenYearsAgo.toISOString().split('T')[0];
  
  // Age verification on DOB change
  document.getElementById('dateOfBirth').addEventListener('change', validateAge);
  
  // Card number formatting
  document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
  
  // Expiry date formatting
  document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
  
  // CVV validation
  document.getElementById('cvv').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 4);
  });
  
  // Back button
  document.getElementById('backToWelcome').addEventListener('click', () => {
    document.getElementById('provisioningForm').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
  });
  
  // Form submission
  document.getElementById('provisioningFormElement').addEventListener('submit', handleProvisioningSubmit);
}

function validateAge() {
  const dob = new Date(this.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  
  const resultDiv = document.getElementById('ageVerificationResult');
  
  if (actualAge >= 18) {
    resultDiv.className = 'age-verification-result valid';
    resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> Age verified: You are ' + actualAge + ' years old';
  } else {
    resultDiv.className = 'age-verification-result invalid';
    resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> You must be at least 18 years old to create a workspace';
  }
}

function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formattedValue.substring(0, 19);
}

function formatExpiryDate(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
}

async function handleProvisioningSubmit(e) {
  e.preventDefault();
  
  // Validate age
  const dob = new Date(document.getElementById('dateOfBirth').value);
  const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (age < 18) {
    showNotification('Age Verification Failed', 'You must be at least 18 years old to create a workspace', 'error');
    return;
  }
  
  // Validate terms acceptance
  if (!document.getElementById('termsAccepted').checked) {
    showNotification('Terms Required', 'You must accept the Terms & Conditions to continue', 'error');
    return;
  }
  
  // Collect all form data
  const formData = {
    // Organization
    organizationName: document.getElementById('orgName').value.trim(),
    desiredDomain: document.getElementById('desiredDomain').value.trim(),
    
    // Admin
    adminFirstName: document.getElementById('adminFirstName').value.trim(),
    adminLastName: document.getElementById('adminLastName').value.trim(),
    adminEmail: document.getElementById('adminEmail').value.trim(),
    adminPhone: document.getElementById('adminPhone').value.trim(),
    
    // Billing Address
    addressLine1: document.getElementById('addressLine1').value.trim(),
    addressLine2: document.getElementById('addressLine2').value.trim(),
    city: document.getElementById('city').value.trim(),
    postalCode: document.getElementById('postalCode').value.trim(),
    country: document.getElementById('country').value,
    
    // Payment (Note: In production, use Stripe/payment gateway, never store card details)
    cardholderName: document.getElementById('cardholderName').value.trim(),
    cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
    expiryDate: document.getElementById('expiryDate').value,
    cvv: document.getElementById('cvv').value,
    
    // Age verification
    dateOfBirth: document.getElementById('dateOfBirth').value,
    
    // Consent
    termsAccepted: document.getElementById('termsAccepted').checked,
    marketingConsent: document.getElementById('marketingConsent').checked
  };
  
  // Validate all required fields
  if (!formData.organizationName || !formData.desiredDomain || !formData.adminEmail) {
    showNotification('Validation Error', 'Please fill in all required fields', 'error');
    return;
  }
  
  // Disable submit button
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
  
  try {
    // Call backend API
    const response = await initiateProvisioning(formData);
    
    if (response.error) {
      throw new Error(response.message || 'Provisioning failed');
    }
    
    // Store provisioning ID
    currentProvisioningId = response.provisioningId;
    
    // Show progress screen
    document.getElementById('provisioningForm').classList.add('hidden');
    document.getElementById('provisioningProgress').classList.remove('hidden');
    
    // Start polling
    startProvisioningPolling(response.provisioningId);
    
  } catch (error) {
    console.error('Provisioning error:', error);
    showNotification('Error', error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Create Workspace</span>';
  }
}

async function initiateProvisioning(data) {
  const url = `${Config.apiBaseUrl}${Config.endpoints.initiateProvisioning}`;
  
  // If mock mode, return mock response
  if (Config.features.mockProvisioning) {
    console.log('🧪 MOCK: Initiating provisioning', data);
    return {
      provisioningId: 'mock-' + Date.now(),
      status: 'initiated',
      estimatedCompletionTime: new Date(Date.now() + 180000).toISOString(),
      pollUrl: '/api/v1/provisioning/mock-' + Date.now() + '/status'
    };
  }
  
  // Real API call
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${getAuthToken()}` // Add when auth is ready
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initiate provisioning');
  }
  
  return await response.json();
}

function startProvisioningPolling(provisioningId) {
  let pollCount = 0;
  
  pollingInterval = setInterval(async () => {
    pollCount++;
    
    if (pollCount > Config.polling.maxAttempts) {
      stopProvisioningPolling();
      showProvisioningFailed('timeout', 'Provisioning timed out', 'The setup took longer than expected. Please contact support.');
      return;
    }
    
    try {
      const status = await getProvisioningStatus(provisioningId);
      updateProvisioningUI(status);
      
      if (status.status === 'completed') {
        stopProvisioningPolling();
        showProvisioningComplete(status);
      } else if (status.status === 'failed') {
        stopProvisioningPolling();
        showProvisioningFailed(status.failedStep, status.errorMessage, status.supportMessage, status.errorCode);
      }
      
    } catch (error) {
      console.error('Polling error:', error);
    }
    
  }, Config.polling.interval);
}

function stopProvisioningPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

async function getProvisioningStatus(provisioningId) {
  const url = `${Config.apiBaseUrl}${Config.endpoints.getProvisioningStatus}`.replace(':id', provisioningId);
  
  // Mock mode
  if (Config.features.mockProvisioning) {
    return getMockProvisioningStatus(provisioningId);
  }
  
  // Real API call
  const response = await fetch(url, {
    headers: {
      // 'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get provisioning status');
  }
  
  return await response.json();
}

// Mock provisioning simulation
let mockProgress = 0;
const mockSteps = [
  { name: 'Validation', duration: 2000 },
  { name: 'Create Tenant', duration: 5000 },
  { name: 'Order Licenses', duration: 8000 },
  { name: 'Assign Licenses', duration: 5000 },
  { name: 'Configure', duration: 3000 }
];

function getMockProvisioningStatus(provisioningId) {
  mockProgress += 5;
  
  if (mockProgress >= 100) {
    return {
      provisioningId: provisioningId,
      status: 'completed',
      progress: 100,
      tenantDomain: 'demo-workspace.onmicrosoft.com',
      tenantId: 'mock-tenant-id-12345',
      adminUsername: 'admin@demo-workspace.onmicrosoft.com',
      temporaryPassword: 'TempPass123!@#',
      loginUrl: 'https://login.microsoftonline.com/demo-workspace.onmicrosoft.com',
      workspaceUrl: 'https://portal.office.com',
      completedAt: new Date().toISOString(),
      steps: mockSteps.map((step, i) => ({
        name: step.name,
        status: 'completed',
        timestamp: new Date(Date.now() - (mockSteps.length - i) * 3000).toISOString()
      }))
    };
  }
  
  const currentStepIndex = Math.floor(mockProgress / 20);
  const currentStep = mockSteps[currentStepIndex];
  
  return {
    provisioningId: provisioningId,
    status: currentStepIndex >= mockSteps.length - 1 ? 'configuring' : 'ordering_licenses',
    progress: mockProgress,
    currentStep: currentStep.name,
    steps: mockSteps.map((step, i) => ({
      name: step.name,
      status: i < currentStepIndex ? 'completed' : (i === currentStepIndex ? 'running' : 'pending'),
      timestamp: i < currentStepIndex ? new Date(Date.now() - (currentStepIndex - i) * 5000).toISOString() : null
    })),
    estimatedCompletion: new Date(Date.now() + (100 - mockProgress) * 1000).toISOString()
  };
}

function updateProvisioningUI(status) {
  // Update progress bar
  document.getElementById('progressFill').style.width = `${status.progress}%`;
  document.getElementById('progressPercentage').textContent = `${status.progress}%`;
  
  // Update current step
  if (status.currentStep) {
    document.getElementById('currentStepTitle').textContent = status.currentStep;
    document.getElementById('currentStepDescription').textContent = getStepDescription(status.currentStep);
  }
  
  // Update steps list
  if (status.steps) {
    const stepsList = document.getElementById('stepsList');
    stepsList.innerHTML = status.steps.map(step => `
      <div class="step-item ${step.status}">
        <div class="step-item-icon">
          ${step.status === 'completed' ? '<i class="fas fa-check"></i>' : 
            step.status === 'running' ? '<i class="fas fa-spinner fa-spin"></i>' : ''}
        </div>
        <div class="step-item-text">${step.name}</div>
        ${step.timestamp ? `<div class="step-item-time">${formatTime(step.timestamp)}</div>` : ''}
      </div>
    `).join('');
  }
  
  // Update estimated time
  if (status.estimatedCompletion) {
    const timeRemaining = Math.max(0, Math.ceil((new Date(status.estimatedCompletion) - new Date()) / 1000 / 60));
    document.getElementById('estimatedTime').innerHTML = `
      <i class="fas fa-clock"></i>
      <span>Estimated time remaining: <strong>${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''}</strong></span>
    `;
  }
}

function getStepDescription(stepName) {
  const descriptions = {
    'Validation': 'Verifying your information',
    'Create Tenant': 'Setting up your Microsoft 365 tenant',
    'Order Licenses': 'Ordering your workspace licenses',
    'Assign Licenses': 'Assigning licenses to your account',
    'Configure': 'Applying security and configuration settings'
  };
  return descriptions[stepName] || 'Processing...';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function showProvisioningComplete(status) {
  document.getElementById('provisioningProgress').classList.add('hidden');
  document.getElementById('provisioningComplete').classList.remove('hidden');
  
  // Populate details
  document.getElementById('completeDomain').textContent = status.tenantDomain;
  document.getElementById('completeUsername').textContent = status.adminUsername;
  document.querySelector('#completePassword .password-visible').textContent = status.temporaryPassword;
  
  // Toggle password visibility
  document.getElementById('togglePassword').addEventListener('click', function() {
    const hidden = document.querySelector('.password-hidden');
    const visible = document.querySelector('.password-visible');
    const isHidden = hidden.classList.contains('hidden');
    
    hidden.classList.toggle('hidden');
    visible.classList.toggle('hidden');
    this.querySelector('i').className = isHidden ? 'fas fa-eye' : 'fas fa-eye-slash';
  });
  
  // Copy buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.copy;
      const text = document.getElementById(targetId).textContent.trim();
      
      navigator.clipboard.writeText(text).then(() => {
        const icon = this.querySelector('i');
        icon.className = 'fas fa-check';
        this.classList.add('copied');
        
        setTimeout(() => {
          icon.className = 'fas fa-copy';
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });
  
  // Open workspace button
  document.getElementById('openWorkspace').addEventListener('click', () => {
    window.open(status.workspaceUrl || 'https://portal.office.com', '_blank');
  });
  
  // Email details button
  document.getElementById('emailDetails').addEventListener('click', () => {
    const subject = 'Your Nuvola365 Workspace Login Details';
    const body = `Your workspace is ready!\n\nDomain: ${status.tenantDomain}\nUsername: ${status.adminUsername}\nTemporary Password: ${status.temporaryPassword}\n\nPlease change your password on first login.\n\nLogin at: ${status.loginUrl}`;
    window.location.href = `mailto:${status.adminUsername}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function showProvisioningFailed(failedStep, errorMessage, supportMessage, errorCode) {
  document.getElementById('provisioningProgress').classList.add('hidden');
  document.getElementById('provisioningFailed').classList.remove('hidden');
  
  // Populate error details
  document.getElementById('failedStep').textContent = failedStep || 'Unknown';
  document.getElementById('failedMessage').textContent = errorMessage || 'An unexpected error occurred';
  document.getElementById('failedExplanation').textContent = supportMessage || 'Please contact support for assistance.';
  document.getElementById('failedReference').textContent = currentProvisioningId || 'N/A';
  
  // Retry button
  document.getElementById('retryProvisioning').addEventListener('click', () => {
    // Reset and show form again
    mockProgress = 0;
    document.getElementById('provisioningFailed').classList.add('hidden');
    document.getElementById('provisioningForm').classList.remove('hidden');
  });
  
  // Contact support button
  document.getElementById('contactSupport').addEventListener('click', () => {
    window.location.href = 'mailto:support@nuvola365.com?subject=Provisioning Failed&body=Reference: ' + currentProvisioningId;
  });
  
  // Back to home button
  document.getElementById('backToHome').addEventListener('click', () => {
    document.getElementById('provisioningFailed').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
  });
}

// Cancel provisioning
document.getElementById('cancelProvisioning')?.addEventListener('click', async () => {
  if (!confirm('Are you sure you want to cancel the setup? This cannot be undone.')) {
    return;
  }
  
  stopProvisioningPolling();
  
  if (Config.features.mockProvisioning) {
    mockProgress = 0;
  } else {
    // Call cancel endpoint
    try {
      const url = `${Config.apiBaseUrl}${Config.endpoints.cancelProvisioning}`.replace(':id', currentProvisioningId);
      await fetch(url, { method: 'POST' });
    } catch (error) {
      console.error('Cancel error:', error);
    }
  }
  
  document.getElementById('provisioningProgress').classList.add('hidden');
  document.getElementById('welcomeScreen').classList.remove('hidden');
  showNotification('Cancelled', 'Provisioning has been cancelled');
});

// ============================================
// DESKTOP INITIALIZATION
// ============================================

function initializeDesktop() {
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
  
  // Portal cards - click to launch
  document.querySelectorAll('.portal-card').forEach(card => {
    card.addEventListener('click', () => {
      const portalId = card.dataset.portal;
      launchPortal(portalId);
    });
  });
  
  // Menu button
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.getElementById('quickMenu').classList.toggle('hidden');
  });
  
  // Menu items
  document.getElementById('aboutBtn').addEventListener('click', () => {
    document.getElementById('quickMenu').classList.add('hidden');
    document.getElementById('aboutModal').classList.remove('hidden');
  });
  
  document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('quickMenu').classList.add('hidden');
    showNotification('Help', 'Visit nuvola365.com/support for help');
  });
  
  document.getElementById('disconnectBtn').addEventListener('click', () => {
    if (confirm('Disconnect from display?')) {
      showNotification('Disconnecting', 'Returning to mobile view...');
      setTimeout(() => location.reload(), 1500);
    }
  });
  
  // Close about modal
  document.getElementById('closeAbout').addEventListener('click', () => {
    document.getElementById('aboutModal').classList.add('hidden');
  });
  
  // Close menus on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.quick-menu') && !e.target.closest('#menuBtn')) {
      document.getElementById('quickMenu').classList.add('hidden');
    }
    if (!e.target.closest('.modal-content') && !e.target.closest('.portal-card')) {
      document.getElementById('aboutModal').classList.add('hidden');
    }
  });
}

// ============================================
// CLOCK
// ============================================

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short',
    day: 'numeric'
  });
  
  document.querySelector('.clock-time').textContent = timeStr;
  document.querySelector('.clock-date').textContent = dateStr;
}

// ============================================
// LAUNCH PORTALS
// ============================================

function launchPortal(portalId) {
  const portal = Portals[portalId];
  if (!portal) {
    console.error('Portal not found:', portalId);
    return;
  }
  
  let launchUrl = portal.url;
  
  // Check for direct launch URLs
  if (portalId === 'windows365' && window.CloudConfig?.windows365) {
    launchUrl = window.CloudConfig.windows365.getLaunchUrl();
    console.log('🖥️ Launching Windows 365 Cloud PC');
  } else if (portalId === 'avd' && window.CloudConfig?.avd) {
    launchUrl = window.CloudConfig.avd.getLaunchUrl();
    console.log('☁️ Launching Azure Virtual Desktop');
  } else if (portalId === 'office365') {
    console.log('📁 Opening Microsoft 365 Portal');
  }
  
  showNotification(portal.name, 'Opening...');
  
  // Open in new window/tab
  // On mobile-to-display setup, this opens in the current view
  // On desktop browser, opens new tab
  window.open(launchUrl, '_blank');
  
  // Log usage
  logPortalLaunch(portalId, portal.name);
}

function logPortalLaunch(portalId, portalName) {
  console.log(`✅ Launched: ${portalName}`);
  
  // Could send analytics here
  // Example: sendAnalytics('portal_launch', { portal: portalId });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(title, body = '', type = 'success') {
  const container = document.getElementById('notificationContainer');
  
  const iconClass = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  const iconColor = type === 'error' ? '#f44336' : '#4caf50';
  
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `
    <div class="notification-icon" style="background: linear-gradient(135deg, ${iconColor}, ${iconColor}dd);">
      <i class="${iconClass}"></i>
    </div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      ${body ? `<div class="notification-body">${body}</div>` : ''}
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => notif.classList.add('show'), 10);
  
  notif.querySelector('.notification-close').addEventListener('click', () => {
    removeNotification(notif);
  });
  
  setTimeout(() => removeNotification(notif), 4000);
}

function removeNotification(notif) {
  notif.classList.remove('show');
  setTimeout(() => notif.remove(), 300);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.launchPortal = launchPortal;
window.showNotification = showNotification;

console.log('✅ Nuvola365 system initialized');
console.log('📱 → 🖥️ Transform your mobile into a desktop');
