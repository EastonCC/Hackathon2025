const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function startBackend() {
  return new Promise((resolve, reject) => {
    const isPackaged = app.isPackaged;
    const backendPath = isPackaged
      ? path.join(process.resourcesPath, 'backend')
      : path.join(__dirname, 'backend');

    // Set environment variables
    process.env.PORT = process.env.PORT || '3000';
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'desktop-app-secret-key-change-in-production';

    console.log('Starting backend from:', backendPath);

    backendProcess = spawn('node', ['server.js'], {
      cwd: backendPath,
      env: process.env,
      stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend:', err);
      reject(err);
    });

    // Give the server time to start
    setTimeout(() => {
      console.log('Backend started on port 3000');
      resolve();
    }, 2000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Load the frontend
  const distPath = path.join(__dirname, 'frontend/dist/index.html');
  const fs = require('fs');

  if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    console.error('Frontend not built! Please run: cd frontend && npm run build');
    mainWindow.loadURL('data:text/html,<h1>Error: Frontend not built</h1><p>Please run: cd frontend && npm run build</p>');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Disable hardware acceleration to prevent GPU errors on some systems
app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
