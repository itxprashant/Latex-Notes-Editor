const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let currentFilePath = null;

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    const data = await fs.promises.readFile(filePaths[0], 'utf-8');
    currentFilePath = filePaths[0]; // Store the current file path
    return [filePaths[0], data];
  }
}

async function handleFileRead(filePath) {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  try {
    if (!canceled){
      const filePath = filePaths[0]
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return data;
    }
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

// async function saveFile(filePath, content) {
//   // save file to disk
//   if (!openedFile) {
//     const { canceled, filePath: newFilePath } = await dialog.showSaveDialog({
//       defaultPath: filePath || 'document.tex',
//       filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
//     });
//   }
//   if (!canceled){
//     fs.writeFile(newFilePath, content, 'utf-8', (err) => {
//       if (err) {
//         console.error('Error saving file:', err);
//         throw err;
//       } else {
//         console.log('File saved successfully:', newFilePath);
//       }
//     })
//   }
// }

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('dialog:saveFile', async (event, filePath, content) => {

  let canceled = false;
  if (!currentFilePath){
    const { canceled, filePath: newFilePath } = await dialog.showSaveDialog({
      defaultPath: filePath || 'document.tex',
      filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
    });
  }

  if (!canceled) {
    try {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      console.log('File saved successfully:', filePath);
      currentFilePath = filePath; // Update the current file path
      return filePath;;
    } catch (err) {
      console.error('Error saving file:', err);
      throw err;
    }
  }
});
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
