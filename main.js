import { app, BrowserWindow } from 'electron';
import { Menu } from 'electron';

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', click: () => { console.log('New File clicked'); } },
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
      { label: 'Paste', role: 'paste' }
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
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()

}

app.whenReady().then(() => {
  createWindow()
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})