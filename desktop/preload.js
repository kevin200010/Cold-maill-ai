// Electron preload script

// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   onEmailGenerated: (callback) => ipcRenderer.on('email-generated', (event, data) => callback(data))
// });


// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   onEmailGenerated: (callback) => ipcRenderer.on('email-generated', callback),
// });



// contextBridge.exposeInMainWorld('electronAPI', {
//   sendEmailRequest: async (jobDescription, userProfile) => {
//     const resp = await fetch('http://localhost:5000/generate-email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jobDescription: jobDescription || "AI Engineer job at PepsiCo",
//         userProfile: "Kevin Patel – ML Engineer with 6+ years of experience in AI, LLMs and cloud."
//       })
//     });

//     return await resp.json();
//   }
// });





const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onEmailGenerated: (callback) => ipcRenderer.on('email-generated', callback),
  onScrollUp: (callback) => ipcRenderer.on('scroll-up', callback),
  onScrollDown: (callback) => ipcRenderer.on('scroll-down', callback),
  onTriggerCopy: (callback) => ipcRenderer.on('trigger-copy', callback),
});
