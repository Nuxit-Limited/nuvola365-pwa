// ============================================
// NUVOLA365 DEX - Built-in Web Apps
// ============================================

// All built-in web-based applications
const BuiltInApps = {
  
  // ==================== FILE MANAGER ====================
  files: {
    name: 'Files',
    icon: 'fas fa-folder',
    color: '#FFA726',
    render: (container) => {
      const fileSystem = getFileSystem();
      
      container.innerHTML = `
        <div class="file-manager">
          <div class="fm-toolbar">
            <button class="fm-btn" onclick="BuiltInApps.files.goBack()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <button class="fm-btn" onclick="BuiltInApps.files.goUp()">
              <i class="fas fa-arrow-up"></i>
            </button>
            <div class="fm-path" id="fm-path">/</div>
            <button class="fm-btn" onclick="BuiltInApps.files.refresh()">
              <i class="fas fa-sync"></i>
            </button>
            <button class="fm-btn" onclick="BuiltInApps.files.newFolder()">
              <i class="fas fa-folder-plus"></i>
            </button>
            <button class="fm-btn" onclick="BuiltInApps.files.newFile()">
              <i class="fas fa-file-plus"></i>
            </button>
          </div>
          <div class="fm-content" id="fm-content">
            ${renderFileList(fileSystem)}
          </div>
        </div>
        <style>
          .file-manager { display: flex; flex-direction: column; height: 100%; }
          .fm-toolbar { display: flex; align-items: center; gap: 8px; padding: 12px; background: var(--dex-surface); border-bottom: 1px solid var(--dex-border); }
          .fm-btn { width: 36px; height: 36px; border: none; background: transparent; color: var(--dex-text); border-radius: 6px; cursor: pointer; transition: all 0.2s; }
          .fm-btn:hover { background: rgba(255,255,255,0.1); }
          .fm-path { flex: 1; padding: 0 12px; font-family: monospace; font-size: 0.875rem; color: var(--dex-text-dim); }
          .fm-content { flex: 1; overflow-y: auto; padding: 16px; }
          .fm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px; }
          .fm-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
          .fm-item:hover { background: rgba(255,255,255,0.05); }
          .fm-item i { font-size: 40px; color: var(--dex-accent); }
          .fm-item.folder i { color: #FFA726; }
          .fm-item span { font-size: 0.875rem; text-align: center; word-break: break-word; }
        </style>
      `;
    },
    currentPath: '/',
    goBack: () => {},
    goUp: () => {},
    refresh: () => {},
    newFolder: () => { alert('New folder created (demo)'); },
    newFile: () => { alert('New file created (demo)'); }
  },

  // ==================== NOTEPAD ====================
  notepad: {
    name: 'Notes',
    icon: 'fas fa-file-alt',
    color: '#66BB6A',
    render: (container) => {
      const savedNotes = localStorage.getItem('nuvola_notes') || '';
      
      container.innerHTML = `
        <div class="notepad">
          <div class="notepad-toolbar">
            <button class="np-btn" onclick="BuiltInApps.notepad.newNote()">
              <i class="fas fa-file"></i> New
            </button>
            <button class="np-btn" onclick="BuiltInApps.notepad.save()">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="np-btn" onclick="BuiltInApps.notepad.exportTxt()">
              <i class="fas fa-download"></i> Export
            </button>
            <div style="flex: 1;"></div>
            <select class="np-font-size" id="np-font-size">
              <option value="12">12px</option>
              <option value="14" selected>14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
            </select>
          </div>
          <textarea class="notepad-editor" id="notepad-editor" placeholder="Start typing...">${savedNotes}</textarea>
        </div>
        <style>
          .notepad { display: flex; flex-direction: column; height: 100%; }
          .notepad-toolbar { display: flex; align-items: center; gap: 8px; padding: 12px; background: var(--dex-surface); border-bottom: 1px solid var(--dex-border); }
          .np-btn { padding: 8px 16px; border: none; background: transparent; color: var(--dex-text); border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 6px; font-size: 0.875rem; }
          .np-btn:hover { background: rgba(255,255,255,0.1); }
          .np-font-size { padding: 6px 12px; background: var(--dex-elevated); border: 1px solid var(--dex-border); border-radius: 6px; color: var(--dex-text); outline: none; }
          .notepad-editor { flex: 1; padding: 20px; background: var(--dex-bg); border: none; outline: none; color: var(--dex-text); font-family: 'Courier New', monospace; font-size: 14px; resize: none; }
        </style>
      `;
      
      const editor = container.querySelector('#notepad-editor');
      const fontSize = container.querySelector('#np-font-size');
      fontSize.onchange = (e) => {
        editor.style.fontSize = e.target.value + 'px';
      };
    },
    newNote: () => {
      if (confirm('Create new note? Unsaved changes will be lost.')) {
        document.querySelector('#notepad-editor').value = '';
      }
    },
    save: () => {
      const content = document.querySelector('#notepad-editor')?.value || '';
      localStorage.setItem('nuvola_notes', content);
      showNotification('Note saved!');
    },
    exportTxt: () => {
      const content = document.querySelector('#notepad-editor')?.value || '';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note.txt';
      a.click();
      showNotification('Note exported!');
    }
  },

  // ==================== CALCULATOR ====================
  calculator: {
    name: 'Calculator',
    icon: 'fas fa-calculator',
    color: '#42A5F5',
    render: (container) => {
      container.innerHTML = `
        <div class="calculator">
          <div class="calc-display" id="calc-display">0</div>
          <div class="calc-buttons">
            <button class="calc-btn func" onclick="BuiltInApps.calculator.clear()">C</button>
            <button class="calc-btn func" onclick="BuiltInApps.calculator.backspace()">⌫</button>
            <button class="calc-btn func" onclick="BuiltInApps.calculator.percent()">%</button>
            <button class="calc-btn op" onclick="BuiltInApps.calculator.input('/')">÷</button>
            
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('7')">7</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('8')">8</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('9')">9</button>
            <button class="calc-btn op" onclick="BuiltInApps.calculator.input('*')">×</button>
            
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('4')">4</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('5')">5</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('6')">6</button>
            <button class="calc-btn op" onclick="BuiltInApps.calculator.input('-')">−</button>
            
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('1')">1</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('2')">2</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('3')">3</button>
            <button class="calc-btn op" onclick="BuiltInApps.calculator.input('+')">+</button>
            
            <button class="calc-btn zero" onclick="BuiltInApps.calculator.input('0')">0</button>
            <button class="calc-btn" onclick="BuiltInApps.calculator.input('.')">.</button>
            <button class="calc-btn eq" onclick="BuiltInApps.calculator.equals()">=</button>
          </div>
        </div>
        <style>
          .calculator { display: flex; flex-direction: column; padding: 20px; gap: 16px; background: var(--dex-bg); height: 100%; }
          .calc-display { background: var(--dex-surface); border: 1px solid var(--dex-border); border-radius: 12px; padding: 24px 20px; text-align: right; font-size: 2.5rem; font-variant-numeric: tabular-nums; min-height: 80px; display: flex; align-items: center; justify-content: flex-end; }
          .calc-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
          .calc-btn { padding: 20px; border: none; background: var(--dex-surface); color: var(--dex-text); border-radius: 12px; font-size: 1.25rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1px solid var(--dex-border); }
          .calc-btn:hover { background: var(--dex-elevated); transform: translateY(-2px); }
          .calc-btn:active { transform: translateY(0); }
          .calc-btn.func { background: var(--dex-elevated); }
          .calc-btn.op { background: var(--dex-accent); color: white; }
          .calc-btn.eq { background: #66BB6A; color: white; }
          .calc-btn.zero { grid-column: span 2; }
        </style>
      `;
    },
    currentExpression: '',
    input: function(val) {
      const display = document.querySelector('#calc-display');
      if (this.currentExpression === '0') this.currentExpression = '';
      this.currentExpression += val;
      display.textContent = this.currentExpression || '0';
    },
    clear: function() {
      this.currentExpression = '';
      document.querySelector('#calc-display').textContent = '0';
    },
    backspace: function() {
      this.currentExpression = this.currentExpression.slice(0, -1);
      document.querySelector('#calc-display').textContent = this.currentExpression || '0';
    },
    percent: function() {
      try {
        const result = eval(this.currentExpression) / 100;
        this.currentExpression = result.toString();
        document.querySelector('#calc-display').textContent = result;
      } catch(e) {}
    },
    equals: function() {
      try {
        const result = eval(this.currentExpression);
        this.currentExpression = result.toString();
        document.querySelector('#calc-display').textContent = result;
      } catch(e) {
        document.querySelector('#calc-display').textContent = 'Error';
      }
    }
  },

  // ==================== CALENDAR ====================
  calendar: {
    name: 'Calendar',
    icon: 'fas fa-calendar',
    color: '#EF5350',
    render: (container) => {
      const now = new Date();
      const month = now.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      container.innerHTML = `
        <div class="calendar-app">
          <div class="cal-header">
            <button class="cal-nav" onclick="BuiltInApps.calendar.prevMonth()">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h2>${month}</h2>
            <button class="cal-nav" onclick="BuiltInApps.calendar.nextMonth()">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="cal-grid">
            <div class="cal-day-header">Sun</div>
            <div class="cal-day-header">Mon</div>
            <div class="cal-day-header">Tue</div>
            <div class="cal-day-header">Wed</div>
            <div class="cal-day-header">Thu</div>
            <div class="cal-day-header">Fri</div>
            <div class="cal-day-header">Sat</div>
            ${this.generateDays(now)}
          </div>
        </div>
        <style>
          .calendar-app { padding: 20px; height: 100%; background: var(--dex-bg); }
          .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
          .cal-header h2 { font-size: 1.5rem; }
          .cal-nav { width: 36px; height: 36px; border: none; background: var(--dex-surface); color: var(--dex-text); border-radius: 8px; cursor: pointer; }
          .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
          .cal-day-header { text-align: center; font-weight: 600; color: var(--dex-text-dim); padding: 12px; font-size: 0.875rem; }
          .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: var(--dex-surface); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
          .cal-day:hover { background: var(--dex-elevated); }
          .cal-day.today { background: var(--dex-accent); color: white; font-weight: 600; }
          .cal-day.other-month { opacity: 0.3; }
        </style>
      `;
    },
    generateDays: (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date().getDate();
      
      let html = '';
      for (let i = 0; i < firstDay; i++) {
        html += '<div class="cal-day other-month"></div>';
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today && month === new Date().getMonth();
        html += `<div class="cal-day ${isToday ? 'today' : ''}">${day}</div>`;
      }
      return html;
    },
    prevMonth: () => { showNotification('Previous month (demo)'); },
    nextMonth: () => { showNotification('Next month (demo)'); }
  },

  // ==================== BROWSER ====================
  browser: {
    name: 'Browser',
    icon: 'fas fa-globe',
    color: '#5C6BC0',
    render: (container) => {
      container.innerHTML = `
        <div class="browser-app">
          <div class="browser-toolbar">
            <button class="br-btn" onclick="BuiltInApps.browser.back()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <button class="br-btn" onclick="BuiltInApps.browser.forward()">
              <i class="fas fa-arrow-right"></i>
            </button>
            <button class="br-btn" onclick="BuiltInApps.browser.refresh()">
              <i class="fas fa-sync"></i>
            </button>
            <div class="browser-address">
              <i class="fas fa-lock"></i>
              <input type="text" id="browser-url" placeholder="Enter URL..." value="https://example.com" />
              <button class="br-go" onclick="BuiltInApps.browser.navigate()">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <iframe id="browser-frame" src="about:blank" sandbox="allow-same-origin allow-scripts"></iframe>
        </div>
        <style>
          .browser-app { display: flex; flex-direction: column; height: 100%; }
          .browser-toolbar { display: flex; align-items: center; gap: 8px; padding: 12px; background: var(--dex-surface); border-bottom: 1px solid var(--dex-border); }
          .br-btn { width: 36px; height: 36px; border: none; background: transparent; color: var(--dex-text); border-radius: 6px; cursor: pointer; }
          .br-btn:hover { background: rgba(255,255,255,0.1); }
          .browser-address { flex: 1; display: flex; align-items: center; gap: 8px; padding: 0 12px; background: var(--dex-bg); border: 1px solid var(--dex-border); border-radius: 20px; }
          .browser-address i { color: #66BB6A; }
          .browser-address input { flex: 1; background: transparent; border: none; outline: none; color: var(--dex-text); }
          .br-go { width: 32px; height: 32px; border: none; background: var(--dex-accent); color: white; border-radius: 50%; cursor: pointer; }
          #browser-frame { flex: 1; border: none; background: white; }
        </style>
      `;
    },
    navigate: () => {
      const url = document.querySelector('#browser-url').value;
      const frame = document.querySelector('#browser-frame');
      try {
        frame.src = url;
      } catch(e) {
        showNotification('Cannot load URL (security restrictions)');
      }
    },
    back: () => { showNotification('Back (demo)'); },
    forward: () => { showNotification('Forward (demo)'); },
    refresh: () => { 
      const frame = document.querySelector('#browser-frame');
      frame.src = frame.src;
    }
  },

  // ==================== SETTINGS ====================
  settings: {
    name: 'Settings',
    icon: 'fas fa-cog',
    color: '#78909C',
    render: (container) => {
      container.innerHTML = `
        <div class="settings-app">
          <div class="settings-sidebar">
            <div class="settings-section active">
              <i class="fas fa-palette"></i> Appearance
            </div>
            <div class="settings-section">
              <i class="fas fa-bell"></i> Notifications
            </div>
            <div class="settings-section">
              <i class="fas fa-user"></i> Account
            </div>
            <div class="settings-section">
              <i class="fas fa-shield-alt"></i> Privacy
            </div>
            <div class="settings-section">
              <i class="fas fa-info-circle"></i> About
            </div>
          </div>
          <div class="settings-content">
            <h2>Appearance</h2>
            <div class="setting-item">
              <div>
                <h3>Theme</h3>
                <p>Choose your preferred color scheme</p>
              </div>
              <select class="setting-select">
                <option>Dark (default)</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            <div class="setting-item">
              <div>
                <h3>Accent Color</h3>
                <p>Customize the accent color</p>
              </div>
              <input type="color" value="#2196f3" class="setting-color" />
            </div>
            <div class="setting-item">
              <div>
                <h3>Transparency</h3>
                <p>Enable blur and transparency effects</p>
              </div>
              <label class="toggle">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <style>
          .settings-app { display: flex; height: 100%; }
          .settings-sidebar { width: 240px; background: var(--dex-surface); border-right: 1px solid var(--dex-border); padding: 16px; }
          .settings-section { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; cursor: pointer; margin-bottom: 4px; transition: all 0.2s; }
          .settings-section:hover { background: rgba(255,255,255,0.05); }
          .settings-section.active { background: var(--dex-accent); color: white; }
          .settings-content { flex: 1; padding: 32px; overflow-y: auto; background: var(--dex-bg); }
          .settings-content h2 { margin-bottom: 24px; }
          .setting-item { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: var(--dex-surface); border: 1px solid var(--dex-border); border-radius: 12px; margin-bottom: 16px; }
          .setting-item h3 { font-size: 1rem; margin-bottom: 4px; }
          .setting-item p { font-size: 0.875rem; color: var(--dex-text-dim); }
          .setting-select { padding: 8px 16px; background: var(--dex-elevated); border: 1px solid var(--dex-border); border-radius: 8px; color: var(--dex-text); }
          .setting-color { width: 60px; height: 40px; border: none; border-radius: 8px; cursor: pointer; }
          .toggle { position: relative; width: 48px; height: 24px; }
          .toggle input { opacity: 0; width: 0; height: 0; }
          .toggle-slider { position: absolute; inset: 0; background: #555; border-radius: 24px; cursor: pointer; transition: 0.3s; }
          .toggle input:checked + .toggle-slider { background: var(--dex-accent); }
          .toggle-slider:before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
          .toggle input:checked + .toggle-slider:before { transform: translateX(24px); }
        </style>
      `;
    }
  },

  // ==================== PHOTOS ====================
  photos: {
    name: 'Photos',
    icon: 'fas fa-images',
    color: '#AB47BC',
    render: (container) => {
      container.innerHTML = `
        <div class="photos-app">
          <div class="photos-empty">
            <i class="fas fa-images"></i>
            <h3>No Photos</h3>
            <p>Your photo library is empty</p>
            <button class="photos-import">
              <i class="fas fa-upload"></i> Import Photos
            </button>
          </div>
        </div>
        <style>
          .photos-app { height: 100%; display: flex; align-items: center; justify-content: center; background: var(--dex-bg); }
          .photos-empty { text-align: center; }
          .photos-empty i { font-size: 80px; color: var(--dex-accent); opacity: 0.5; margin-bottom: 20px; }
          .photos-empty h3 { font-size: 1.5rem; margin-bottom: 8px; }
          .photos-empty p { color: var(--dex-text-dim); margin-bottom: 24px; }
          .photos-import { padding: 12px 24px; background: var(--dex-accent); border: none; border-radius: 8px; color: white; cursor: pointer; }
        </style>
      `;
    }
  },

  // ==================== MUSIC ====================
  music: {
    name: 'Music',
    icon: 'fas fa-music',
    color: '#EC407A',
    render: (container) => {
      container.innerHTML = `
        <div class="music-app">
          <div class="music-player">
            <div class="album-art">
              <i class="fas fa-music"></i>
            </div>
            <h3>No Music Playing</h3>
            <p>Add music to your library to start listening</p>
            <div class="player-controls">
              <button class="player-btn"><i class="fas fa-step-backward"></i></button>
              <button class="player-btn play"><i class="fas fa-play"></i></button>
              <button class="player-btn"><i class="fas fa-step-forward"></i></button>
            </div>
            <div class="player-progress">
              <span>0:00</span>
              <input type="range" min="0" max="100" value="0" />
              <span>0:00</span>
            </div>
          </div>
        </div>
        <style>
          .music-app { height: 100%; display: flex; align-items: center; justify-content: center; background: var(--dex-bg); }
          .music-player { text-align: center; max-width: 400px; }
          .album-art { width: 200px; height: 200px; background: var(--dex-surface); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; font-size: 80px; color: var(--dex-accent); }
          .music-player h3 { margin-bottom: 8px; }
          .music-player p { color: var(--dex-text-dim); margin-bottom: 32px; }
          .player-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
          .player-btn { width: 48px; height: 48px; border: none; background: var(--dex-surface); color: var(--dex-text); border-radius: 50%; cursor: pointer; }
          .player-btn.play { width: 64px; height: 64px; background: var(--dex-accent); color: white; font-size: 20px; }
          .player-progress { display: flex; align-items: center; gap: 12px; }
          .player-progress span { font-size: 0.875rem; color: var(--dex-text-dim); }
          .player-progress input { flex: 1; }
        </style>
      `;
    }
  }
};

// Helper function for file system (simulated)
function getFileSystem() {
  return {
    'Documents': { type: 'folder', children: {
      'Resume.pdf': { type: 'file', size: '245 KB' },
      'Notes.txt': { type: 'file', size: '12 KB' }
    }},
    'Pictures': { type: 'folder', children: {} },
    'Downloads': { type: 'folder', children: {} }
  };
}

function renderFileList(fs) {
  let html = '<div class="fm-grid">';
  for (let [name, item] of Object.entries(fs)) {
    const icon = item.type === 'folder' ? 'fa-folder' : 'fa-file';
    html += `
      <div class="fm-item ${item.type}">
        <i class="fas ${icon}"></i>
        <span>${name}</span>
      </div>
    `;
  }
  html += '</div>';
  return html;
}

function showNotification(message) {
  // Add notification to panel
  const notifList = document.querySelector('#notifList');
  if (notifList) {
    const empty = notifList.querySelector('.notif-empty');
    if (empty) empty.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notif-item';
    notif.innerHTML = `
      <div style="display: flex; align-items: start; gap: 12px;">
        <i class="fas fa-info-circle" style="color: var(--dex-accent); margin-top: 2px;"></i>
        <div style="flex: 1;">
          <div style="font-weight: 500; margin-bottom: 4px;">System</div>
          <div style="font-size: 0.875rem; color: var(--dex-text-dim);">${message}</div>
          <div style="font-size: 0.75rem; color: var(--dex-text-dim); margin-top: 4px;">Just now</div>
        </div>
      </div>
    `;
    notifList.insertBefore(notif, notifList.firstChild);
    
    // Update badge
    const badge = document.querySelector('#notifBadge');
    if (badge) {
      const count = notifList.querySelectorAll('.notif-item').length;
      badge.textContent = count;
      badge.classList.remove('hidden');
    }
  }
}
