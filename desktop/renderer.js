// const { ipcRenderer } = require('electron');

// ipcRenderer.on('email-generated', (event, message) => {
//   const content = document.getElementById('email-content');
//   content.innerText = message;
// });



// ipcRenderer.on('scroll-up', () => {
//   contentDiv.scrollTop -= 50;
// });

// ipcRenderer.on('scroll-down', () => {
//   contentDiv.scrollTop += 50;
// });

// ipcRenderer.on('trigger-copy', () => {
//   const text = contentDiv.innerText;
//   navigator.clipboard.writeText(text).then(() => {
//     console.log('Copied to clipboard');
//   }).catch(err => {
//     console.error('Copy failed', err);
//   });
// });


// renderer.js
// const { ipcRenderer } = require('electron');

// const contentDiv = document.getElementById('email-content');

// ipcRenderer.on('email-generated', (event, message) => {
//   contentDiv.innerText = message;
//   contentDiv.scrollTop = 0;
// });

// ipcRenderer.on('scroll-up', () => {
//   contentDiv.scrollTop -= 50;
// });

// ipcRenderer.on('scroll-down', () => {
//   contentDiv.scrollTop += 50;
// });

// ipcRenderer.on('trigger-copy', () => {
//   const text = contentDiv.innerText;
//   navigator.clipboard.writeText(text).then(() => {
//     console.log('Copied to clipboard');
//   }).catch(err => {
//     console.error('Copy failed', err);
//   });
// });



// const contentDiv = document.getElementById('email-content');

// window.electronAPI.onEmailGenerated((event, message) => {
//   contentDiv.innerText = message;
//   contentDiv.scrollTop = 0;
// });

// window.electronAPI.onScrollUp(() => {
//   contentDiv.scrollTop -= 50;
// });

// window.electronAPI.onScrollDown(() => {
//   contentDiv.scrollTop += 50;
// });

// window.electronAPI.onTriggerCopy(() => {
//   const text = contentDiv.innerText;
//   navigator.clipboard.writeText(text).then(() => {
//     console.log('Copied to clipboard');
//   }).catch(err => {
//     console.error('Copy failed', err);
//   });
// });


window.onload = () => {
  const contentDiv = document.getElementById('email-content');

 window.electronAPI.onEmailGenerated((event, message) => {
    contentDiv.innerText = message;
    contentDiv.scrollTop = 0;
  });

  window.electronAPI.onScrollUp(() => {
    console.log("⬆ Scroll up triggered");
    contentDiv.scrollTop -= 50;
  });

  window.electronAPI.onScrollDown(() => {
    console.log("⬇ Scroll down triggered");
    contentDiv.scrollTop += 50;
  });

  window.electronAPI.onTriggerCopy(() => {
    const text = contentDiv.innerText;
    navigator.clipboard.writeText(text)
      .then(() => console.log('✅ Copied to clipboard'))
      .catch(err => console.error('❌ Copy failed', err));
  });
};

