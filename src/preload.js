// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('myAPI', {
    doAThing: () => {console.log("done!!")}
})

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (filePath, content) => ipcRenderer.invoke('dialog:saveFile', filePath, content), 
  saveFileAs: (filePath, content) => ipcRenderer.invoke('dialog:saveFileAs', filePath, content), 
  sendCommand: (command, filePath) => ipcRenderer.invoke('executeCommand', command, filePath),
  compileFile: (filePath) => ipcRenderer.invoke('file:compileFile', filePath),
  getLogs: () => ipcRenderer.invoke('file:getLogs'),
  getPDF: (filePath) => ipcRenderer.invoke('file:getPDF', filePath),
})
