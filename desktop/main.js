// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const fs = require('fs');
// const fetch = require('node-fetch');
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1000,
//     height: 700,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
// }

// app.whenReady().then(() => {
//   createWindow();

//   // Register keyboard shortcut: Ctrl+M
//   globalShortcut.register('Control+M', async () => {
//     console.log('[Ctrl+M] Triggered: capturing screen and sending to GPT-4o...');

//     try {
//       // Take screenshot as buffer
//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       // Send screenshot to GPT-4o (vision)
//       const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You're an assistant that reads job listings from screen images. 
// If a LinkedIn job is visible in the screenshot, extract the LinkedIn job URL or the full job description text (title, company, and job content). 
// Return only the job content without extra commentary.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const result = await openaiRes.json();

//       if (!result.choices || !result.choices[0]) {
//         throw new Error('No response from OpenAI vision model');
//       }

//       const extractedText = result.choices[0].message.content;
//       console.log('✅ Vision LLM Output:\n', extractedText);

//       // Send result to frontend
//       mainWindow.webContents.send('email-generated', extractedText);
//     } catch (err) {
//       console.error('[Error] Vision job extraction failed:', err);
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

////////////////////////////////////////////////////////////////////////////////////////////////
// const { app, BrowserWindow, globalShortcut, Notification } = require('electron');
// const path = require('path');
// const fetch = require('node-fetch');
// const puppeteer = require('puppeteer-core');
// require('dotenv').config();

// let mainWindow;
// mainWindow = new BrowserWindow({
//   width: 400,
//   height: 300,
//   frame: false,
//   transparent: true,
//   alwaysOnTop: true,
//   skipTaskbar: true,
//   webPreferences: {
//     preload: path.join(__dirname, 'preload.js'),
//     contextIsolation: true
//   }
// });

// mainWindow.hide(); // hide on start

// globalShortcut.register('Control+M', async () => {
//   mainWindow.show();
//   mainWindow.setAlwaysOnTop(true);

//   // take screenshot → send to GPT-4o → get email
//   // result => mainWindow.webContents.send('email-generated', resultText)
// });

// async function getActiveLinkedInTab() {
//   const browserURL = 'http://localhost:9222'; // Chrome must be launched with --remote-debugging-port=9222
//   const browser = await puppeteer.connect({ browserURL });
//   const pages = await browser.pages();

//   const linkedInPage = pages.find(p => p.url().includes('linkedin.com/jobs/view'));
//   if (!linkedInPage) throw new Error('No LinkedIn job tab found');

//   const url = linkedInPage.url();
//   await browser.disconnect();
//   return url;
// }

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
// }

// app.whenReady().then(() => {
//   createWindow();

//   globalShortcut.register('Control+M', async () => {
//     try {
//       const jobUrl = await getActiveLinkedInTab();
//       console.log('✅ URL detected:', jobUrl);

//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: "You are an expert job application assistant. Given a LinkedIn job URL, fetch the page, extract the job description, and write a personalized cold email applying for the position on behalf of Kevin Patel, ML engineer with 6+ years experience in GenAI, cloud, and LLMs."
//             },
//             {
//               role: 'user',
//               content: `LinkedIn job URL: ${jobUrl}`
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices[0].message.content;

//       // Show popup notification
//       new Notification({
//         title: '✅ Email Generated',
//         body: emailText.slice(0, 200) + '...',
//         silent: false
//       }).show();

//       // Also send to frontend for viewing
//       mainWindow.webContents.send('email-generated', emailText);

//     } catch (err) {
//       console.error('[ERROR]', err.message);
//       new Notification({
//         title: '❌ Error',
//         body: err.message
//       }).show();
//     }
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });


/////////version 4
// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// // const fetch = require('node-fetch');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//   width: 420,
//   height: 280,
//   frame: false,
//   transparent: true,
//   alwaysOnTop: true,
//   skipTaskbar: true,
//   focusable: false,
//   hasShadow: false,
//   fullscreenable: false,
//   resizable: false,
//   webPreferences: {
//     preload: path.join(__dirname, 'preload.js'),
//     contextIsolation: true
//   }
// });


//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
//   mainWindow.setIgnoreMouseEvents(true); // 🛑 Makes it completely unclickable
//  overlay.style.display = 'block'
//   mainWindow.setAlwaysOnTop(true, 'screen-saver');
// }

// app.whenReady().then(() => {
//   createWindow();

//   // Register Ctrl+M shortcut
//   globalShortcut.register('Control+M', async () => {
//     try {
//       console.log('[Ctrl+M] Triggered - capturing screen...');

//       // Show window immediately (transparent overlay)
//       mainWindow.show();
//       mainWindow.focus();

//       // Take screenshot
//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       // Send screenshot to GPT-4o vision model
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You are an AI job application assistant. Given a screenshot from the user's screen, extract any LinkedIn job posting visible (job title, company, location, and description). Then write a personalized, professional cold email applying for the job on behalf of Kevin Patel, an ML engineer with 6+ years experience in GenAI and cloud systems. Return only the email text.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices?.[0]?.message?.content || 'Failed to generate email.';

//       // Send email text to renderer to show in overlay
//       mainWindow.webContents.send('email-generated', emailText);

//       console.log('[✅] Email Generated');
//     } catch (err) {
//       console.error('[ERROR]', err.message);
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });



//version 5
// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     frame: false,
//     transparent: true,
//     alwaysOnTop: true,
//     skipTaskbar: true,
//     focusable: false, // makes it unclickable
//     hasShadow: false,
//     fullscreenable: false,
//     resizable: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
//   mainWindow.setIgnoreMouseEvents(true); // Let user click through, but text still selectable
//   mainWindow.setAlwaysOnTop(true, 'screen-saver');
// }

// app.commandLine.appendSwitch('disable-backgrounding-occluded-windows'); // Prevent hide issues

// app.whenReady().then(() => {
//   createWindow();

//   // Ctrl + M shortcut to trigger job assistant
//   globalShortcut.register('Control+M', async () => {
//     try {
//       console.log('[Ctrl+M] Triggered - capturing screen...');

//       mainWindow.show();
//       mainWindow.focus();

//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You're an AI job assistant. Given a screenshot, extract any LinkedIn job title, company, and description. Then write a personalized cold email applying for the job on behalf of Kevin Patel, an ML engineer with 6+ years of experience in GenAI and cloud systems. Return only the email text.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices?.[0]?.message?.content || '[ERROR] No response from GPT-4o';

//       mainWindow.webContents.send('email-generated', emailText);
//       console.log('[✅] Email Generated');

//     } catch (err) {
//       console.error('[ERROR]', err.message);
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });




//version 6
// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 820,
//     height: 520,
//     frame: false,
//     transparent: true,
//     alwaysOnTop: true,
//     skipTaskbar: true,
//     focusable: false,
//     hasShadow: false,
//     fullscreenable: false,
//     resizable: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile(path.join(__dirname, 'index.html')); // Load either index_ctrl_shift.html or index_capslock.html
//   mainWindow.setIgnoreMouseEvents(true); // Make it unclickable but copyable
//   mainWindow.setAlwaysOnTop(true, 'screen-saver');
// }

// app.whenReady().then(() => {
//   createWindow();

//   // Register Ctrl+M shortcut to trigger screenshot
//   globalShortcut.register('Control+M', async () => {
//     try {
//       console.log('[Ctrl+M] Triggered - capturing screen...');

//       mainWindow.show();

//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You are an AI job assistant. Given a screenshot, extract the LinkedIn job description and write a personalized cold email applying for the job on behalf of Kevin Patel, ML engineer with 6+ years in GenAI and cloud.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices?.[0]?.message?.content || '❌ Failed to generate email.';
//       mainWindow.webContents.send('email-generated', emailText);

//     } catch (err) {
//       console.error('[ERROR]', err.message);
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });



//version 7
// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
// mainWindow = new BrowserWindow({
//   width: 800,
//   height: 500,
//   x: 100,
//   y: 100,
//   frame: false,
//   transparent: true,
//   titleBarStyle: 'customButtonsOnHover',
//   backgroundColor: '#00000000',
//   alwaysOnTop: true,
//   skipTaskbar: true,
//   focusable: true,
//   webPreferences: {
//     preload: path.join(__dirname, 'preload.js'),
//     contextIsolation: true
//   }
// });


//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
//   mainWindow.setAlwaysOnTop(true, 'screen-saver');
// }

// app.whenReady().then(() => {
//   createWindow();

//   // 🔥 Ctrl+M to start the process
//   globalShortcut.register('Control+M', async () => {
//     mainWindow.show();
//     mainWindow.focus();

//     mainWindow.webContents.send('email-generated', '⏳ Processing screenshot with GPT-4o...');

//     try {
//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You are an AI job application assistant. Given a screenshot from the user's screen, extract any LinkedIn job posting visible (title, company, location, description). Then write a professional cold email for Kevin Patel, ML engineer with 6+ years experience in GenAI and cloud.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices?.[0]?.message?.content || '⚠️ Could not extract content.';

//       mainWindow.webContents.send('email-generated', emailText);
//     } catch (err) {
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });

//   // 🔁 Move window with Ctrl+Shift+Left/Right

// globalShortcut.register('Control+Shift+Left', () => {
//   const { x, y } = mainWindow.getBounds();
//   mainWindow.setBounds({ x: x - 50, y, width: 800, height: 500 });
// });

// globalShortcut.register('Control+Shift+Right', () => {
//   const { x, y } = mainWindow.getBounds();
//   mainWindow.setBounds({ x: x + 50, y, width: 800, height: 500 });
// });

// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });


// globalShortcut.register('Control+\\', () => {
//   if (mainWindow.isVisible()) {
//     mainWindow.hide();
//   } else {
//     mainWindow.show();
//     mainWindow.focus();
//   }
// });



//version 8 ( 6 last working )
// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const screenshot = require('screenshot-desktop');
// require('dotenv').config();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 500,
//     x: 100,
//     y: 100,
//     frame: false,
//     transparent: true,
//     alwaysOnTop: true,
//     skipTaskbar: true,
//     focusable: true,
//     titleBarStyle: 'hidden',
//     backgroundColor: '#00000000', // transparent

//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true
//     }
//   });

//   mainWindow.loadFile(path.join(__dirname, 'index.html'));
//   mainWindow.setAlwaysOnTop(true, 'screen-saver');
// }

// app.whenReady().then(() => {
//   createWindow();

//   // 🔁 All shortcut registrations must be inside here:

//   // Show/hide app with Ctrl + \
// globalShortcut.register('Control+\\', () => {
//   if (mainWindow.isVisible()) {
//     mainWindow.hide();
//   } else {
//     mainWindow.show();
//     mainWindow.focus();
//   }
// });


//   globalShortcut.register('Control+M', async () => {
//     mainWindow.show();
//     mainWindow.focus();
//     mainWindow.webContents.send('email-generated', '⏳ Processing screenshot with GPT-4o...');
//     try {
//       const img = await screenshot({ format: 'png' });
//       const base64Image = img.toString('base64');

//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o',
//           messages: [
//             {
//               role: 'system',
//               content: `You are an AI job application assistant. Given a screenshot from the user's screen, extract any LinkedIn job posting visible (title, company, location, description). Then write a professional cold email for Kevin Patel, ML engineer with 6+ years experience in GenAI and cloud.`
//             },
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'image_url',
//                   image_url: {
//                     url: `data:image/png;base64,${base64Image}`,
//                     detail: 'high'
//                   }
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const emailText = data.choices?.[0]?.message?.content || '⚠️ Could not extract content.';
//       mainWindow.webContents.send('email-generated', emailText);
//     } catch (err) {
//       mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
//     }
//   });

//   globalShortcut.register('Control+Shift+Left', () => {
//     const { x, y } = mainWindow.getBounds();
//     mainWindow.setBounds({ x: x - 50, y, width: 800, height: 500 });
//   });

//   globalShortcut.register('Control+Shift+Right', () => {
//     const { x, y } = mainWindow.getBounds();
//     mainWindow.setBounds({ x: x + 50, y, width: 800, height: 500 });
//   });
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });


//version 9
// main.js
const { app, BrowserWindow, globalShortcut, clipboard } = require('electron');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const screenshot = require('screenshot-desktop');
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
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.webContents.openDevTools();
  mainWindow.hide();
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Control+M', async () => {
  console.log("Ctrl+M pressed");

  if (!mainWindow) {
    console.error("Main window not available");
    return;
  }

  mainWindow.show();
  mainWindow.focus();

  mainWindow.webContents.send('email-generated', '⏳ Processing screenshot with GPT-4o...');
  console.log("Sent processing message");

  try {
    const img = await screenshot({ format: 'png' });
    console.log("Screenshot captured");
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
            content: `You are an AI job application assistant. Given a screenshot from the user's screen, extract any LinkedIn job posting visible (title, company, location, description). Then write a professional cold email for Kevin Patel, ML engineer with 6+ years experience in GenAI and cloud.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenAI response received:", data);

    const emailText = data.choices?.[0]?.message?.content || '⚠️ Could not extract content.';
    mainWindow.webContents.send('email-generated', emailText);
  } catch (err) {
    console.error("Error occurred:", err.message);
    mainWindow.webContents.send('email-generated', '[ERROR] ' + err.message);
  }
});


  globalShortcut.register('Control+Shift+Left', () => {
    const { x, y } = mainWindow.getBounds();
    mainWindow.setBounds({ x: x - 50, y, width: 800, height: 500 });
  });

  globalShortcut.register('Control+Shift+Right', () => {
    const { x, y } = mainWindow.getBounds();
    mainWindow.setBounds({ x: x + 50, y, width: 800, height: 500 });
  });

  globalShortcut.register('Control+Shift+Up', () => {
    mainWindow.webContents.send('scroll-up');
  });

  globalShortcut.register('Control+Shift+Down', () => {
    mainWindow.webContents.send('scroll-down');
  });

  globalShortcut.register('Control+Shift+C', () => {
    mainWindow.webContents.send('trigger-copy');
  });

  globalShortcut.register('Control+\\', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
});


