// ============================================
// NUVOLA365 - Samsung DeX System
// Complete with Auth & Desktop Icons
// ============================================

const System = {
  windows: new Map(),
  windowZIndex: 1000,
  activeWindow: null,
  isDragging: false,
  dragWindow: null,
  dragOffset: { x: 0, y: 0 }
};

// ============================================
// BOOT & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  bootSystem();
});

function bootSystem() {
  // Simulate loading
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    initializeAuth();
  }, 3000);
}

function initializeAuth() {
  // Sign In button
  const signInBtn = document.getElementById('signInBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  
  const handleSignIn = () => handleAuth('signin');
  const handleSignUp = () => handleAuth('signup');
  
  // Add both click and touch events
  signInBtn.addEventListener('click', handleSignIn);
  signInBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleSignIn();
  });
  
  signUpBtn.addEventListener('click', handleSignUp);
  signUpBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleSignUp();
  });
}

function handleAuth(type) {
  // Show loading state
  const authScreen = document.getElementById('authScreen');
  const btn = type === 'signin' ? document.getElementById('signInBtn') : document.getElementById('signUpBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Authenticating...</span>';
  
  // Simulate authentication (replace with real Microsoft OAuth in production)
  setTimeout(() => {
    // Store auth state
    localStorage.setItem('nuvola365_auth', 'true');
    localStorage.setItem('nuvola365_auth_type', type);
    localStorage.setItem('nuvola365_auth_time', new Date().toISOString());
    
    // Hide auth screen, show desktop
    authScreen.classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    
    // Initialize desktop
    initializeDesktop();
    
    // Welcome message
    const authType = type === 'signin' ? 'Signed in' : 'Account created';
    setTimeout(() => {
      showNotification('Welcome to Nuvola365', `${authType} successfully!`);
    }, 500);
  }, 1500);
}

function initializeDesktop() {
  // Update clock
  updateClock();
  setInterval(updateClock, 1000);
  
  // Desktop Icons - Support both double-click and touch
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    let touchTimeout = null;
    let lastTap = 0;
    
    // Double-click for desktop
    icon.addEventListener('dblclick', () => {
      const appId = icon.dataset.app;
      openApp(appId);
    });
    
    // Touch events for mobile
    icon.addEventListener('touchstart', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        // Double tap detected
        e.preventDefault();
        const appId = icon.dataset.app;
        openApp(appId);
        lastTap = 0;
      } else {
        // Single tap - highlight icon
        lastTap = currentTime;
        icon.style.background = 'rgba(255, 255, 255, 0.15)';
        
        // Clear highlight after delay
        if (touchTimeout) clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
          icon.style.background = '';
        }, 300);
      }
    });
    
    // Single click for mobile (fallback)
    let clickCount = 0;
    let clickTimer = null;
    icon.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        const appId = icon.dataset.app;
        openApp(appId);
      }
    });
  });
  
  // App Menu Button - Support touch
  const appMenuBtn = document.getElementById('appMenuBtn');
  appMenuBtn.addEventListener('click', toggleAppLauncher);
  appMenuBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleAppLauncher();
  });
  
  // Launcher Close - Support touch
  const launcherClose = document.getElementById('launcherClose');
  if (launcherClose) {
    launcherClose.addEventListener('click', closeAppLauncher);
    launcherClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeAppLauncher();
    });
  }
  
  // App Items in Launcher - Support touch
  document.querySelectorAll('.app-item').forEach(item => {
    const handleAppLaunch = () => {
      const appId = item.dataset.app;
      openApp(appId);
      closeAppLauncher();
    };
    
    item.addEventListener('click', handleAppLaunch);
    item.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleAppLaunch();
    });
  });
  
  // App Folders - Support touch
  document.querySelectorAll('.app-folder').forEach(folder => {
    const handleFolderOpen = () => {
      const folderId = folder.dataset.folder;
      openFolder(folderId);
    };
    
    folder.addEventListener('click', handleFolderOpen);
    folder.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleFolderOpen();
    });
  });
  
  // Lock/Exit DeX - Support touch
  const lockBtn = document.getElementById('lockDex');
  const exitBtn = document.getElementById('exitDex');
  
  if (lockBtn) {
    const handleLock = () => {
      closeAppLauncher();
      showNotification('Screen Locked', 'Click to unlock');
    };
    lockBtn.addEventListener('click', handleLock);
    lockBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleLock();
    });
  }
  
  if (exitBtn) {
    const handleExit = () => {
      if (confirm('Sign out and exit DeX mode?')) {
        localStorage.removeItem('nuvola365_auth');
        localStorage.removeItem('nuvola365_auth_type');
        localStorage.removeItem('nuvola365_auth_time');
        location.reload();
      }
    };
    exitBtn.addEventListener('click', handleExit);
    exitBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleExit();
    });
  }
  
  // Launcher Search
  document.getElementById('launcherSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.app-item').forEach(item => {
      const name = item.querySelector('span').textContent.toLowerCase();
      item.style.display = name.includes(query) ? 'flex' : 'none';
    });
  });
  
  // Window management
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  document.addEventListener('touchmove', handleDragging);
  document.addEventListener('touchend', stopDragging);
  
  // Close launcher on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAppLauncher();
    }
  });
  
  // Prevent zoom on double-tap for iOS
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
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
  // Reset search
  document.querySelectorAll('.app-item').forEach(item => {
    item.style.display = 'flex';
  });
}

function openFolder(folderId) {
  showNotification('Folder', `Opening ${folderId} folder...`);
  // Could implement folder view here
}

// ============================================
// APP MANAGEMENT
// ============================================

function openApp(appId, options = {}) {
  const app = Applications[appId];
  if (!app) {
    console.error('App not found:', appId);
    return;
  }
  
  // Cloud apps open in new tabs
  if (app.isCloudApp && app.openInTab) {
    let launchUrl = app.url;
    
    // Check for direct launch configuration
    if (window.CloudConfig && window.CloudConfig.launchCloudApp) {
      const hasDirectLaunch = window.CloudConfig.launchCloudApp(appId);
      if (hasDirectLaunch) {
        showNotification(app.name, 'Launching with direct URL...');
        return;
      }
    }
    
    // Use configured direct launch URL if available
    if (appId === 'cloud-pc' && window.CloudConfig?.windows365.cloudPcId) {
      launchUrl = window.CloudConfig.windows365.getLaunchUrl();
      showNotification(app.name, 'Launching Cloud PC directly...');
    } else if (appId === 'avd' && window.CloudConfig?.avd.workspaceId && window.CloudConfig?.avd.resourceId) {
      launchUrl = window.CloudConfig.avd.getLaunchUrl();
      showNotification(app.name, 'Launching AVD resource directly...');
    } else {
      showNotification(app.name, 'Opening in new tab...');
    }
    
    window.open(launchUrl, '_blank');
    return;
  }
  
  // Check if already open
  if (System.windows.has(appId)) {
    focusWindow(appId);
    return;
  }
  
  createWindow(appId, app, options);
}

function createWindow(appId, app, options = {}) {
  const windowId = `window-${appId}-${Date.now()}`;
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = windowId;
  windowEl.style.zIndex = System.windowZIndex++;
  
  // Size and position
  const width = 900;
  const height = 600;
  const left = (window.innerWidth - width) / 2 + (System.windows.size * 30);
  const top = 80 + (System.windows.size * 30);
  
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <i class="${app.icon}"></i>
        <span>${app.name}</span>
      </div>
      <div class="window-controls">
        <button class="window-btn minimize">
          <i class="fas fa-window-minimize"></i>
        </button>
        <button class="window-btn maximize">
          <i class="fas fa-window-maximize"></i>
        </button>
        <button class="window-btn close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div class="window-content"></div>
  `;
  
  document.getElementById('windowsContainer').appendChild(windowEl);
  
  // Render app content
  const container = windowEl.querySelector('.window-content');
  if (app.render) {
    app.render(container, windowId, options);
  }
  
  setupWindowControls(windowEl, appId, windowId);
  
  System.windows.set(appId, {
    element: windowEl,
    app: app,
    id: windowId,
    isMinimized: false,
    isMaximized: false
  });
  
  addToTaskbar(appId, app);
  focusWindow(appId);
}

function setupWindowControls(windowEl, appId, windowId) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  const controls = windowEl.querySelectorAll('.window-btn');
  
  controls[0].addEventListener('click', () => minimizeWindow(appId));
  controls[1].addEventListener('click', () => toggleMaximizeWindow(appId));
  controls[2].addEventListener('click', () => closeWindow(appId));
  
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;
    startDragging(appId, e);
  });
  
  titlebar.addEventListener('dblclick', () => {
    toggleMaximizeWindow(appId);
  });
  
  windowEl.addEventListener('mousedown', () => {
    focusWindow(appId);
  });
}

function focusWindow(appId) {
  const win = System.windows.get(appId);
  if (!win) return;
  
  if (win.isMinimized) {
    win.element.classList.remove('minimized');
    win.isMinimized = false;
  }
  
  win.element.style.zIndex = System.windowZIndex++;
  System.activeWindow = appId;
  
  updateTaskbar();
}

function minimizeWindow(appId) {
  const win = System.windows.get(appId);
  if (win) {
    win.element.classList.add('minimized');
    win.isMinimized = true;
    updateTaskbar();
  }
}

function toggleMaximizeWindow(appId) {
  const win = System.windows.get(appId);
  if (win) {
    win.isMaximized = !win.isMaximized;
    win.element.classList.toggle('maximized', win.isMaximized);
  }
}

function closeWindow(appId) {
  const win = System.windows.get(appId);
  if (win) {
    win.element.remove();
    System.windows.delete(appId);
    removeFromTaskbar(appId);
  }
}

// ============================================
// WINDOW DRAGGING
// ============================================

function startDragging(appId, e) {
  const win = System.windows.get(appId);
  if (!win || win.isMaximized) return;
  
  System.isDragging = true;
  System.dragWindow = appId;
  
  const rect = win.element.getBoundingClientRect();
  System.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  focusWindow(appId);
}

function handleDragging(e) {
  if (!System.isDragging || !System.dragWindow) return;
  
  const win = System.windows.get(System.dragWindow);
  if (!win) return;
  
  const x = e.clientX - System.dragOffset.x;
  const y = Math.max(0, e.clientY - System.dragOffset.y);
  
  win.element.style.left = `${x}px`;
  win.element.style.top = `${y}px`;
}

function stopDragging() {
  System.isDragging = false;
  System.dragWindow = null;
}

// ============================================
// TASKBAR
// ============================================

function addToTaskbar(appId, app) {
  const taskbarApps = document.getElementById('taskbarApps');
  
  const btn = document.createElement('button');
  btn.className = 'taskbar-app';
  btn.id = `taskbar-${appId}`;
  btn.innerHTML = `<i class="${app.icon}"></i>`;
  btn.title = app.name;
  btn.addEventListener('click', () => {
    const win = System.windows.get(appId);
    if (win?.isMinimized || System.activeWindow !== appId) {
      focusWindow(appId);
    } else {
      minimizeWindow(appId);
    }
  });
  
  taskbarApps.appendChild(btn);
  updateTaskbar();
}

function removeFromTaskbar(appId) {
  document.getElementById(`taskbar-${appId}`)?.remove();
}

function updateTaskbar() {
  document.querySelectorAll('.taskbar-app').forEach(btn => {
    const appId = btn.id.replace('taskbar-', '');
    const win = System.windows.get(appId);
    btn.classList.toggle('active', win && !win.isMinimized && System.activeWindow === appId);
  });
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
  // Create notification container if it doesn't exist
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Create notification
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
  
  // Add to container
  container.appendChild(notif);
  
  // Animate in
  setTimeout(() => notif.classList.add('show'), 10);
  
  // Close button
  notif.querySelector('.notification-close').addEventListener('click', () => {
    removeNotification(notif);
  });
  
  // Auto remove after 4 seconds
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
