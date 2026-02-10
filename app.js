// ============================================
// NUVOLA365 WORKSPACE - Main Application
// ============================================

// App Configuration
const APP_CONFIG = {
  'cloud-pc': {
    name: 'Cloud PC',
    icon: 'fas fa-desktop',
    url: 'https://windows365.microsoft.com',
    color: '#0078d4',
    behavior: 'tab' // 'iframe' or 'tab'
  },
  'remote-apps': {
    name: 'Remote Apps',
    icon: 'fas fa-th-large',
    url: 'https://client.wvd.microsoft.com/arm/webclient/',
    color: '#0078d4',
    behavior: 'tab'
  },
  'word': {
    name: 'Word',
    icon: 'fas fa-file-word',
    url: 'https://www.office.com/launch/word',
    color: '#2b579a',
    behavior: 'tab'
  },
  'excel': {
    name: 'Excel',
    icon: 'fas fa-file-excel',
    url: 'https://www.office.com/launch/excel',
    color: '#217346',
    behavior: 'tab'
  },
  'powerpoint': {
    name: 'PowerPoint',
    icon: 'fas fa-file-powerpoint',
    url: 'https://www.office.com/launch/powerpoint',
    color: '#d24726',
    behavior: 'tab'
  },
  'teams': {
    name: 'Teams',
    icon: 'fas fa-users',
    url: 'https://teams.microsoft.com',
    color: '#6264a7',
    behavior: 'tab'
  },
  'onedrive': {
    name: 'OneDrive',
    icon: 'fas fa-cloud',
    url: 'https://onedrive.live.com',
    color: '#0078d4',
    behavior: 'tab'
  },
  'outlook': {
    name: 'Outlook',
    icon: 'fas fa-envelope',
    url: 'https://outlook.office.com',
    color: '#0078d4',
    behavior: 'tab'
  }
};

// State Management
const state = {
  windows: new Map(),
  activeWindow: null,
  windowZIndex: 100,
  isMobile: window.innerWidth <= 768,
  isDragging: false,
  dragWindow: null,
  dragOffset: { x: 0, y: 0 }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
  updateClock();
  setInterval(updateClock, 60000);
  
  // Check if running as PWA
  checkPWAStatus();
  
  // Handle orientation changes
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
});

function initializeApp() {
  // Check if user is already logged in (simulate with localStorage)
  const isLoggedIn = localStorage.getItem('nuvola365_logged_in');
  
  if (isLoggedIn) {
    showWorkspace();
  }
}

function setupEventListeners() {
  // Login/Signup
  document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
  document.getElementById('signupBtn')?.addEventListener('click', handleSignup);
  
  // Menu button
  document.getElementById('menuBtn')?.addEventListener('click', toggleAppLauncher);
  document.getElementById('launcherClose')?.addEventListener('click', toggleAppLauncher);
  
  // App icons (desktop)
  document.querySelectorAll('.app-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const appId = icon.dataset.app;
      launchApp(appId);
    });
  });
  
  // Launcher apps (mobile)
  document.querySelectorAll('.launcher-app').forEach(app => {
    app.addEventListener('click', () => {
      const appId = app.dataset.app;
      launchApp(appId);
      toggleAppLauncher();
    });
  });
  
  // Close context menu on outside click
  document.addEventListener('click', (e) => {
    const contextMenu = document.getElementById('contextMenu');
    if (!contextMenu.classList.contains('hidden') && !e.target.closest('.context-menu')) {
      contextMenu.classList.add('hidden');
    }
  });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin() {
  // Simulate login - in production, this would redirect to Microsoft OAuth
  console.log('Redirecting to Microsoft login...');
  
  // For demo purposes, immediately show workspace
  localStorage.setItem('nuvola365_logged_in', 'true');
  showWorkspace();
}

function handleSignup() {
  // Open Microsoft signup page
  window.open('https://signup.microsoft.com', '_blank');
}

function showWorkspace() {
  const splash = document.getElementById('splash');
  const workspace = document.getElementById('workspace');
  const taskbar = document.getElementById('taskbar');
  
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.classList.add('hidden');
    workspace.classList.remove('hidden');
    taskbar.classList.remove('hidden');
    
    // Animate workspace in
    workspace.style.opacity = '0';
    setTimeout(() => {
      workspace.style.transition = 'opacity 0.5s ease';
      workspace.style.opacity = '1';
    }, 50);
  }, 500);
}

// ============================================
// APP LAUNCHING
// ============================================

function launchApp(appId) {
  const appConfig = APP_CONFIG[appId];
  if (!appConfig) {
    console.error('App not found:', appId);
    return;
  }
  
  // Check if app is already open
  if (state.windows.has(appId)) {
    focusWindow(appId);
    return;
  }
  
  // Different behavior for mobile vs desktop
  if (state.isMobile || appConfig.behavior === 'tab') {
    openInNewTab(appConfig);
    // Still track it in taskbar
    addToTaskbar(appId, appConfig);
  } else {
    createWindow(appId, appConfig);
  }
}

function openInNewTab(appConfig) {
  const width = 1280;
  const height = 800;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  
  window.open(
    appConfig.url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

function createWindow(appId, appConfig) {
  const windowContainer = document.getElementById('windowContainer');
  
  // Create window element
  const windowEl = document.createElement('div');
  windowEl.className = state.isMobile ? 'window fullscreen' : 'window';
  windowEl.id = `window-${appId}`;
  windowEl.style.zIndex = state.windowZIndex++;
  
  // Position and size for desktop
  if (!state.isMobile) {
    const windowWidth = 900;
    const windowHeight = 600;
    const left = (window.innerWidth - windowWidth) / 2 + (state.windows.size * 30);
    const top = 80 + (state.windows.size * 30);
    
    windowEl.style.left = `${left}px`;
    windowEl.style.top = `${top}px`;
    windowEl.style.width = `${windowWidth}px`;
    windowEl.style.height = `${windowHeight}px`;
  }
  
  // Create window HTML
  windowEl.innerHTML = `
    <div class="window-header">
      <div class="window-title">
        <i class="${appConfig.icon}"></i>
        <span>${appConfig.name}</span>
      </div>
      <div class="window-controls">
        <button class="window-control minimize" data-action="minimize">
          <i class="fas fa-window-minimize"></i>
        </button>
        ${!state.isMobile ? `
          <button class="window-control maximize" data-action="maximize">
            <i class="fas fa-window-maximize"></i>
          </button>
        ` : ''}
        <button class="window-control close" data-action="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div class="window-content">
      <div class="window-loading">
        <div class="loading-spinner"></div>
      </div>
      <iframe class="window-iframe" src="${appConfig.url}" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>
    </div>
  `;
  
  windowContainer.appendChild(windowEl);
  
  // Setup window event listeners
  setupWindowListeners(windowEl, appId);
  
  // Store window reference
  state.windows.set(appId, {
    element: windowEl,
    config: appConfig,
    isMinimized: false,
    isMaximized: false
  });
  
  // Add to taskbar
  addToTaskbar(appId, appConfig);
  
  // Focus the window
  focusWindow(appId);
  
  // Hide loading spinner after a delay
  setTimeout(() => {
    const loading = windowEl.querySelector('.window-loading');
    if (loading) loading.style.display = 'none';
  }, 2000);
}

function setupWindowListeners(windowEl, appId) {
  const header = windowEl.querySelector('.window-header');
  const controls = windowEl.querySelectorAll('.window-control');
  
  // Window controls
  controls.forEach(control => {
    control.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = control.dataset.action;
      handleWindowAction(appId, action);
    });
  });
  
  // Dragging (desktop only)
  if (!state.isMobile) {
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-control')) return;
      startDragging(appId, e);
    });
  }
  
  // Focus on click
  windowEl.addEventListener('mousedown', () => {
    focusWindow(appId);
  });
}

// ============================================
// WINDOW MANAGEMENT
// ============================================

function handleWindowAction(appId, action) {
  const window = state.windows.get(appId);
  if (!window) return;
  
  switch (action) {
    case 'minimize':
      minimizeWindow(appId);
      break;
    case 'maximize':
      toggleMaximize(appId);
      break;
    case 'close':
      closeWindow(appId);
      break;
  }
}

function minimizeWindow(appId) {
  const window = state.windows.get(appId);
  if (!window) return;
  
  window.element.classList.add('minimized');
  window.isMinimized = true;
  
  // Update taskbar
  updateTaskbarApp(appId);
}

function restoreWindow(appId) {
  const window = state.windows.get(appId);
  if (!window) return;
  
  window.element.classList.remove('minimized');
  window.isMinimized = false;
  focusWindow(appId);
  
  updateTaskbarApp(appId);
}

function toggleMaximize(appId) {
  const window = state.windows.get(appId);
  if (!window || state.isMobile) return;
  
  if (window.isMaximized) {
    window.element.classList.remove('fullscreen');
    window.isMaximized = false;
  } else {
    window.element.classList.add('fullscreen');
    window.isMaximized = true;
  }
}

function closeWindow(appId) {
  const window = state.windows.get(appId);
  if (!window) return;
  
  // Animate out
  window.element.style.opacity = '0';
  window.element.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    window.element.remove();
    state.windows.delete(appId);
    removeFromTaskbar(appId);
    
    // Focus another window if available
    if (state.windows.size > 0) {
      const nextAppId = Array.from(state.windows.keys())[0];
      focusWindow(nextAppId);
    }
  }, 200);
}

function focusWindow(appId) {
  const window = state.windows.get(appId);
  if (!window) return;
  
  // Update z-index
  window.element.style.zIndex = state.windowZIndex++;
  state.activeWindow = appId;
  
  // Restore if minimized
  if (window.isMinimized) {
    restoreWindow(appId);
  }
  
  // Update taskbar
  updateTaskbarStates();
}

// ============================================
// WINDOW DRAGGING
// ============================================

function startDragging(appId, e) {
  const window = state.windows.get(appId);
  if (!window || window.isMaximized) return;
  
  state.isDragging = true;
  state.dragWindow = appId;
  
  const rect = window.element.getBoundingClientRect();
  state.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  
  window.element.style.transition = 'none';
  focusWindow(appId);
}

function handleDragging(e) {
  if (!state.isDragging || !state.dragWindow) return;
  
  const window = state.windows.get(state.dragWindow);
  if (!window) return;
  
  const x = e.clientX - state.dragOffset.x;
  const y = e.clientY - state.dragOffset.y;
  
  window.element.style.left = `${x}px`;
  window.element.style.top = `${y}px`;
}

function stopDragging() {
  if (state.dragWindow) {
    const window = state.windows.get(state.dragWindow);
    if (window) {
      window.element.style.transition = '';
    }
  }
  
  state.isDragging = false;
  state.dragWindow = null;
  
  document.removeEventListener('mousemove', handleDragging);
  document.removeEventListener('mouseup', stopDragging);
}

// ============================================
// TASKBAR MANAGEMENT
// ============================================

function addToTaskbar(appId, appConfig) {
  const taskbarApps = document.getElementById('taskbarApps');
  
  // Check if already in taskbar
  if (document.getElementById(`taskbar-${appId}`)) return;
  
  const taskbarApp = document.createElement('div');
  taskbarApp.className = 'taskbar-app';
  taskbarApp.id = `taskbar-${appId}`;
  taskbarApp.innerHTML = `
    <i class="${appConfig.icon}"></i>
    <span>${appConfig.name}</span>
  `;
  
  taskbarApp.addEventListener('click', () => {
    const window = state.windows.get(appId);
    if (window) {
      if (window.isMinimized || state.activeWindow !== appId) {
        focusWindow(appId);
      } else {
        minimizeWindow(appId);
      }
    }
  });
  
  taskbarApps.appendChild(taskbarApp);
  updateTaskbarStates();
}

function removeFromTaskbar(appId) {
  const taskbarApp = document.getElementById(`taskbar-${appId}`);
  if (taskbarApp) {
    taskbarApp.remove();
  }
}

function updateTaskbarApp(appId) {
  updateTaskbarStates();
}

function updateTaskbarStates() {
  document.querySelectorAll('.taskbar-app').forEach(app => {
    const appId = app.id.replace('taskbar-', '');
    const window = state.windows.get(appId);
    
    if (window && state.activeWindow === appId && !window.isMinimized) {
      app.classList.add('active');
    } else {
      app.classList.remove('active');
    }
  });
}

// ============================================
// APP LAUNCHER (MOBILE)
// ============================================

function toggleAppLauncher() {
  const launcher = document.getElementById('appLauncher');
  launcher.classList.toggle('hidden');
}

// ============================================
// SYSTEM UI
// ============================================

function updateClock() {
  const timeEl = document.getElementById('systemTime');
  if (!timeEl) return;
  
  const now = new Date();
  const options = state.isMobile 
    ? { hour: '2-digit', minute: '2-digit' }
    : { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' };
  
  timeEl.textContent = now.toLocaleString([], options);
}

function handleResize() {
  const wasMobile = state.isMobile;
  state.isMobile = window.innerWidth <= 768;
  
  if (wasMobile !== state.isMobile) {
    // Mode changed - adjust all windows
    state.windows.forEach((window, appId) => {
      if (state.isMobile) {
        window.element.classList.add('fullscreen');
      } else {
        window.element.classList.remove('fullscreen');
      }
    });
    
    updateClock();
  }
}

// ============================================
// PWA FEATURES
// ============================================

function checkPWAStatus() {
  // Check if running as installed PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone 
    || document.referrer.includes('android-app://');
  
  if (isStandalone) {
    console.log('Running as PWA');
    document.body.classList.add('pwa-mode');
  }
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // You could show a custom install button here
  console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  deferredPrompt = null;
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message, type = 'info') {
  // Simple notification system (can be enhanced)
  console.log(`[${type.toUpperCase()}]`, message);
  
  // In production, you could show a toast notification
}

// Handle offline/online status
window.addEventListener('online', () => {
  showNotification('You are back online', 'success');
});

window.addEventListener('offline', () => {
  showNotification('You are offline - some features may be limited', 'warning');
});

// Export for debugging
window.Nuvola365 = {
  state,
  launchApp,
  closeWindow,
  focusWindow,
  APP_CONFIG
};
