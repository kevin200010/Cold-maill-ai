const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const screenshot = require('screenshot-desktop');
const fetch = require('node-fetch');
require('dotenv').config();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    x: 100,
    y: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.hide();
}

app.whenReady().then(() => {
  createWindow();

  // Ctrl+M: capture screenshot and extract job data
  globalShortcut.register('Control+M', async () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('email-generated', '⏳ Processing screenshot...');

    try {
      const img = await screenshot({ format: 'png' });
      const base64Image = img.toString('base64');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Extract the job posting company name and full description from the image. Respond as JSON: { "company": "...", "jobDescription": "..." }'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: `data:image/png;base64,${base64Image}`, detail: 'high' }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '{}';
      const json = JSON.parse(text);
      mainWindow.webContents.send('job-data', json);
    } catch (err) {
      mainWindow.webContents.send('email-generated', `[ERROR] ${err.message}`);
    }
  });

  // Ctrl+\ : toggle visibility
  globalShortcut.register('Control+\\', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Ctrl+Left / Ctrl+Right: move window
  globalShortcut.register('Control+Left', () => {
    const { x, y } = mainWindow.getBounds();
    mainWindow.setBounds({ x: x - 50, y, width: 800, height: 500 });
  });

  globalShortcut.register('Control+Right', () => {
    const { x, y } = mainWindow.getBounds();
    mainWindow.setBounds({ x: x + 50, y, width: 800, height: 500 });
  });

  // Ctrl+Up / Ctrl+Down: scroll
  globalShortcut.register('Control+Up', () => {
    mainWindow.webContents.send('scroll-up');
  });

  globalShortcut.register('Control+Down', () => {
    mainWindow.webContents.send('scroll-down');
  });

  // Ctrl+Q: copy email content
  globalShortcut.register('Control+Q', () => {
    mainWindow.webContents.send('trigger-copy');
  });

  // Ctrl+I: send email
  globalShortcut.register('Control+I', () => {
    mainWindow.webContents.send('trigger-send');
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
});

