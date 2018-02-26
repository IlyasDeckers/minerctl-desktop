'use strict'

import { app, BrowserWindow } from 'electron'
import DecompressZip from 'decompress-zip'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const DownloadManager = require('electron-download-manager')
DownloadManager.register({downloadFolder: app.getPath('documents') + '/minerctl'})

function fsExists (myDir) {
  var fs = require('fs')
  try {
    fs.accessSync(myDir)
    return true
  } catch (e) {
    return false
  }
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1200
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('ready', () => {
  var links = [
    'https://s3.eu-central-1.amazonaws.com/minerctldownloads/Claymore_v10.0.zip',
    'https://s3.eu-central-1.amazonaws.com/minerctldownloads/nvidia-smi.exe'
  ]

  // Bulk file download
  DownloadManager.bulkDownload({
    urls: links,
    path: 'bin'
  }, (error, finished, errors) => {
    if (error) {
      console.log('finished: ' + finished)
      console.log('errors: ' + errors)
    }
    console.log('all finished')
    if (!fsExists(app.getPath('documents') + '/minerctl/bin/Claymore_v10.0')) {
      var ZIP_FILE_PATH = app.getPath('documents') + '/minerctl/bin/Claymore_v10.0.zip'
      var DESTINATION_PATH = app.getPath('documents') + '/minerctl/bin/Claymore_v10.0'
      var unzipper = new DecompressZip(ZIP_FILE_PATH)

      // Add the error event listener
      unzipper.on('error', (err) => console.log('Caught an error', err))

      // Notify when everything is extracted
      unzipper.on('extract', function (log) {
        console.log('Finished extracting', log)
      })

      // Notify "progress" of the decompressed files
      unzipper.on('progress', function (fileIndex, fileCount) {
        console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
      })

      unzipper.extract({
        path: DESTINATION_PATH
      })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
