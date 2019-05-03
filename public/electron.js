const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_db = new FileSync('db.json', {
    defaultValue: []
})
const adapter_config = new FileSync('config.json', {
    defaultValue: {'bookType': ['小说']}
})
const db = low(adapter_db)
const config = low(adapter_config)

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800, height: 600, transparent: false,
    webPreferences: { 
      nodeIntegration: false,
      webSecurity: false,
      preload: __dirname + '/preload.js' 
  }})

  win.loadURL( 
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    ) 
  
  if (isDev ) {
    win.webContents.openDevTools()
  }
  
  win.on('closed', () => {  
    win = null
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('save-data', (event, data) => {
  try {
      db.push(data).write()
      event.sender.send('save-data-reply', 'success') 
  } catch(err) {
      console.log(err)
      event.sender.send('save-data-reply', 'fail') 
  }
})

ipcMain.on('get-bookType', event => {
  event.returnValue = config.get('bookType').value()
})
