// ============================================
// NUVOLA365 - Cloud Applications
// Focus: Azure Virtual Desktop & Windows 365
// ============================================

const Applications = {
  
  // ==================== WINDOWS 365 CLOUD PC ====================
  'cloud-pc': {
    name: 'Windows 365',
    icon: 'fas fa-desktop',
    color: '#0078d4',
    description: 'Your Cloud PC powered by Windows 365',
    isCloudApp: true,
    url: 'https://windows365.microsoft.com',
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
  'word': {
    name: 'Word',
    icon: 'fas fa-file-word',
    color: '#2b579a',
    description: 'Microsoft Word Online',
    isCloudApp: true,
    url: 'https://www.office.com/launch/word',
    openInTab: true
  },

  'excel': {
    name: 'Excel',
    icon: 'fas fa-file-excel',
    color: '#217346',
    description: 'Microsoft Excel Online',
    isCloudApp: true,
    url: 'https://www.office.com/launch/excel',
    openInTab: true
  },

  'powerpoint': {
    name: 'PowerPoint',
    icon: 'fas fa-file-powerpoint',
    color: '#d24726',
    description: 'Microsoft PowerPoint Online',
    isCloudApp: true,
    url: 'https://www.office.com/launch/powerpoint',
    openInTab: true
  },

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
  },

  // ==================== TERMINAL ====================
  'terminal': {
    name: 'Terminal',
    icon: 'fas fa-terminal',
    color: '#89b4fa',
    description: 'Command line interface',
    render: (container, windowId) => {
      const historyKey = `terminal_history_${windowId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      container.innerHTML = `
        <div class="terminal">
          <div class="terminal-output" id="terminal-output-${windowId}">
            ${history.map(line => `<div class="terminal-line">${line}</div>`).join('')}
          </div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">cloud@nuvola365:${fs.currentPath}$</span>
            <input type="text" class="terminal-input" id="terminal-input-${windowId}" autofocus />
          </div>
        </div>
        <style>
          .terminal {
            height: 100%;
            background: var(--crust);
            padding: 20px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: var(--text);
            display: flex;
            flex-direction: column;
          }
          .terminal-output {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 12px;
          }
          .terminal-line {
            margin-bottom: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .terminal-input-line {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .terminal-prompt {
            color: var(--cloud-blue);
            flex-shrink: 0;
            font-weight: 600;
          }
          .terminal-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text);
            font-family: inherit;
            font-size: inherit;
          }
          .terminal-error {
            color: var(--error);
          }
          .terminal-success {
            color: var(--success);
          }
          .terminal-info {
            color: var(--cloud-blue);
          }
        </style>
      `;
      
      const input = container.querySelector(`#terminal-input-${windowId}`);
      const output = container.querySelector(`#terminal-output-${windowId}`);
      const commandHistory = [];
      let historyIndex = -1;
      
      const addOutput = (text, className = '') => {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        
        history.push(text);
        localStorage.setItem(historyKey, JSON.stringify(history.slice(-100)));
      };
      
      const executeCommand = (cmd) => {
        addOutput(`cloud@nuvola365:${fs.currentPath}$ ${cmd}`);
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0];
        const args = parts.slice(1);
        
        try {
          switch (command) {
            case 'cloud-connect':
              addOutput('Connecting to Azure Cloud...', 'terminal-info');
              addOutput('✓ Connected to Windows 365', 'terminal-success');
              addOutput('✓ Connected to Azure Virtual Desktop', 'terminal-success');
              addOutput('✓ OneDrive synced', 'terminal-success');
              break;
              
            case 'cloud-status':
              addOutput('Cloud Connection Status:', 'terminal-info');
              addOutput('  Windows 365: Online ✓', 'terminal-success');
              addOutput('  Azure VD: Online ✓', 'terminal-success');
              addOutput('  OneDrive: Synced ✓', 'terminal-success');
              addOutput('  Network: Connected', 'terminal-success');
              break;
              
            case 'launch':
              if (!args[0]) {
                addOutput('Usage: launch <app>', 'terminal-error');
                addOutput('Available: cloud-pc, avd, word, excel, teams');
              } else {
                addOutput(`Launching ${args[0]}...`, 'terminal-info');
                setTimeout(() => openApp(args[0]), 500);
              }
              break;
              
            case 'ls':
              const files = fs.listDirectory(args[0] || fs.currentPath);
              if (files.length === 0) {
                addOutput('(empty directory)');
              } else {
                files.forEach(f => {
                  const icon = f.type === 'directory' ? '📁' : '📄';
                  addOutput(`${icon} ${f.name}`);
                });
              }
              break;
              
            case 'cd':
              fs.changeDirectory(args[0] || '/home/guest');
              updatePrompt();
              break;
              
            case 'pwd':
              addOutput(fs.currentPath);
              break;
              
            case 'cat':
              if (!args[0]) {
                addOutput('Usage: cat <file>', 'terminal-error');
              } else {
                const content = fs.readFile(args[0]);
                addOutput(content);
              }
              break;
              
            case 'mkdir':
              if (!args[0]) {
                addOutput('Usage: mkdir <directory>', 'terminal-error');
              } else {
                fs.createDirectory(args[0]);
                addOutput(`Created: ${args[0]}`, 'terminal-success');
              }
              break;
              
            case 'touch':
              if (!args[0]) {
                addOutput('Usage: touch <file>', 'terminal-error');
              } else {
                fs.writeFile(args[0], '');
                addOutput(`Created: ${args[0]}`, 'terminal-success');
              }
              break;
              
            case 'rm':
              if (!args[0]) {
                addOutput('Usage: rm <file>', 'terminal-error');
              } else {
                fs.deleteFile(args[0]);
                addOutput(`Deleted: ${args[0]}`, 'terminal-success');
              }
              break;
              
            case 'echo':
              addOutput(args.join(' '));
              break;
              
            case 'clear':
              output.innerHTML = '';
              history.length = 0;
              localStorage.setItem(historyKey, '[]');
              break;
              
            case 'help':
              addOutput('Nuvola365 Terminal Commands:', 'terminal-info');
              addOutput('');
              addOutput('Cloud Commands:');
              addOutput('  cloud-connect   - Connect to Azure cloud services');
              addOutput('  cloud-status    - Show cloud connection status');
              addOutput('  launch <app>    - Launch cloud application');
              addOutput('');
              addOutput('File System:');
              addOutput('  ls [path]       - List directory contents');
              addOutput('  cd <path>       - Change directory');
              addOutput('  pwd             - Print working directory');
              addOutput('  cat <file>      - Display file contents');
              addOutput('  mkdir <dir>     - Create directory');
              addOutput('  touch <file>    - Create file');
              addOutput('  rm <file>       - Remove file');
              addOutput('');
              addOutput('System:');
              addOutput('  echo <text>     - Print text');
              addOutput('  clear           - Clear screen');
              addOutput('  help            - Show this help');
              break;
              
            case '':
              break;
              
            default:
              addOutput(`Command not found: ${command}`, 'terminal-error');
              addOutput('Type "help" for available commands');
          }
        } catch (error) {
          addOutput(`Error: ${error.message}`, 'terminal-error');
        }
      };
      
      const updatePrompt = () => {
        container.querySelector('.terminal-prompt').textContent = 
          `cloud@nuvola365:${fs.currentPath}$`;
      };
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value;
          input.value = '';
          if (cmd.trim()) {
            executeCommand(cmd);
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex] || '';
          } else {
            historyIndex = commandHistory.length;
            input.value = '';
          }
        }
      });
      
      addOutput('Nuvola365 Cloud Terminal');
      addOutput('Type "help" for commands, "cloud-status" for connection info');
      addOutput('');
      input.focus();
    }
  },

  // ==================== FILE MANAGER ====================
  'file-manager': {
    name: 'Files',
    icon: 'fas fa-folder',
    color: '#f9e2af',
    description: 'File manager',
    render: (container, windowId) => {
      let currentPath = '/home/guest';
      
      const render = () => {
        const files = fs.listDirectory(currentPath);
        const pathParts = currentPath.split('/').filter(p => p);
        
        container.innerHTML = `
          <div class="file-manager">
            <div class="fm-toolbar">
              <button class="fm-btn" onclick="Applications['file-manager'].goBack('${windowId}')">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="fm-path">
                <i class="fas fa-home"></i>
                ${pathParts.map((p, i) => 
                  `<span class="fm-path-sep">/</span><span class="fm-path-part">${p}</span>`
                ).join('')}
              </div>
              <button class="fm-btn" onclick="Applications['file-manager'].refresh('${windowId}')">
                <i class="fas fa-sync"></i>
              </button>
              <button class="fm-btn" onclick="Applications['file-manager'].newFolder('${windowId}')">
                <i class="fas fa-folder-plus"></i>
              </button>
            </div>
            <div class="fm-content">
              ${files.length === 0 ? '<div class="fm-empty">Empty directory</div>' : ''}
              ${files.map(f => `
                <div class="fm-item" data-path="${currentPath}/${f.name}" data-type="${f.type}">
                  <div class="fm-item-icon">
                    <i class="fas fa-${f.type === 'directory' ? 'folder' : 'file-alt'}"></i>
                  </div>
                  <div class="fm-item-name">${f.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <style>
            .file-manager {
              height: 100%;
              display: flex;
              flex-direction: column;
              background: var(--base);
            }
            .fm-toolbar {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 16px;
              background: var(--mantle);
              border-bottom: 1px solid var(--surface0);
            }
            .fm-btn {
              width: 40px;
              height: 40px;
              border: none;
              background: var(--surface0);
              color: var(--text);
              border-radius: var(--border-radius-sm);
              cursor: pointer;
              transition: all var(--transition);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .fm-btn:hover {
              background: var(--surface1);
            }
            .fm-path {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 6px;
              padding: 0 16px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.875rem;
              color: var(--subtext1);
            }
            .fm-path-sep {
              color: var(--overlay0);
            }
            .fm-content {
              flex: 1;
              overflow-y: auto;
              padding: 20px;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
              gap: 20px;
              align-content: start;
            }
            .fm-empty {
              grid-column: 1 / -1;
              text-align: center;
              padding: 60px 20px;
              color: var(--overlay1);
            }
            .fm-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              padding: 16px;
              border-radius: var(--border-radius);
              cursor: pointer;
              transition: all var(--transition);
            }
            .fm-item:hover {
              background: var(--surface0);
            }
            .fm-item-icon {
              font-size: 56px;
              color: var(--accent);
            }
            .fm-item-icon .fa-folder {
              color: var(--warning);
            }
            .fm-item-name {
              font-size: 0.875rem;
              text-align: center;
              word-break: break-word;
              font-weight: 500;
            }
          </style>
        `;
        
        container.querySelectorAll('.fm-item').forEach(item => {
          item.addEventListener('dblclick', () => {
            const path = item.dataset.path;
            const type = item.dataset.type;
            
            if (type === 'directory') {
              currentPath = path;
              render();
            } else {
              openApp('text-editor', { file: path });
            }
          });
        });
      };
      
      Applications['file-manager'].goBack = () => {
        if (currentPath !== '/') {
          currentPath = fs.getParentPath(currentPath);
          render();
        }
      };
      
      Applications['file-manager'].refresh = () => {
        render();
      };
      
      Applications['file-manager'].newFolder = () => {
        const name = prompt('Folder name:');
        if (name) {
          try {
            fs.createDirectory(`${currentPath}/${name}`);
            render();
            showNotification('Folder created', name);
          } catch (e) {
            showNotification('Error', e.message);
          }
        }
      };
      
      render();
    }
  },

  // ==================== TEXT EDITOR ====================
  'text-editor': {
    name: 'Text Editor',
    icon: 'fas fa-file-alt',
    color: '#a6e3a1',
    description: 'Edit text files',
    render: (container, windowId, options = {}) => {
      let currentFile = options.file || null;
      let content = currentFile ? fs.readFile(currentFile) : '';
      
      container.innerHTML = `
        <div class="text-editor">
          <div class="te-toolbar">
            <button class="te-btn" onclick="Applications['text-editor'].save('${windowId}')">
              <i class="fas fa-save"></i> Save
            </button>
            <div class="te-filename">${currentFile || 'Untitled'}</div>
          </div>
          <textarea class="te-content" id="te-content-${windowId}">${content}</textarea>
        </div>
        <style>
          .text-editor {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .te-toolbar {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: var(--mantle);
            border-bottom: 1px solid var(--surface0);
          }
          .te-btn {
            padding: 10px 20px;
            border: none;
            background: var(--accent);
            color: white;
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            transition: all var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 600;
          }
          .te-btn:hover {
            background: var(--accent-hover);
          }
          .te-filename {
            flex: 1;
            padding: 0 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            color: var(--subtext1);
          }
          .te-content {
            flex: 1;
            padding: 24px;
            background: var(--base);
            border: none;
            outline: none;
            color: var(--text);
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.7;
            resize: none;
          }
        </style>
      `;
      
      Applications['text-editor'].save = () => {
        const content = container.querySelector('.te-content').value;
        
        if (!currentFile) {
          const path = prompt('Save as:', '/home/guest/untitled.txt');
          if (!path) return;
          currentFile = path;
        }
        
        try {
          fs.writeFile(currentFile, content);
          container.querySelector('.te-filename').textContent = currentFile;
          showNotification('File saved', fs.getBasename(currentFile));
        } catch (e) {
          showNotification('Error', e.message);
        }
      };
    }
  },

  // ==================== SETTINGS ====================
  'settings': {
    name: 'Settings',
    icon: 'fas fa-cog',
    color: '#78909c',
    description: 'System settings',
    render: (container) => {
      container.innerHTML = `
        <div class="settings">
          <div class="settings-content">
            <h2>Cloud Settings</h2>
            <div class="setting-group">
              <h3>Connection</h3>
              <div class="setting-item">
                <label>Auto-connect to Windows 365</label>
                <input type="checkbox" checked />
              </div>
              <div class="setting-item">
                <label>Auto-connect to Azure VD</label>
                <input type="checkbox" checked />
              </div>
            </div>
            <div class="setting-group">
              <h3>Appearance</h3>
              <div class="setting-item">
                <label>Theme</label>
                <select>
                  <option>Dark (Catppuccin)</option>
                  <option>Light</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <style>
          .settings {
            height: 100%;
            overflow-y: auto;
            background: var(--base);
          }
          .settings-content {
            padding: 32px;
            max-width: 800px;
            margin: 0 auto;
          }
          .settings-content h2 {
            font-size: 1.75rem;
            margin-bottom: 32px;
          }
          .setting-group {
            background: var(--mantle);
            border: 1px solid var(--surface0);
            border-radius: var(--border-radius);
            padding: 24px;
            margin-bottom: 20px;
          }
          .setting-group h3 {
            font-size: 1.125rem;
            margin-bottom: 20px;
            color: var(--accent);
          }
          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid var(--surface0);
          }
          .setting-item:last-child {
            border-bottom: none;
          }
          .setting-item label {
            font-size: 0.9375rem;
          }
          .setting-item select {
            padding: 8px 12px;
            background: var(--surface0);
            border: 1px solid var(--surface1);
            border-radius: var(--border-radius-sm);
            color: var(--text);
            outline: none;
          }
        </style>
      `;
    }
  }
};
