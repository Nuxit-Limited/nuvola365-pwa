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
  document.getElementById('signInBtn').addEventListener('click', () => {
    handleAuth('signin');
  });
  
  // Sign Up button
  document.getElementById('signUpBtn').addEventListener('click', () => {
    handleAuth('signup');
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
  
  // Desktop Icons - Double click to open
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const appId = icon.dataset.app;
      openApp(appId);
    });
  });
  
  // App Menu Button
  document.getElementById('appMenuBtn').addEventListener('click', toggleAppLauncher);
  
  // Launcher Close
  document.getElementById('launcherClose')?.addEventListener('click', closeAppLauncher);
  
  // App Items in Launcher
  document.querySelectorAll('.app-item').forEach(item => {
    item.addEventListener('click', () => {
      const appId = item.dataset.app;
      openApp(appId);
      closeAppLauncher();
    });
  });
  
  // App Folders
  document.querySelectorAll('.app-folder').forEach(folder => {
    folder.addEventListener('click', () => {
      const folderId = folder.dataset.folder;
      openFolder(folderId);
    });
  });
  
  // Lock/Exit DeX
  document.getElementById('lockDex')?.addEventListener('click', () => {
    // Lock screen - just close launcher for now
    closeAppLauncher();
    showNotification('Screen Locked', 'Click to unlock');
  });
  
  document.getElementById('exitDex')?.addEventListener('click', () => {
    if (confirm('Sign out and exit DeX mode?')) {
      // Clear auth state
      localStorage.removeItem('nuvola365_auth');
      localStorage.removeItem('nuvola365_auth_type');
      localStorage.removeItem('nuvola365_auth_time');
      
      // Reload to login screen
      location.reload();
    }
  });
  
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
    window.open(app.url, '_blank');
    showNotification(app.name, 'Opening in new tab...');
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
