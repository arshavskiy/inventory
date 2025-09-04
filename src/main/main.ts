
import { app, BrowserWindow, ipcMain, session } from 'electron';
import { promises as fs } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const configPath = join('config.json');
const metaPath = join('meta.json');


async function sendMailWithCSV() {
  const recipient = 'elinor.orbach@wiliot.com';
  // const recipient = 'tal15k@tadbik.com';
  // const cc = 'tal15k@tadbik.com';
  const cc = 'yanive@tadbik.com';
  const subject = 'Inventory CSV';
  const attachment = 'inventory.csv';
  let body = 'Please find the current inventory. <br/><br/><br/>';

  try {
    const json = await fs.readFile(configPath, 'utf-8');
    const data = JSON.parse(json);

    // let space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    function addSpace(str: string): string {
      // Remove 7 chars per key length unit
      let L_L = str.split('Weeks');
      let spaceCount = 80 - str.length;
      let spaceUnit = '&nbsp;';
      let spacer = '';
      for (let i = 0; i < spaceCount; i++) {
        spacer += '-';
      }
      L_L[0] += spacer + 'Weeks ';
      return L_L.join(" ")
    }
    for (const [key, value] of Object.entries(data.inventory)) {
      let l = `${key.toLocaleUpperCase()} : ${value}(stock) / ${data.inventory_total[key]}(units). Weeks left: <b style="color: ${Number(data.weeks_left[key]) <= 2 ? 'red' : 'green'};">${data.weeks_left[key]}</b><br/>`;
      // const adjustedSpace = removeSpace(space, key.length + String(value).length);
      let newline = addSpace(l)
      body += newline
    }

  } catch (e) {
    console.error('Failed to send mail:', e);
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

const round2 = (val: number) => Math.round(val * 100) / 100;


ipcMain.handle('read-config', async () => {
  let meta = {};
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const data = JSON.parse(content);


    if (!data.inventory_total || !data.inventory_total.wafer || data.inventory_total.wafer === 0) {

      data.inventory_total = {
        wafer: data.inventory.wafer * data.inventory_units.wafer,
        antennas: data.inventory.antennas * data.inventory_units.antennas,
        capacitors: data.inventory.capacitors * data.inventory_units.capacitors,
        epoxy: data.inventory.epoxy * data.inventory_units.epoxy
      };
    }

    data.weeks_left = {
      wafer: round2(data.inventory_total.wafer / (data.shifts * data.shift_amount)),
      antennas: round2(data.inventory_total.antennas / (data.shifts * data.shift_amount)),
      capacitors: round2(data.inventory_total.capacitors / (data.shifts * data.shift_amount)),
      epoxy: round2(data.inventory_total.epoxy / (data.shifts * data.shift_amount))
    };

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
  data = JSON.parse(data);
  fileData.inventory_total = data.inventory_total;
  fileData.weeks_left = data.weeks_left;

  fileData.inventory = {
    wafer: round2(data.inventory_total.wafer / fileData.inventory_units.wafer),
    antennas: round2(data.inventory_total.antennas / fileData.inventory_units.antennas),
    capacitors: round2(data.inventory_total.capacitors / fileData.inventory_units.capacitors),
    epoxy: round2(data.inventory_total.epoxy / fileData.inventory_units.epoxy)
  };

  // Write to config.json
  await fs.writeFile(configPath, JSON.stringify(fileData), 'utf-8');

  // Write to inventory.csv
  const csvHeaders = ['wafer', 'antennas', 'capacitors', 'epoxy'];
  const csvValues = csvHeaders.map(h => fileData.inventory_total[h]);
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

  return { success: true, meta: metaFileData, data: fileData };
});