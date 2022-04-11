const electorn = require('electron');
const { autoUpdater } = require('electron-updater');

const { app, BrowserWindow, ipcMain } = electorn;

let mainWindow;

app.on('ready', function () {
  mainWindow = new BrowserWindow({});
  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

function closeNotification() {
  notification.classList.add('hidden');
}
function restartApp() {
  ipcRenderer.send('restart_app');
}

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
