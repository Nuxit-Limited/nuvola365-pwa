// ============================================
// NUVOLA OS - Applications
// ============================================

const Applications = {
  
  // ==================== TERMINAL ====================
  'terminal': {
    name: 'Terminal',
    icon: 'fas fa-terminal',
    color: '#89b4fa',
    render: (container, windowId) => {
      const historyKey = `terminal_history_${windowId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      container.innerHTML = `
        <div class="terminal">
          <div class="terminal-output" id="terminal-output-${windowId}">
            ${history.map(line => `<div class="terminal-line">${line}</div>`).join('')}
          </div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">guest@nuvola:${fs.currentPath}$</span>
            <input type="text" class="terminal-input" id="terminal-input-${windowId}" autofocus />
          </div>
        </div>
        <style>
          .terminal {
            height: 100%;
            background: var(--crust);
            padding: 16px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: var(--text);
            display: flex;
            flex-direction: column;
          }
          .terminal-output {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 8px;
          }
          .terminal-line {
            margin-bottom: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .terminal-input-line {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .terminal-prompt {
            color: var(--green);
            flex-shrink: 0;
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
            color: var(--red);
          }
          .terminal-success {
            color: var(--green);
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
        addOutput(`guest@nuvola:${fs.currentPath}$ ${cmd}`);
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        
        const parts = cmd.trim().split(/\s+/);
        const command = parts[0];
        const args = parts.slice(1);
        
        try {
          switch (command) {
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
              const newPath = args[0] || '/home/guest';
              fs.changeDirectory(newPath);
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
                addOutput(`Created directory: ${args[0]}`, 'terminal-success');
              }
              break;
              
            case 'touch':
              if (!args[0]) {
                addOutput('Usage: touch <file>', 'terminal-error');
              } else {
                fs.writeFile(args[0], '');
                addOutput(`Created file: ${args[0]}`, 'terminal-success');
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
              
            case 'rmdir':
              if (!args[0]) {
                addOutput('Usage: rmdir <directory>', 'terminal-error');
              } else {
                fs.deleteDirectory(args[0]);
                addOutput(`Deleted directory: ${args[0]}`, 'terminal-success');
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
              addOutput('Available commands:');
              addOutput('  ls [path]       - List directory contents');
              addOutput('  cd <path>       - Change directory');
              addOutput('  pwd             - Print working directory');
              addOutput('  cat <file>      - Display file contents');
              addOutput('  mkdir <dir>     - Create directory');
              addOutput('  touch <file>    - Create empty file');
              addOutput('  rm <file>       - Remove file');
              addOutput('  rmdir <dir>     - Remove empty directory');
              addOutput('  echo <text>     - Print text');
              addOutput('  clear           - Clear screen');
              addOutput('  neofetch        - System information');
              addOutput('  help            - Show this help');
              break;
              
            case 'neofetch':
              addOutput('         ___');
              addOutput('        (.. |        guest@nuvola');
              addOutput('        (<> |        -------------');
              addOutput('       / __  \\       OS: Nuvola OS 1.0.0');
              addOutput('      ( /  \\ /|      Shell: NuvolaShell');
              addOutput('     _/\\ __)/_)      Terminal: Web Terminal');
              addOutput('     \\/-____\\/       CPU: JavaScript Engine');
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
          `guest@nuvola:${fs.currentPath}$`;
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
      
      addOutput('Nuvola OS Terminal - Type "help" for commands');
      input.focus();
    }
  },

  // ==================== FILE MANAGER ====================
  'file-manager': {
    name: 'Files',
    icon: 'fas fa-folder',
    color: '#f9e2af',
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
              <button class="fm-btn" onclick="Applications['file-manager'].goUp('${windowId}')">
                <i class="fas fa-arrow-up"></i>
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
              <button class="fm-btn" onclick="Applications['file-manager'].newFile('${windowId}')">
                <i class="fas fa-file-plus"></i>
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
                  <div class="fm-item-size">${f.type === 'file' ? f.size + ' B' : ''}</div>
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
              gap: 8px;
              padding: 12px;
              background: var(--mantle);
              border-bottom: 1px solid var(--surface0);
            }
            .fm-btn {
              width: 36px;
              height: 36px;
              border: none;
              background: var(--surface0);
              color: var(--text);
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s;
            }
            .fm-btn:hover {
              background: var(--surface1);
            }
            .fm-path {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 0 12px;
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
              padding: 16px;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
              gap: 16px;
              align-content: start;
            }
            .fm-empty {
              grid-column: 1 / -1;
              text-align: center;
              padding: 40px;
              color: var(--overlay1);
            }
            .fm-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              padding: 12px;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s;
            }
            .fm-item:hover {
              background: var(--surface0);
            }
            .fm-item-icon {
              font-size: 48px;
              color: var(--accent);
            }
            .fm-item-icon .fa-folder {
              color: var(--yellow);
            }
            .fm-item-name {
              font-size: 0.875rem;
              text-align: center;
              word-break: break-word;
            }
            .fm-item-size {
              font-size: 0.75rem;
              color: var(--overlay1);
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
              // Open file in text editor
              openApp('text-editor', { file: path });
            }
          });
        });
      };
      
      // Store methods for toolbar buttons
      Applications['file-manager'].goBack = (id) => {
        if (currentPath !== '/') {
          currentPath = fs.getParentPath(currentPath);
          render();
        }
      };
      
      Applications['file-manager'].goUp = (id) => {
        if (currentPath !== '/') {
          currentPath = fs.getParentPath(currentPath);
          render();
        }
      };
      
      Applications['file-manager'].refresh = (id) => {
        render();
      };
      
      Applications['file-manager'].newFolder = (id) => {
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
      
      Applications['file-manager'].newFile = (id) => {
        const name = prompt('File name:');
        if (name) {
          try {
            fs.writeFile(`${currentPath}/${name}`, '');
            render();
            showNotification('File created', name);
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
    render: (container, windowId, options = {}) => {
      let currentFile = options.file || null;
      let content = currentFile ? fs.readFile(currentFile) : '';
      
      container.innerHTML = `
        <div class="text-editor">
          <div class="te-toolbar">
            <button class="te-btn" onclick="Applications['text-editor'].newFile('${windowId}')">
              <i class="fas fa-file"></i> New
            </button>
            <button class="te-btn" onclick="Applications['text-editor'].open('${windowId}')">
              <i class="fas fa-folder-open"></i> Open
            </button>
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
            gap: 8px;
            padding: 12px;
            background: var(--mantle);
            border-bottom: 1px solid var(--surface0);
          }
          .te-btn {
            padding: 8px 16px;
            border: none;
            background: var(--surface0);
            color: var(--text);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.875rem;
          }
          .te-btn:hover {
            background: var(--surface1);
          }
          .te-filename {
            flex: 1;
            padding: 0 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            color: var(--subtext1);
          }
          .te-content {
            flex: 1;
            padding: 20px;
            background: var(--base);
            border: none;
            outline: none;
            color: var(--text);
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.6;
            resize: none;
          }
        </style>
      `;
      
      Applications['text-editor'].newFile = (id) => {
        if (confirm('Create new file? Unsaved changes will be lost.')) {
          currentFile = null;
          container.querySelector('.te-content').value = '';
          container.querySelector('.te-filename').textContent = 'Untitled';
        }
      };
      
      Applications['text-editor'].open = (id) => {
        const path = prompt('File path:', '/home/guest/Documents/welcome.txt');
        if (path) {
          try {
            content = fs.readFile(path);
            currentFile = path;
            container.querySelector('.te-content').value = content;
            container.querySelector('.te-filename').textContent = currentFile;
            showNotification('File opened', fs.getBasename(path));
          } catch (e) {
            showNotification('Error', e.message);
          }
        }
      };
      
      Applications['text-editor'].save = (id) => {
        const content = container.querySelector('.te-content').value;
        
        if (!currentFile) {
          const path = prompt('Save as:', '/home/guest/Documents/untitled.txt');
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

  // ==================== BROWSER ====================
  'browser': {
    name: 'Browser',
    icon: 'fas fa-globe',
    color: '#74c7ec',
    render: (container) => {
      container.innerHTML = `
        <div class="browser">
          <div class="browser-toolbar">
            <button class="browser-btn"><i class="fas fa-arrow-left"></i></button>
            <button class="browser-btn"><i class="fas fa-arrow-right"></i></button>
            <button class="browser-btn"><i class="fas fa-sync"></i></button>
            <div class="browser-address">
              <i class="fas fa-lock"></i>
              <input type="text" value="https://example.com" placeholder="Enter URL..." />
            </div>
          </div>
          <iframe src="about:blank" class="browser-frame"></iframe>
        </div>
        <style>
          .browser { height: 100%; display: flex; flex-direction: column; }
          .browser-toolbar { display: flex; gap: 8px; padding: 12px; background: var(--mantle); border-bottom: 1px solid var(--surface0); }
          .browser-btn { width: 36px; height: 36px; border: none; background: var(--surface0); color: var(--text); border-radius: 8px; cursor: pointer; }
          .browser-address { flex: 1; display: flex; align-items: center; gap: 8px; padding: 0 12px; background: var(--surface0); border-radius: 8px; }
          .browser-address input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); }
          .browser-frame { flex: 1; border: none; background: white; }
        </style>
      `;
    }
  },

  // Cloud Apps (abbreviated for space)
  'cloud-pc': {
    name: 'Cloud PC',
    icon: 'fas fa-desktop',
    color: '#0078d4',
    isCloud: true,
    url: 'https://windows365.microsoft.com'
  },
  'word': {
    name: 'Word',
    icon: 'fas fa-file-word',
    color: '#2b579a',
    isCloud: true,
    url: 'https://www.office.com/launch/word'
  },
  'excel': {
    name: 'Excel',
    icon: 'fas fa-file-excel',
    color: '#217346',
    isCloud: true,
    url: 'https://www.office.com/launch/excel'
  },
  'teams': {
    name: 'Teams',
    icon: 'fas fa-users',
    color: '#6264a7',
    isCloud: true,
    url: 'https://teams.microsoft.com'
  }
};
