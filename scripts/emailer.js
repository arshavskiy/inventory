import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readFileSync } from 'fs';

export default function sendMailWithCSV() {
    const recipient = 'tal15k@tadbik.com';
    const cc = 'yanive@tadbik.com';
    const subject = 'Inventory CSV';
    const attachment = join(__dirname, '../inventory.csv');
    let body = 'Please find the attached inventory. <br/><br/><br/>';

    try {
        const csvData = readFileSync(attachment, 'utf-8');
        const [header, values] = csvData.split('\n');
        const keys = header.split(',');
        const vals = values.split(',');
        for (let i = 0; i < keys.length; i++) {
            body += keys[i].toLocaleUpperCase() + " : " + vals[i] + "<br/>";
        }
    } catch (e) {
        body += '(Could not read inventory.csv)';
    }

    const command = `powershell.exe -Command "$Outlook = New-Object -ComObject Outlook.Application; $Mail = $Outlook.CreateItem(0); $Mail.To = '${recipient}'; $Mail.CC = '${cc}'; $Mail.Subject = '${subject}'; $Mail.HTMLBody = '${body.replace(/"/g, '\"').replace(/\n/g, '<br>')}'; $Mail.Attachments.Add((Resolve-Path '${attachment}')); $Mail.Send();"`;

    console.log('attachment', attachment);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Failed to send mail:', error);
        } else {
            console.log('Mail sent successfully.');
        }
    });
}



sendMailWithCSV();