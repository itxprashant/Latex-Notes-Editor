// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // one-way: renderer → main
  send: (channel, data) => {
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
      console.log(`Channel: ${channel}, Data:`, data);
    }
  },
  // two-way (invoke): renderer ↔ main
  invoke: (channel, data) => {
    const validInvokes = ['doThing'];
    if (validInvokes.includes(channel)) {
      console.log(`Invoking channel: ${channel}, Data:`, data);
      return ipcRenderer.invoke(channel, data);
    }
  },
  // receive: main → renderer
  on: (channel, callback) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
      console.log(`Received on channel: ${channel}, Args:`, ...args);
    }
  }
});