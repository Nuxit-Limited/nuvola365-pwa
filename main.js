const { app, BrowserWindow, session } = require('electron');

// Your Nuvola365 website
const WEBSITE = 'https://nuvola365.com';

let mainWindow;
let popupWindows = [];

// Microsoft domains that we need to allow for auth and redirects
const MICROSOFT_DOMAINS = [
  'windows.cloud.microsoft',
  'login.microsoftonline.com',
  'login.microsoft.com',
  'login.live.com',
  'account.microsoft.com',
  'client.wvd.microsoft.com',
  'outlook.office.com',
  'teams.microsoft.com',
  'office.com',
  'onedrive.live.com',
  'onenote.com',
  'sharepoint.com'
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:nuvola365',
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    backgroundColor: '#1a1a1a',
    title: 'Nuvola365'
  });

  // Load main website
  mainWindow.loadURL(WEBSITE);

  // Handle popup windows
  mainWindow.webContents.setWindowOpenHandler(({ url, frameName }) => {
    console.log('🔗 Opening popup:', url);
    console.log('📝 Window name:', frameName || 'unnamed');
    
    createPopupWindow(url, frameName);
    
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Main window loaded successfully');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Main window failed:', errorDescription);
  });
}

function createPopupWindow(initialUrl, windowName) {
  const popupWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      partition: 'persist:nuvola365',  // Share session for Microsoft auth
      webSecurity: true
    },
    backgroundColor: '#ffffff',
    title: windowName || 'Cloud App',
    show: false  // Don't show until ready
  });

  // Show window when ready to prevent white flash
  popupWindow.once('ready-to-show', () => {
    popupWindow.show();
    console.log('👁️ Popup window shown');
  });

  // Load initial URL
  popupWindow.loadURL(initialUrl);
  
  // Track all navigation for debugging Microsoft redirects
  let navigationCount = 0;
  
  popupWindow.webContents.on('will-navigate', (event, url) => {
    navigationCount++;
    console.log(`🧭 [${navigationCount}] Navigating to:`, url);
    
    // Check if navigating to Microsoft domain
    const isMicrosoftDomain = MICROSOFT_DOMAINS.some(domain => url.includes(domain));
    if (isMicrosoftDomain) {
      console.log('   ✓ Microsoft domain - allowing');
    }
  });

  popupWindow.webContents.on('did-navigate', (event, url) => {
    console.log('📍 Navigation complete:', url);
  });

  popupWindow.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
    if (isMainFrame) {
      console.log('📄 In-page navigation:', url);
    }
  });

  popupWindow.webContents.on('did-finish-load', () => {
    const currentUrl = popupWindow.webContents.getURL();
    console.log('✅ Page loaded:', currentUrl);
    
    // Check if page is actually blank
    popupWindow.webContents.executeJavaScript('document.body.innerHTML.length').then(length => {
      if (length < 100) {
        console.warn('⚠️ WARNING: Page appears blank (HTML length:', length, ')');
        console.warn('   Current URL:', currentUrl);
        console.warn('   This might indicate a problem with Microsoft auth or content loading');
      } else {
        console.log('   ✓ Page has content (', length, 'chars)');
      }
    }).catch(err => {
      console.error('   ❌ Could not check page content:', err.message);
    });
  });

  popupWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', validatedURL);
    console.error('   Error code:', errorCode);
    console.error('   Description:', errorDescription);
  });

  // Handle any new popups from within the popup (e.g., OAuth popups)
  popupWindow.webContents.setWindowOpenHandler(({ url, frameName }) => {
    console.log('🔗 Nested popup:', url);
    createPopupWindow(url, frameName);
    return { action: 'deny' };
  });

  // Track window
  popupWindows.push(popupWindow);
  
  popupWindow.on('closed', () => {
    console.log('🗑️ Popup window closed');
    const index = popupWindows.indexOf(popupWindow);
    if (index > -1) {
      popupWindows.splice(index, 1);
    }
  });

  return popupWindow;
}

app.whenReady().then(() => {
  console.log('🚀 Nuvola365 Desktop App Starting...');
  console.log('📍 Main URL:', WEBSITE);
  console.log('🔐 Using persistent session for Microsoft auth');
  
  // Configure session for better Microsoft auth handling
  const ses = session.fromPartition('persist:nuvola365');
  
  // Allow all Microsoft cookies
  ses.cookies.flushStore().then(() => {
    console.log('🍪 Cookie store ready');
  });
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Log when app quits
app.on('will-quit', () => {
  console.log('👋 App closing...');
});

console.log('📦 Electron app initialized');
