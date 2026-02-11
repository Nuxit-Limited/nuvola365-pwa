// ============================================
// NUVOLA365 DEX - Main System Orchestration
// ============================================

// App Configuration - Cloud Apps + Built-in Apps
const AppRegistry = {
  // Built-in system apps
  ...Object.fromEntries(
    Object.entries(BuiltInApps).map(([id, app]) => [
      id,
      { ...app, isBuiltIn: true, behavior: 'window' }
    ])
  ),
  
  // Microsoft 365 Cloud Apps
  'cloud-pc': {
    name: 'Cloud PC',
    icon: 'fas fa-desktop',
    color: '#0078d4',
    url: 'https://windows365.microsoft.com',
    behavior: 'tab',
    isBuiltIn: false
  },
  'remote-apps': {
    name: 'Remote Apps',
    icon: 'fas fa-th-large',
    color: '#0078d4',
    url: 'https://client.wvd.microsoft.com/arm/webclient/',
    behavior: 'tab',
    isBuiltIn: false
  },
  'word': {
    name: 'Word',
    icon: 'fas fa-file-word',
    color: '#2b579a',
    url: 'https://www.office.com/launch/word',
    behavior: 'tab',
    isBuiltIn: false
  },
  'excel': {
    name: 'Excel',
    icon: 'fas fa-file-excel',
    color: '#217346',
    url: 'https://www.office.com/launch/excel',
    behavior: 'tab',
    isBuiltIn: false
  },
  'powerpoint': {
    name: 'PowerPoint',
    icon: 'fas fa-file-powerpoint',
    color: '#d24726',
    url: 'https://www.office.com/launch/powerpoint',
    behavior: 'tab',
    isBuiltIn: false
  },
  'teams': {
    name: 'Teams',
    icon: 'fas fa-users',
    color: '#6264a7',
    url: 'https://teams.microsoft.com',
    behavior: 'tab',
    isBuiltIn: false
  },
  'outlook': {
    name: 'Outlook',
    icon: 'fas fa-envelope',
    color: '#0078d4',
    url: 'https://outlook.office.com',
    behavior: 'tab',
    isBuiltIn: false
  },
  'onedrive': {
    name: 'OneDrive',
    icon: 'fas fa-cloud',
    color: '#0078d4',
    url: 'https://onedrive.live.com',
    behavior: 'tab',
    isBuiltIn: false
  }
};

// System State
const SystemState = {
  windows: new Map(),
  activeWindow: null,
  windowZIndex: 100,
  isDragging: false,
  dragWindow: null,
  dragOffset: { x: 0, y: 0 },
  isMobile: window.innerWidth <= 768,
  notifications: []
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeSystem();
  setupEventListeners();
  startSystemServices();
});

function initializeSystem() {
  // Check if already logged in
  const isLoggedIn = localStorage.getItem('nuvola365_loggedin');
  if (isLoggedIn) {
    showDesktop();
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

function setupEventListeners() {
  // Lockscreen
  document.getElementById('lockSignin')?.addEventListener('click', handleLogin);
  
  // App Launcher
  document.getElementById('appLauncherBtn')?.addEventListener('click', toggleAppDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', toggleAppDrawer);
  
  // Desktop icons
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      launchApp(icon.dataset.app);
    });
  });
  
  // Drawer apps
  document.querySelectorAll('.drawer-app').forEach(app => {
    app.addEventListener('click', () => {
      launchApp(app.dataset.app);
      toggleAppDrawer();
    });
  });
  
  // Quick Settings
  document.getElementById('quickSettingsBtn')?.addEventListener('click', toggleQuickSettings);
  
  // Notifications
  document.getElementById('notifBtn')?.addEventListener('click', toggleNotifications);
  document.getElementById('notifClear')?.addEventListener('click', clearNotifications);
  
  // Volume and brightness sliders
  document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
    document.getElementById('volumeValue').textContent = e.target.value + '%';
  });
  
  document.getElementById('brightnessSlider')?.addEventListener('input', (e) => {
    document.getElementById('brightnessValue').textContent = e.target.value + '%';
  });
  
  // Quick settings tiles
  document.querySelectorAll('.qs-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      tile.classList.toggle('active');
    });
  });
  
  // Search
  document.getElementById('searchInput')?.addEventListener('input', handleSearch);
  document.getElementById('appSearch')?.addEventListener('input', handleAppSearch);
  
  // Context menu
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', closeContextMenu);
  
  // Window management
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  
  // Responsive
  window.addEventListener('resize', handleResize);
  
  // Close panels on click outside
  document.addEventListener('click', (e) => {
    const quickSettings = document.getElementById('quickSettings');
    const notifPanel = document.getElementById('notificationsPanel');
    
    if (!e.target.closest('.quick-settings') && !e.target.closest('#quickSettingsBtn')) {
      quickSettings?.classList.add('hidden');
    }
    
    if (!e.target.closest('.notifications-panel') && !e.target.closest('#notifBtn')) {
      notifPanel?.classList.add('hidden');
    }
  });
}

function startSystemServices() {
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('Service Worker registration failed:', err);
    });
  }
  
  // Check network status
  window.addEventListener('online', () => {
    showNotification('Network connection restored');
  });
  
  window.addEventListener('offline', () => {
    showNotification('You are offline');
  });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin() {
  // Simulate login
  localStorage.setItem('nuvola365_loggedin', 'true');
  
  const lockscreen = document.getElementById('lockscreen');
  lockscreen.style.opacity = '0';
  lockscreen.style.transform = 'scale(1.1)';
  lockscreen.style.transition = 'all 0.5s ease';
  
  setTimeout(() => {
    lockscreen.classList.add('hidden');
    showDesktop();
  }, 500);
}

function showDesktop() {
  const desktop = document.getElementById('desktop');
  desktop.classList.remove('hidden');
  desktop.style.opacity = '0';
  
  setTimeout(() => {
    desktop.style.transition = 'opacity 0.5s ease';
    desktop.style.opacity = '1';
  }, 50);
  
  // Welcome notification
  setTimeout(() => {
    showNotification('Welcome to Nuvola365!');
  }, 1000);
}

// ============================================
// APP LAUNCHING
// ============================================

function launchApp(appId) {
  const appConfig = AppRegistry[appId];
  if (!appConfig) {
    console.error('App not found:', appId);
    return;
  }
  
  // Check if already running
  if (SystemState.windows.has(appId)) {
    focusWindow(appId);
    return;
  }
  
  // Launch based on behavior
  if (appConfig.isBuiltIn) {
    createBuiltInWindow(appId, appConfig);
  } else if (appConfig.behavior === 'tab') {
    openInNewTab(appConfig);
    addToTaskbar(appId, appConfig);
  } else {
    createExternalWindow(appId, appConfig);
  }
}

function createBuiltInWindow(appId, appConfig) {
  const windowEl = createWindowElement(appId, appConfig);
  const container = windowEl.querySelector('.window-content');
  
  // Render built-in app
  if (appConfig.render) {
    appConfig.render(container);
  }
  
  document.getElementById('windowsLayer').appendChild(windowEl);
  setupWindowControls(windowEl, appId);
  
  SystemState.windows.set(appId, {
    element: windowEl,
    config: appConfig,
    isMinimized: false,
    isMaximized: false
  });
  
  addToTaskbar(appId, appConfig);
  focusWindow(appId);
}

function createExternalWindow(appId, appConfig) {
  const windowEl = createWindowElement(appId, appConfig);
  const container = windowEl.querySelector('.window-content');
  
  // Add iframe
  container.innerHTML = `
    <iframe src="${appConfig.url}" style="width: 100%; height: 100%; border: none; background: white;"></iframe>
  `;
  
  document.getElementById('windowsLayer').appendChild(windowEl);
  setupWindowControls(windowEl, appId);
  
  SystemState.windows.set(appId, {
    element: windowEl,
    config: appConfig,
    isMinimized: false,
    isMaximized: false
  });
  
  addToTaskbar(appId, appConfig);
  focusWindow(appId);
}

function createWindowElement(appId, appConfig) {
  const windowEl = document.createElement('div');
  windowEl.className = 'window';
  windowEl.id = `window-${appId}`;
  windowEl.style.zIndex = SystemState.windowZIndex++;
  
  // Default size and position
  const width = 900;
  const height = 600;
  const left = (window.innerWidth - width) / 2 + (SystemState.windows.size * 30);
  const top = 80 + (SystemState.windows.size * 30);
  
  windowEl.style.width = `${width}px`;
  windowEl.style.height = `${height}px`;
  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  
  windowEl.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        <i class="${appConfig.icon}"></i>
        <span>${appConfig.name}</span>
      </div>
      <div class="window-controls">
        <button class="window-btn minimize" data-action="minimize">
          <i class="fas fa-window-minimize"></i>
        </button>
        <button class="window-btn maximize" data-action="maximize">
          <i class="fas fa-window-maximize"></i>
        </button>
        <button class="window-btn close" data-action="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div class="window-content"></div>
  `;
  
  return windowEl;
}

function openInNewTab(appConfig) {
  const width = 1280;
  const height = 800;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  
  window.open(
    appConfig.url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes`
  );
  
  showNotification(`${appConfig.name} opened in new tab`);
}

// ============================================
// WINDOW MANAGEMENT
// ============================================

function setupWindowControls(windowEl, appId) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  const controls = windowEl.querySelectorAll('.window-btn');
  
  // Window controls
  controls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      handleWindowAction(appId, action);
    });
  });
  
  // Dragging
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-btn')) return;
    startDragging(appId, e);
  });
  
  // Focus on click
  windowEl.addEventListener('mousedown', () => {
    focusWindow(appId);
  });
  
  // Double-click to maximize
  titlebar.addEventListener('dblclick', () => {
    toggleMaximize(appId);
  });
}

function handleWindowAction(appId, action) {
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
  const win = SystemState.windows.get(appId);
  if (!win) return;
  
  win.element.classList.add('minimized');
  win.isMinimized = true;
  updateTaskbar();
}

function restoreWindow(appId) {
  const win = SystemState.windows.get(appId);
  if (!win) return;
  
  win.element.classList.remove('minimized');
  win.isMinimized = false;
  focusWindow(appId);
  updateTaskbar();
}

function toggleMaximize(appId) {
  const win = SystemState.windows.get(appId);
  if (!win) return;
  
  if (win.isMaximized) {
    win.element.classList.remove('maximized');
    win.isMaximized = false;
  } else {
    win.element.classList.add('maximized');
    win.isMaximized = true;
  }
}

function closeWindow(appId) {
  const win = SystemState.windows.get(appId);
  if (!win) return;
  
  win.element.style.opacity = '0';
  win.element.style.transform = 'scale(0.9)';
  win.element.style.transition = 'all 0.2s ease';
  
  setTimeout(() => {
    win.element.remove();
    SystemState.windows.delete(appId);
    removeFromTaskbar(appId);
    
    // Focus next window
    if (SystemState.windows.size > 0) {
      const nextId = Array.from(SystemState.windows.keys())[0];
      focusWindow(nextId);
    }
  }, 200);
}

function focusWindow(appId) {
  const win = SystemState.windows.get(appId);
  if (!win) return;
  
  // Restore if minimized
  if (win.isMinimized) {
    restoreWindow(appId);
    return;
  }
  
  // Update z-index
  win.element.style.zIndex = SystemState.windowZIndex++;
  SystemState.activeWindow = appId;
  
  updateTaskbar();
}

// ============================================
// WINDOW DRAGGING
// ============================================

function startDragging(appId, e) {
  const win = SystemState.windows.get(appId);
  if (!win || win.isMaximized) return;
  
  SystemState.isDragging = true;
  SystemState.dragWindow = appId;
  
  const rect = win.element.getBoundingClientRect();
  SystemState.dragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  
  win.element.style.transition = 'none';
  focusWindow(appId);
}

function handleDragging(e) {
  if (!SystemState.isDragging || !SystemState.dragWindow) return;
  
  const win = SystemState.windows.get(SystemState.dragWindow);
  if (!win) return;
  
  const x = e.clientX - SystemState.dragOffset.x;
  const y = Math.max(0, e.clientY - SystemState.dragOffset.y);
  
  win.element.style.left = `${x}px`;
  win.element.style.top = `${y}px`;
}

function stopDragging() {
  if (SystemState.dragWindow) {
    const win = SystemState.windows.get(SystemState.dragWindow);
    if (win) {
      win.element.style.transition = '';
    }
  }
  
  SystemState.isDragging = false;
  SystemState.dragWindow = null;
}

// ============================================
// TASKBAR
// ============================================

function addToTaskbar(appId, appConfig) {
  const taskbarApps = document.getElementById('taskbarApps');
  if (document.getElementById(`taskbar-${appId}`)) return;
  
  const btn = document.createElement('button');
  btn.className = 'taskbar-app';
  btn.id = `taskbar-${appId}`;
  btn.innerHTML = `
    <i class="${appConfig.icon}"></i>
    <span>${appConfig.name}</span>
  `;
  
  btn.addEventListener('click', () => {
    const win = SystemState.windows.get(appId);
    if (win) {
      if (win.isMinimized || SystemState.activeWindow !== appId) {
        focusWindow(appId);
      } else {
        minimizeWindow(appId);
      }
    }
  });
  
  taskbarApps.appendChild(btn);
  updateTaskbar();
}

function removeFromTaskbar(appId) {
  const btn = document.getElementById(`taskbar-${appId}`);
  btn?.remove();
}

function updateTaskbar() {
  document.querySelectorAll('.taskbar-app').forEach(btn => {
    const appId = btn.id.replace('taskbar-', '');
    const win = SystemState.windows.get(appId);
    
    if (win && SystemState.activeWindow === appId && !win.isMinimized) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ============================================
// UI PANELS
// ============================================

function toggleAppDrawer() {
  const drawer = document.getElementById('appDrawer');
  drawer.classList.toggle('hidden');
}

function toggleQuickSettings() {
  const qs = document.getElementById('quickSettings');
  const notif = document.getElementById('notificationsPanel');
  
  qs.classList.toggle('hidden');
  notif.classList.add('hidden');
}

function toggleNotifications() {
  const notif = document.getElementById('notificationsPanel');
  const qs = document.getElementById('quickSettings');
  
  notif.classList.toggle('hidden');
  qs.classList.add('hidden');
}

function clearNotifications() {
  const notifList = document.getElementById('notifList');
  notifList.innerHTML = `
    <div class="notif-empty">
      <i class="fas fa-bell-slash"></i>
      <p>No notifications</p>
    </div>
  `;
  
  const badge = document.getElementById('notifBadge');
  badge?.classList.add('hidden');
  
  SystemState.notifications = [];
}

// ============================================
// SYSTEM FUNCTIONS
// ============================================

function updateClock() {
  const now = new Date();
  
  // Lockscreen clock
  const lockTime = document.getElementById('lockTime');
  const lockDate = document.getElementById('lockDate');
  
  if (lockTime) {
    lockTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  if (lockDate) {
    lockDate.textContent = now.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // System clock
  const systemClock = document.getElementById('systemClock');
  if (systemClock) {
    const time = systemClock.querySelector('.clock-time');
    const date = systemClock.querySelector('.clock-date');
    
    if (time) {
      time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (date) {
      date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
    }
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  if (!query) return;
  
  // Search for apps
  const results = Object.entries(AppRegistry).filter(([id, app]) => 
    app.name.toLowerCase().includes(query)
  );
  
  console.log('Search results:', results);
}

function handleAppSearch(e) {
  const query = e.target.value.toLowerCase();
  const apps = document.querySelectorAll('.drawer-app');
  
  apps.forEach(app => {
    const name = app.querySelector('span').textContent.toLowerCase();
    if (name.includes(query)) {
      app.style.display = 'flex';
    } else {
      app.style.display = 'none';
    }
  });
}

function handleResize() {
  SystemState.isMobile = window.innerWidth <= 768;
}

function handleContextMenu(e) {
  // Only on desktop background
  if (!e.target.closest('.desktop-icon, .window, .taskbar')) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  }
}

function showContextMenu(x, y) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = `
    <div class="context-item" onclick="launchApp('files')">
      <i class="fas fa-folder"></i>
      <span>Open Files</span>
    </div>
    <div class="context-item" onclick="launchApp('settings')">
      <i class="fas fa-cog"></i>
      <span>Settings</span>
    </div>
    <div class="context-divider"></div>
    <div class="context-item" onclick="refreshDesktop()">
      <i class="fas fa-sync"></i>
      <span>Refresh</span>
    </div>
  `;
  
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.classList.remove('hidden');
}

function closeContextMenu() {
  const menu = document.getElementById('contextMenu');
  if (!menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
}

function refreshDesktop() {
  showNotification('Desktop refreshed');
  closeContextMenu();
}

// Export for debugging
window.Nuvola365 = {
  SystemState,
  AppRegistry,
  launchApp,
  closeWindow,
  focusWindow
};
