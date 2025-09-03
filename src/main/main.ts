
import { app, BrowserWindow, ipcMain, session } from 'electron';
import { promises as fs } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const configPath = join('config.json');
const metaPath = join('meta.json');


async function sendMailWithCSV() {
  const recipient = 'elinor.orbach@wiliot.com';
  // const recipient = 'tal15k@tadbik.com';
  const cc = 'yanive@tadbik.com';
  const subject = 'Inventory CSV';
  const attachment = 'inventory.csv';
  let body = 'Please find the current inventory. <br/><br/><br/>';

  try {
    const csvData = await fs.readFile(attachment, 'utf-8');
    const [header, values] = csvData.split('\n');
    const keys = header.split(',');
    const vals = values.split(',');
    for (let i = 0; i < keys.length; i++) {
      body += keys[i].toLocaleUpperCase() + " : " + vals[i] + "<br/>";
    }
  } catch (e) {
    body += '(Could not read inventory.csv)';
  }

  const command = `powershell.exe -Command "$Outlook = New-Object -ComObject Outlook.Application; $Mail = $Outlook.CreateItem(0); $Mail.To = '${recipient}'; $Mail.Cc= '${cc}'; $Mail.Subject = '${subject}'; $Mail.HTMLBody = '${body.replace(/"/g, '\"').replace(/\n/g, '<br>')}'; $Mail.Attachments.Add((Resolve-Path '${attachment}')); $Mail.Send();"`;

  console.log('attachment', attachment);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to send mail:', error);
    } else {
      console.log('Mail sent successfully.');
    }
  });
}


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('read-config', async () => {
  let meta = {};
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const data = JSON.parse(content);
    const metaContent = await fs.readFile(metaPath, 'utf-8');
    meta = JSON.parse(metaContent);

    return { ...data, meta };
  } catch (e) {
    return { meta };
  }
});

ipcMain.handle('send-mail-with-csv', async () => {
  try {
    await sendMailWithCSV();

    let meta = await fs.readFile(metaPath, 'utf-8');
    const metaFileData = JSON.parse(meta);
    try {
      metaFileData.lastEmailDate = new Date();
      await fs.writeFile(metaPath, JSON.stringify(metaFileData), 'utf-8');
      return { success: true, meta: metaFileData };
    } catch (error) {
      console.error('Error writing inventory.csv:', error);
      return error
    }


    return { success: true, metaFileData };
  } catch (e) {
    // If file doesn't exist or is invalid, return defaults
    return {};
  }
});

ipcMain.handle('write-inventory', async (_event, data) => {
  const content = await fs.readFile(configPath, 'utf-8');
  const fileData = JSON.parse(content);
  fileData.inventory = data;

  // Write to config.json
  await fs.writeFile(configPath, JSON.stringify(fileData), 'utf-8');

  // Write to inventory.csv
  const csvHeaders = ['wafer', 'antennas', 'capacitors', 'epoxy'];
  const csvValues = csvHeaders.map(h => data[h]);
  const csvLine = `${csvHeaders.join(',')}
  ${csvValues.join(',')}`;
  await fs.writeFile('inventory.csv', csvLine, 'utf-8');

  let meta = await fs.readFile(metaPath, 'utf-8');
  const metaFileData = JSON.parse(meta);
  try {
    metaFileData.lastInventorySaveDate = new Date();
    await fs.writeFile(metaPath, JSON.stringify(metaFileData), 'utf-8');

  } catch (error) {
    console.error('Error writing inventory.csv:', error);
    return error
  }

  return { success: true, meta: metaFileData };
});