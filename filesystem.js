// ============================================
// NUVOLA OS - Virtual File System
// ============================================

class FileSystem {
  constructor() {
    this.root = this.loadFromStorage() || this.createDefaultFileSystem();
    this.currentPath = '/home/guest';
  }

  createDefaultFileSystem() {
    return {
      '/': {
        type: 'directory',
        children: {
          'home': {
            type: 'directory',
            children: {
              'guest': {
                type: 'directory',
                children: {
                  'Documents': {
                    type: 'directory',
                    children: {
                      'welcome.txt': {
                        type: 'file',
                        content: 'Welcome to Nuvola OS!\n\nThis is a fully functional web-based operating system.\n\nFeel free to explore and create files.\n\nEnjoy!',
                        size: 150,
                        modified: new Date().toISOString()
                      },
                      'notes.txt': {
                        type: 'file',
                        content: 'My Notes\n========\n\n- Learn JavaScript\n- Build awesome apps\n- Master web development',
                        size: 95,
                        modified: new Date().toISOString()
                      }
                    }
                  },
                  'Downloads': {
                    type: 'directory',
                    children: {}
                  },
                  'Pictures': {
                    type: 'directory',
                    children: {}
                  },
                  'Music': {
                    type: 'directory',
                    children: {}
                  },
                  'Desktop': {
                    type: 'directory',
                    children: {}
                  }
                }
              }
            }
          },
          'etc': {
            type: 'directory',
            children: {
              'os-release': {
                type: 'file',
                content: 'NAME="Nuvola OS"\nVERSION="1.0.0"\nID=nuvola\nPRETTY_NAME="Nuvola OS 1.0.0"\nVERSION_ID="1.0.0"',
                size: 100,
                modified: new Date().toISOString()
              }
            }
          },
          'tmp': {
            type: 'directory',
            children: {}
          }
        }
      }
    };
  }

  // Path manipulation
  resolvePath(path) {
    if (path.startsWith('/')) return path;
    return this.joinPath(this.currentPath, path);
  }

  joinPath(...parts) {
    return parts.join('/').replace(/\/+/g, '/');
  }

  normalizePath(path) {
    const parts = path.split('/').filter(p => p && p !== '.');
    const normalized = [];
    
    for (const part of parts) {
      if (part === '..') {
        normalized.pop();
      } else {
        normalized.push(part);
      }
    }
    
    return '/' + normalized.join('/');
  }

  // Navigation
  getNode(path) {
    path = this.normalizePath(this.resolvePath(path));
    const parts = path.split('/').filter(p => p);
    
    let current = this.root['/'];
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    
    return current;
  }

  exists(path) {
    return this.getNode(path) !== null;
  }

  isDirectory(path) {
    const node = this.getNode(path);
    return node && node.type === 'directory';
  }

  isFile(path) {
    const node = this.getNode(path);
    return node && node.type === 'file';
  }

  // File operations
  readFile(path) {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') {
      throw new Error(`File not found: ${path}`);
    }
    return node.content || '';
  }

  writeFile(path, content) {
    path = this.normalizePath(this.resolvePath(path));
    const parts = path.split('/').filter(p => p);
    const filename = parts.pop();
    const dirPath = '/' + parts.join('/');
    
    const dir = this.getNode(dirPath);
    if (!dir || dir.type !== 'directory') {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    
    dir.children[filename] = {
      type: 'file',
      content: content,
      size: content.length,
      modified: new Date().toISOString()
    };
    
    this.saveToStorage();
    return true;
  }

  deleteFile(path) {
    path = this.normalizePath(this.resolvePath(path));
    const parts = path.split('/').filter(p => p);
    const filename = parts.pop();
    const dirPath = '/' + parts.join('/');
    
    const dir = this.getNode(dirPath);
    if (!dir || dir.type !== 'directory') {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    
    if (!dir.children[filename]) {
      throw new Error(`File not found: ${path}`);
    }
    
    delete dir.children[filename];
    this.saveToStorage();
    return true;
  }

  // Directory operations
  listDirectory(path = this.currentPath) {
    const node = this.getNode(path);
    if (!node || node.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }
    
    return Object.entries(node.children || {}).map(([name, node]) => ({
      name,
      type: node.type,
      size: node.size || 0,
      modified: node.modified || new Date().toISOString()
    }));
  }

  createDirectory(path) {
    path = this.normalizePath(this.resolvePath(path));
    const parts = path.split('/').filter(p => p);
    const dirname = parts.pop();
    const parentPath = '/' + parts.join('/');
    
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Parent directory not found: ${parentPath}`);
    }
    
    if (parent.children[dirname]) {
      throw new Error(`Directory already exists: ${path}`);
    }
    
    parent.children[dirname] = {
      type: 'directory',
      children: {}
    };
    
    this.saveToStorage();
    return true;
  }

  deleteDirectory(path) {
    path = this.normalizePath(this.resolvePath(path));
    const parts = path.split('/').filter(p => p);
    const dirname = parts.pop();
    const parentPath = '/' + parts.join('/');
    
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'directory') {
      throw new Error(`Parent directory not found: ${parentPath}`);
    }
    
    const dir = parent.children[dirname];
    if (!dir || dir.type !== 'directory') {
      throw new Error(`Directory not found: ${path}`);
    }
    
    if (Object.keys(dir.children || {}).length > 0) {
      throw new Error(`Directory not empty: ${path}`);
    }
    
    delete parent.children[dirname];
    this.saveToStorage();
    return true;
  }

  changeDirectory(path) {
    const node = this.getNode(path);
    if (!node || node.type !== 'directory') {
      throw new Error(`Not a directory: ${path}`);
    }
    
    this.currentPath = this.normalizePath(this.resolvePath(path));
    return this.currentPath;
  }

  // Persistence
  saveToStorage() {
    try {
      localStorage.setItem('nuvola_filesystem', JSON.stringify(this.root));
    } catch (e) {
      console.warn('Failed to save filesystem:', e);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('nuvola_filesystem');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load filesystem:', e);
      return null;
    }
  }

  // Utility
  getParentPath(path) {
    const parts = path.split('/').filter(p => p);
    parts.pop();
    return '/' + parts.join('/') || '/';
  }

  getBasename(path) {
    const parts = path.split('/').filter(p => p);
    return parts[parts.length - 1] || '/';
  }

  getFileInfo(path) {
    const node = this.getNode(path);
    if (!node) return null;
    
    return {
      path: this.normalizePath(this.resolvePath(path)),
      type: node.type,
      size: node.size || (node.type === 'directory' ? Object.keys(node.children || {}).length : 0),
      modified: node.modified || new Date().toISOString(),
      isDirectory: node.type === 'directory',
      isFile: node.type === 'file'
    };
  }
}

// Global filesystem instance
const fs = new FileSystem();
