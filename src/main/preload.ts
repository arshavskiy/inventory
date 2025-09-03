import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  readConfig: () => ipcRenderer.invoke('read-config'),
  sendMailWithCSV: () => ipcRenderer.invoke('send-mail-with-csv'),
  writeInventory: (data: { wafer: number; antennas: number; capacitors: number; epoxy: number }) => ipcRenderer.invoke('write-inventory', data)
});
