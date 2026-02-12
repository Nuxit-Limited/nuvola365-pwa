// ============================================
// NUVOLA365 - Samsung DeX System
// Complete with Mobile Touch Support
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
  const signInBtn = document.getElementById('signInBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  
  console.log('🔧 Initializing auth buttons');
  
  // Use onclick for maximum mobile compatibility
  signInBtn.onclick = function() {
    console.log('✅ Sign In clicked!');
    handleAuth('signin');
  };
  
  signUpBtn.onclick = function() {
    console.log('✅ Sign Up clicked!');
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
  
  console.log('🔧 Initializing desktop');
  
  // Desktop Icons - onclick with double-tap detection
  const icons = document.querySelectorAll('.desktop-icon');
  console.log('Found', icons.length, 'desktop icons');
  
  icons.forEach((icon, index) => {
    let tapCount = 0;
    let tapTimer = null;
    
    icon.onclick = function() {
      console.log(`Icon clicked: ${icon.dataset.app}, count: ${tapCount + 1}`);
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
        console.log('🚀 Opening app:', appId);
        openApp(appId);
      }
    };
  });
  
  // App Menu Button
  const appMenuBtn = document.getElementById('appMenuBtn');
  appMenuBtn.onclick = function() {
    console.log('✅ App menu clicked');
    toggleAppLauncher();
  };
  
  // Launcher Close
  const launcherClose = document.getElementById('launcherClose');
  if (launcherClose) {
    launcherClose.onclick = function() {
      console.log('✅ Launcher close clicked');
      closeAppLauncher();
    };
  }
  
  // App Items in Launcher
  const appItems = document.querySelectorAll('.app-item');
  console.log('Found', appItems.length, 'app items');
  appItems.forEach(item => {
    item.onclick = function() {
      const appId = item.dataset.app;
      console.log('✅ App item clicked:', appId);
      openApp(appId);
      closeAppLauncher();
    };
  });
  
  // App Folders
  const folders = document.querySelectorAll('.app-folder');
  console.log('Found', folders.length, 'folders');
  folders.forEach(folder => {
    folder.onclick = function() {
      const folderId = folder.dataset.folder;
      console.log('✅ Folder clicked:', folderId);
      openFolder(folderId);
    };
  });
  
  // Lock DeX
  const lockBtn = document.getElementById('lockDex');
  if (lockBtn) {
    lockBtn.onclick = function() {
      console.log('✅ Lock clicked');
      closeAppLauncher();
      showNotification('Screen Locked', 'Click to unlock');
    };
  }
  
  // Exit DeX
  const exitBtn = document.getElementById('exitDex');
  if (exitBtn) {
    exitBtn.onclick = function() {
      console.log('✅ Exit clicked');
      if (confirm('Sign out and exit DeX mode?')) {
        localStorage.removeItem('nuvola365_auth');
        localStorage.removeItem('nuvola365_auth_type');
        localStorage.removeItem('nuvola365_auth_time');
        location.reload();
      }
    };
  }
  
  // Launcher Search
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
  
  // Fullscreen button
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          fullscreenBtn.querySelector('i').className = 'fas fa-compress';
          showNotification('Fullscreen', 'Enabled');
        }).catch(() => {
          showNotification('Fullscreen', 'Not supported');
        });
      } else {
        document.exitFullscreen().then(() => {
          fullscreenBtn.querySelector('i').className = 'fas fa-expand';
          showNotification('Fullscreen', 'Disabled');
        });
      }
    };
  }
  
  // Notifications button
  const notificationsBtn = document.getElementById('notificationsBtn');
  if (notificationsBtn) {
    notificationsBtn.onclick = function() {
      showNotification('Notifications', 'No new notifications');
    };
  }
  
  // Help button
  const helpBtn = document.getElementById('helpBtn');
  if (helpBtn) {
    helpBtn.onclick = function() {
      const helpText = `Nuvola365 Cloud Desktop

🖱️ Desktop: Double-tap icons to open
📁 Folders: Tap to see apps inside
⊞ Grid: Open app launcher
🔍 Search: Find apps quickly

Cloud Apps:
• Cloud PC: Windows 365
• Azure VD: Virtual Desktop
• Teams, Outlook, Office apps

Keyboard: ESC closes launcher`;
      alert(helpText);
    };
  }
  
  // Screen capture
  const screenCaptureBtn = document.getElementById('screenCapture');
  if (screenCaptureBtn) {
    screenCaptureBtn.onclick = function() {
      showNotification('Screen Capture', 'Use browser screenshot tool');
    };
  }
  
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
  document.querySelectorAll('.app-item').forEach(item => {
    item.style.display = 'flex';
  });
}

function openFolder(folderId) {
  console.log('📁 Opening folder:', folderId);
  
  // Close app launcher so folder is visible
  closeAppLauncher();
  
  const folderContents = {
    work: [
      { id: 'word', name: 'Word', icon: 'fas fa-file-word' },
      { id: 'excel', name: 'Excel', icon: 'fas fa-file-excel' },
      { id: 'powerpoint', name: 'PowerPoint', icon: 'fas fa-file-powerpoint' },
      { id: 'onenote', name: 'OneNote', icon: 'fas fa-book' }
    ],
    cloud: [
      { id: 'cloud-pc', name: 'Cloud PC', icon: 'fas fa-desktop' },
      { id: 'avd', name: 'Azure VD', icon: 'fas fa-cloud' },
      { id: 'onedrive', name: 'OneDrive', icon: 'fas fa-cloud-upload-alt' }
    ],
    media: [
      { id: 'browser', name: 'Browser', icon: 'fas fa-globe' },
      { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com' },
      { id: 'spotify', name: 'Spotify', icon: 'fab fa-spotify', url: 'https://open.spotify.com' }
    ],
    utilities: [
      { id: 'terminal', name: 'Terminal', icon: 'fas fa-terminal' },
      { id: 'files', name: 'Files', icon: 'fas fa-folder' },
      { id: 'settings', name: 'Settings', icon: 'fas fa-cog' },
      { id: 'calculator', name: 'Calculator', icon: 'fas fa-calculator' }
    ]
  };
  
  const apps = folderContents[folderId];
  if (!apps) {
    showNotification('Folder', 'No apps in this folder');
    return;
  }
  
  const folderName = folderId.charAt(0).toUpperCase() + folderId.slice(1);
  const windowId = `folder-${folderId}-${Date.now()}`;
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = windowId;
  
  // Make sure folder appears on top with high z-index
  System.windowZIndex += 100; // Jump z-index to ensure it's on top
  windowEl.style.zIndex = System.windowZIndex;
  
  const width = 600;
  const height = 400;
  const left = (window.innerWidth - width) / 2;
  const top = 100;
  
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <i class="fas fa-folder"></i>
        <span>${folderName} Folder</span>
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
    <div class="window-content folder-content">
      <div class="folder-grid">
        ${apps.map(app => `
          <div class="folder-app-item" data-app="${app.id}" data-url="${app.url || ''}">
            <div class="folder-app-icon">
              <i class="${app.icon}"></i>
            </div>
            <span>${app.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('windowsContainer').appendChild(windowEl);
  
  const titlebar = windowEl.querySelector('.window-titlebar');
  const controls = windowEl.querySelectorAll('.window-btn');
  
  controls[0].onclick = function() {
    windowEl.classList.add('minimized');
  };
  
  controls[1].onclick = function() {
    windowEl.classList.toggle('maximized');
  };
  
  controls[2].onclick = function() {
    windowEl.remove();
  };
  
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;
    startDragging(windowId, e, windowEl);
  });
  
  windowEl.addEventListener('mousedown', () => {
    windowEl.style.zIndex = System.windowZIndex++;
  });
  
  // Handle folder app clicks with onclick
  windowEl.querySelectorAll('.folder-app-item').forEach(item => {
    item.onclick = function() {
      const appId = item.dataset.app;
      const appUrl = item.dataset.url;
      
      console.log('✅ Folder app clicked:', appId);
      
      if (appUrl) {
        // Open external URLs embedded in iframe
        createEmbeddedWindow(item.querySelector('span').textContent, appUrl);
      } else {
        openApp(appId);
      }
    };
  });
  
  showNotification(folderName, `${apps.length} apps available`);
}

function startDragging(windowId, e, windowEl) {
  System.isDragging = true;
  System.dragWindow = windowEl;
  
  const rect = windowEl.getBoundingClientRect();
  System.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ============================================
// EMBEDDED WINDOW (iframe for cloud apps)
// ============================================

function createEmbeddedWindow(appName, url, icon = 'fas fa-globe') {
  const windowId = `embedded-${Date.now()}`;
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = windowId;
  windowEl.style.zIndex = System.windowZIndex++;
  
  const width = 1200;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = 50;
  
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <i class="${icon}"></i>
        <span>${appName}</span>
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
    <div class="window-content iframe-container">
      <div class="iframe-loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading ${appName}...</p>
      </div>
      <iframe src="${url}" class="embedded-iframe"></iframe>
    </div>
  `;
  
  document.getElementById('windowsContainer').appendChild(windowEl);
  
  const titlebar = windowEl.querySelector('.window-titlebar');
  const controls = windowEl.querySelectorAll('.window-btn');
  const iframe = windowEl.querySelector('.embedded-iframe');
  const loading = windowEl.querySelector('.iframe-loading');
  
  // Hide loading indicator when iframe loads
  iframe.onload = function() {
    loading.style.display = 'none';
  };
  
  controls[0].onclick = function() {
    windowEl.classList.add('minimized');
  };
  
  controls[1].onclick = function() {
    windowEl.classList.toggle('maximized');
  };
  
  controls[2].onclick = function() {
    windowEl.remove();
  };
  
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;
    System.isDragging = true;
    System.dragWindow = windowEl;
    
    const rect = windowEl.getBoundingClientRect();
    System.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  });
  
  windowEl.addEventListener('mousedown', () => {
    windowEl.style.zIndex = System.windowZIndex++;
  });
  
  showNotification(appName, 'Opening embedded...');
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
  
  // Cloud apps - open embedded in iframe instead of new tab
  if (app.isCloudApp && app.openInTab) {
    let launchUrl = app.url;
    
    // Check for direct launch configuration
    if (appId === 'cloud-pc' && window.CloudConfig?.windows365.cloudPcId) {
      launchUrl = window.CloudConfig.windows365.getLaunchUrl();
      showNotification(app.name, 'Launching Cloud PC directly...');
    } else if (appId === 'avd' && window.CloudConfig?.avd.workspaceId && window.CloudConfig?.avd.resourceId) {
      launchUrl = window.CloudConfig.avd.getLaunchUrl();
      showNotification(app.name, 'Launching AVD resource directly...');
    } else {
      showNotification(app.name, 'Opening embedded...');
    }
    
    // Create embedded iframe window instead of opening new tab
    createEmbeddedWindow(app.name, launchUrl, app.icon);
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
  
  controls[0].onclick = function() { minimizeWindow(appId); };
  controls[1].onclick = function() { toggleMaximizeWindow(appId); };
  controls[2].onclick = function() { closeWindow(appId); };
  
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

function startDragging(appId, e) {
  const win = System.windows.get(appId);
  if (!win || win.isMaximized) return;
  
  System.isDragging = true;
  System.dragWindow = win.element;
  
  const rect = win.element.getBoundingClientRect();
  System.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  focusWindow(appId);
}

function handleDragging(e) {
  if (!System.isDragging || !System.dragWindow) return;
  
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
  
  const x = clientX - System.dragOffset.x;
  const y = Math.max(0, clientY - System.dragOffset.y);
  
  System.dragWindow.style.left = `${x}px`;
  System.dragWindow.style.top = `${y}px`;
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
  btn.onclick = function() {
    const win = System.windows.get(appId);
    if (win?.isMinimized || System.activeWindow !== appId) {
      focusWindow(appId);
    } else {
      minimizeWindow(appId);
    }
  };
  
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
