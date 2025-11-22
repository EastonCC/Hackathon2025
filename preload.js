// Preload script for Electron security
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    version: process.versions.electron
  }
);
