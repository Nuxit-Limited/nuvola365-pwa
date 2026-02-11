// ============================================
// NUVOLA365 - System Orchestration
// Cloud Desktop for AVD & Windows 365
// ============================================

const System = {
  windows: new Map(),
  windowZIndex: 1000,
  activeWindow: null,
  isDragging: false,
  dragWindow: null,
  dragOffset: { x: 0, y: 0 },
  cloudConnected: true
};

// Boot & Login
document.addEventListener('DOMContentLoaded', () => {
  bootSystem();
});

function bootSystem() {
  setTimeout(() => {
    document.getElementById('bootScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
  }, 3500);
}

document.getElementById('loginBtn')?.addEventListener('click', login);

function login() {
  document.getElementById('loginScreen').classList.add('hidden');
  const desktop = document.getElementById('desktop');
  desktop.classList.remove('hidden');
  desktop.style.opacity = '0';
  setTimeout(() => {
    desktop.style.transition = 'opacity 0.5s ease';
    desktop.style.opacity = '1';
  }, 50);
  
  setTimeout(() => {
    showNotification('Connected to Microsoft Cloud', 'Windows 365 and Azure VD ready');
  }, 1000);
  
  initializeDesktop();
}

function logout() {
  if (confirm('Sign out from Microsoft Cloud?')) {
    location.reload();
  }
}

function lockScreen() {
  document.getElementById('desktop').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}

// Desktop Initialization
function initializeDesktop() {
  updateClock();
  setInterval(updateClock, 1000);
  
  // Desktop icons
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      openApp(icon.dataset.app);
    });
  });
  
  // Dock apps
  document.querySelectorAll('.dock-app[data-app]').forEach(btn => {
    btn.addEventListener('click', () => {
      openApp(btn.dataset.app);
    });
  });
  
  // App tiles
  document.querySelectorAll('.app-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      openApp(tile.dataset.app);
      closeActivitiesOverview();
    });
  });
  
  // Activities
  document.getElementById('activitiesBtn')?.addEventListener('click', toggleActivitiesOverview);
  document.getElementById('activitiesClose')?.addEventListener('click', closeActivitiesOverview);
  
  // Menus
  document.getElementById('userMenuBtn')?.addEventListener('click', toggleSystemMenu);
  document.getElementById('cloudConnBtn')?.addEventListener('click', toggleCloudPanel);
  
  // Close menus on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#systemMenu') && !e.target.closest('#userMenuBtn')) {
      document.getElementById('systemMenu')?.classList.add('hidden');
    }
    if (!e.target.closest('#cloudPanel') && !e.target.closest('#cloudConnBtn')) {
      document.getElementById('cloudPanel')?.classList.add('hidden');
    }
  });
  
  // Window management
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  
  // Context menu
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', () => {
    document.getElementById('contextMenu')?.classList.add('hidden');
  });
  
  // Activities search
  document.getElementById('activitiesSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.app-tile').forEach(tile => {
      const name = tile.querySelector('span').textContent.toLowerCase();
      tile.style.display = name.includes(query) ? 'flex' : 'none';
    });
  });
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeActivitiesOverview();
    }
  });
}

// Clock
function updateClock() {
  const now = new Date();
  const clock = document.getElementById('topBarClock');
  
  if (clock) {
    const dateEl = clock.querySelector('.clock-date');
    const timeEl = clock.querySelector('.clock-time');
    
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  }
}

// App Management
function openApp(appId, options = {}) {
  const app = Applications[appId];
  if (!app) {
    console.error('App not found:', appId);
    return;
  }
  
  // Cloud apps open in new tabs
  if (app.isCloudApp && app.openInTab) {
    const width = 1400;
    const height = 900;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
      app.url,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes`
    );
    
    showNotification(app.name, `Opening ${app.description}...`);
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
  const height = 650;
  const left = (window.innerWidth - width) / 2 + (System.windows.size * 30);
  const top = 120 + (System.windows.size * 30);
  
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
        <button class="window-btn minimize"></button>
        <button class="window-btn maximize"></button>
        <button class="window-btn close"></button>
      </div>
    </div>
    <div class="window-content"></div>
  `;
  
  document.getElementById('windowsContainer').appendChild(windowEl);
  
  // Render app
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
  
  addToTopBar(appId, app);
  updateDock();
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
  
  updateTopBar();
}

function minimizeWindow(appId) {
  const win = System.windows.get(appId);
  if (win) {
    win.element.classList.add('minimized');
    win.isMinimized = true;
    updateTopBar();
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
    removeFromTopBar(appId);
    updateDock();
  }
}

// Window Dragging
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
  const y = Math.max(36, e.clientY - System.dragOffset.y);
  
  win.element.style.left = `${x}px`;
  win.element.style.top = `${y}px`;
}

function stopDragging() {
  System.isDragging = false;
  System.dragWindow = null;
}

// Top Bar
function addToTopBar(appId, app) {
  const topBarApps = document.getElementById('topBarApps');
  
  const btn = document.createElement('button');
  btn.className = 'top-bar-app';
  btn.id = `top-bar-${appId}`;
  btn.innerHTML = `<i class="${app.icon}"></i><span>${app.name}</span>`;
  btn.addEventListener('click', () => {
    const win = System.windows.get(appId);
    if (win?.isMinimized || System.activeWindow !== appId) {
      focusWindow(appId);
    } else {
      minimizeWindow(appId);
    }
  });
  
  topBarApps.appendChild(btn);
  updateTopBar();
}

function removeFromTopBar(appId) {
  document.getElementById(`top-bar-${appId}`)?.remove();
}

function updateTopBar() {
  document.querySelectorAll('.top-bar-app').forEach(btn => {
    const appId = btn.id.replace('top-bar-', '');
    const win = System.windows.get(appId);
    btn.classList.toggle('active', win && !win.isMinimized && System.activeWindow === appId);
  });
}

// Dock
function updateDock() {
  document.querySelectorAll('.dock-app[data-app]').forEach(btn => {
    const appId = btn.dataset.app;
    btn.classList.toggle('active', System.windows.has(appId));
  });
}

// Activities
function toggleActivitiesOverview() {
  const overview = document.getElementById('activitiesOverview');
  const btn = document.getElementById('activitiesBtn');
  
  overview.classList.toggle('hidden');
  btn.classList.toggle('active');
  
  if (!overview.classList.contains('hidden')) {
    document.getElementById('activitiesSearch')?.focus();
  }
}

function closeActivitiesOverview() {
  document.getElementById('activitiesOverview')?.classList.add('hidden');
  document.getElementById('activitiesBtn')?.classList.remove('active');
}

// Menus
function toggleSystemMenu() {
  const menu = document.getElementById('systemMenu');
  menu.classList.toggle('hidden');
}

function toggleCloudPanel() {
  const panel = document.getElementById('cloudPanel');
  panel.classList.toggle('hidden');
}

function closeCloudPanel() {
  document.getElementById('cloudPanel')?.classList.add('hidden');
}

// Context Menu
function handleContextMenu(e) {
  if (e.target.closest('.window, .top-bar, .dock')) return;
  
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY);
}

function showContextMenu(x, y) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = `
    <div class="context-item" onclick="openApp('cloud-pc'); closeContextMenu()">
      <i class="fas fa-desktop"></i>
      <span>Open Windows 365</span>
    </div>
    <div class="context-item" onclick="openApp('avd'); closeContextMenu()">
      <i class="fas fa-cloud"></i>
      <span>Open Azure VD</span>
    </div>
    <div class="context-item" onclick="openApp('terminal'); closeContextMenu()">
      <i class="fas fa-terminal"></i>
      <span>Open Terminal</span>
    </div>
    <div class="context-item" onclick="openApp('settings'); closeContextMenu()">
      <i class="fas fa-cog"></i>
      <span>Settings</span>
    </div>
  `;
  
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.classList.remove('hidden');
}

function closeContextMenu() {
  document.getElementById('contextMenu')?.classList.add('hidden');
}

// Notifications
function showNotification(title, body = '') {
  const container = document.getElementById('notificationContainer');
  
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `
    <div class="notification-title">${title}</div>
    ${body ? `<div class="notification-body">${body}</div>` : ''}
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
    notif.style.transition = 'all 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('SW registration failed:', err);
  });
}

// Global exports
window.openApp = openApp;
window.logout = logout;
window.lockScreen = lockScreen;
window.closeCloudPanel = closeCloudPanel;
