const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require("fs");
const { exec } = require('child_process');


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

async function handleSaveCurrentFile(filePath, content){
  if (!currentFilePath){
    const { canceled, filePath: newFilePath } = await dialog.showSaveDialog({
      defaultPath: filePath || 'document.tex',
      filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
    });

    if (canceled || !newFilePath){
      console.log('Save operation cancelled.');
      return null;
    }

    currentFilePath = newFilePath;
  }

    try {
      await fs.promises.writeFile(currentFilePath, content, 'utf-8');
      console.log('File saved successfully:', currentFilePath);
      return currentFilePath;
    } catch (err) {
      console.error('Error saving file:', err);
      throw err;
    }
}

async function handleSaveCurrentFileAs(filePath, content){
  const { canceled, filePath: newFilePath } = await dialog.showSaveDialog({
    defaultPath: filePath || 'document.tex',
    filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
  });

  if (canceled || !newFilePath){
    console.log('Save operation cancelled.');
    return null;
  }

  currentFilePath = newFilePath;

  try {
    await fs.promises.writeFile(currentFilePath, content, 'utf-8');
    console.log('File saved successfully:', currentFilePath);
    return currentFilePath;
  } catch (err) {
    console.error('Error saving file:', err);
    throw err;
  }
}

async function compileFile(filePath) {
  exec(`pdflatex ${filePath} -output-directory="./exported/"`, (err, stdout, stderr) => {
    if (err) {
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('file:compileFile', async (event, filePath) => {
    compileFile(filePath);
  })
  ipcMain.handle('dialog:saveFile', async (event, filePath, content) => {
    await handleSaveCurrentFile(filePath, content);
});
  ipcMain.handle('dialog:saveFileAs', async (event, filePath, content) => {
    await handleSaveCurrentFileAs(filePath, content);
});
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
