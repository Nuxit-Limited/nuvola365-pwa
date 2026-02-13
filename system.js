// ============================================
// NUVOLA365 - Samsung DeX System
// Cloud Apps Only - Popup Windows
// ============================================

const System = {
  windows: new Map(),
  windowZIndex: 1000,
  activeWindow: null
};

// ============================================
// BOOT & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  bootSystem();
});

function bootSystem() {
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    initializeAuth();
  }, 3000);
}

function initializeAuth() {
  const signInBtn = document.getElementById('signInBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  
  signInBtn.onclick = function() {
    handleAuth('signin');
  };
  
  signUpBtn.onclick = function() {
    handleAuth('signup');
  };
}

function handleAuth(type) {
  const authScreen = document.getElementById('authScreen');
  const btn = type === 'signin' ? document.getElementById('signInBtn') : document.getElementById('signUpBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Authenticating...</span>';
  
  setTimeout(() => {
    localStorage.setItem('nuvola365_auth', 'true');
    localStorage.setItem('nuvola365_auth_type', type);
    localStorage.setItem('nuvola365_auth_time', new Date().toISOString());
    
    authScreen.classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    
    initializeDesktop();
    
    const authType = type === 'signin' ? 'Signed in' : 'Account created';
    setTimeout(() => {
      showNotification('Welcome to Nuvola365', `${authType} successfully!`);
    }, 500);
  }, 1500);
}

function initializeDesktop() {
  updateClock();
  setInterval(updateClock, 1000);
  
  // Desktop Icons - double-tap to open
  const icons = document.querySelectorAll('.desktop-icon');
  
  icons.forEach((icon) => {
    let tapCount = 0;
    let tapTimer = null;
    
    icon.onclick = function() {
      tapCount++;
      
      if (tapCount === 1) {
        icon.style.background = 'rgba(255, 255, 255, 0.15)';
        tapTimer = setTimeout(() => {
          icon.style.background = '';
          tapCount = 0;
        }, 400);
      } else if (tapCount === 2) {
        clearTimeout(tapTimer);
        tapCount = 0;
        icon.style.background = '';
        const appId = icon.dataset.app;
        openApp(appId);
      }
    };
  });
  
  // App Menu
  const appMenuBtn = document.getElementById('appMenuBtn');
  appMenuBtn.onclick = function() {
    toggleAppLauncher();
  };
  
  const launcherClose = document.getElementById('launcherClose');
  if (launcherClose) {
    launcherClose.onclick = function() {
      closeAppLauncher();
    };
  }
  
  // Launcher Apps
  const appItems = document.querySelectorAll('.app-item');
  appItems.forEach(item => {
    item.onclick = function() {
      const appId = item.dataset.app;
      openApp(appId);
      closeAppLauncher();
    };
  });
  
  // Lock/Exit
  const lockBtn = document.getElementById('lockDex');
  if (lockBtn) {
    lockBtn.onclick = function() {
      closeAppLauncher();
      showNotification('Screen Locked', 'Click to unlock');
    };
  }
  
  const exitBtn = document.getElementById('exitDex');
  if (exitBtn) {
    exitBtn.onclick = function() {
      if (confirm('Sign out and exit?')) {
        localStorage.removeItem('nuvola365_auth');
        location.reload();
      }
    };
  }
  
  // Search
  const searchInput = document.getElementById('launcherSearch');
  if (searchInput) {
    searchInput.oninput = function(e) {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.app-item').forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
      });
    };
  }
  
  // Close launcher on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAppLauncher();
    }
  });
}

// ============================================
// APP LAUNCHER
// ============================================

function toggleAppLauncher() {
  const launcher = document.getElementById('appLauncher');
  const btn = document.getElementById('appMenuBtn');
  
  if (launcher.classList.contains('hidden')) {
    launcher.classList.remove('hidden');
    btn.classList.add('active');
    document.getElementById('launcherSearch')?.focus();
  } else {
    closeAppLauncher();
  }
}

function closeAppLauncher() {
  document.getElementById('appLauncher')?.classList.add('hidden');
  document.getElementById('appMenuBtn')?.classList.remove('active');
  const searchInput = document.getElementById('launcherSearch');
  if (searchInput) {
    searchInput.value = '';
  }
  document.querySelectorAll('.app-item').forEach(item => {
    item.style.display = 'flex';
  });
}

// ============================================
// OPEN APPS IN POPUP WINDOWS
// ============================================

function openApp(appId) {
  const app = Applications[appId];
  if (!app) {
    console.error('App not found:', appId);
    return;
  }
  
  // All apps are cloud apps - open in popup window
  let launchUrl = app.url;
  
  // Check for direct launch URLs
  if (appId === 'cloud-pc' && window.CloudConfig?.windows365) {
    launchUrl = window.CloudConfig.windows365.getLaunchUrl();
    console.log('🖥️ Windows 365 Cloud PC:', launchUrl);
  } else if (appId === 'avd' && window.CloudConfig?.avd) {
    launchUrl = window.CloudConfig.avd.getLaunchUrl();
    console.log('☁️ Azure VD:', launchUrl);
  }
  
  showNotification(app.name, 'Opening...');
  
  // Open in popup window
  const width = Math.min(1400, screen.width - 100);
  const height = Math.min(900, screen.height - 100);
  const left = Math.max(0, (screen.width - width) / 2);
  const top = Math.max(0, (screen.height - height) / 2);
  
  const windowFeatures = `width=${width},height=${height},left=${left},top=${top},` +
                        `toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
  
  window.open(launchUrl, app.name, windowFeatures);
}

// ============================================
// CLOCK
// ============================================

function updateClock() {
  const now = new Date();
  const clock = document.getElementById('taskbarClock');
  
  if (clock) {
    const timeEl = clock.querySelector('.clock-time');
    const dateEl = clock.querySelector('.clock-date');
    
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit'
      });
    }
    
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'numeric',
        day: 'numeric'
      });
    }
  }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(title, body = '') {
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-check-circle"></i>
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
  
  notif.querySelector('.notification-close').onclick = function() {
    removeNotification(notif);
  };
  
  setTimeout(() => {
    removeNotification(notif);
  }, 4000);
}

function removeNotification(notif) {
  notif.classList.remove('show');
  setTimeout(() => notif.remove(), 300);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.openApp = openApp;
window.toggleAppLauncher = toggleAppLauncher;
window.closeAppLauncher = closeAppLauncher;

console.log('✅ Nuvola365 System initialized');
