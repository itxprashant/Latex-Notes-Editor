import { app, BrowserWindow } from 'electron';
import { Menu } from 'electron';
import { ipcMain } from 'electron';

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: "./preload.js",
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true,
    }
  })

  win.loadFile('index.html')
  // win.webContents.openDevTools()
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', click: () => { console.log('New File clicked');
       } },
      { label: 'Open File', click: () => { console.log('Open File clicked'); } },
      { type: 'separator' },
      { label: 'Exit', role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' },
      { type: 'separator' },
      { label: 'Toggle Developer Tools', click: () => { win.webContents.toggleDevTools(); },
        accelerator: "CmdorCtrl+Shift+I" }
    ]
  },
  {
    label: 'Help',
    submenu: [
      { label: 'About', click: () => { console.log('About clicked'); } }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow()
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

// ipcMain.on('editor-content', (event, content) => {
//   console.log('Recieved editor content: ', content);
// })