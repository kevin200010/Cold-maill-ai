const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onEmailGenerated: (callback) => ipcRenderer.on('email-generated', callback),
  onJobData: (callback) => ipcRenderer.on('job-data', (event, data) => callback(data)),
  onScrollUp: (callback) => ipcRenderer.on('scroll-up', callback),
  onScrollDown: (callback) => ipcRenderer.on('scroll-down', callback),
  onTriggerCopy: (callback) => ipcRenderer.on('trigger-copy', callback),
  onTriggerSend: (callback) => ipcRenderer.on('trigger-send', callback)
});
