import DecompressZip from 'decompress-zip'

export default class DownloadDependencies {
  download () {
    const DownloadManager = require('electron-download-manager')
    let remote = require('electron').remote
    let app = remote.app
    DownloadManager.register({downloadFolder: app.getPath('documents') + '/minerctl'})
    // Bulk file download
    DownloadManager.bulkDownload({
      urls: this.links(),
      path: 'bin'
    }, (error, finished, errors) => {
      if (error) {
        console.log('finished: ' + finished)
        console.log('errors: ' + errors)
      }
      console.log('all finished')
    })

    if (!this.fsExists(app.getPath('documents') + '/minerctl/bin/Claymore_v10.0')) {
      this.unzipClaymore()
    }
  }

  unzipClaymore () {
    const ZIP_FILE_PATH = this.app.getPath('documents') + '/minerctl/bin/Claymore_v10.0.zip'
    const DESTINATION_PATH = this.app.getPath('documents') + '/minerctl/bin/Claymore_v10.0'
    const unzipper = new DecompressZip(ZIP_FILE_PATH)

    // Add the error event listener
    unzipper.on('error', (err) => {
      console.log('Caught an error', err)
    })

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

  fsExists (myDir) {
    var fs = require('fs')
    try {
      fs.accessSync(myDir)
      return true
    } catch (e) {
      return false
    }
  }

  links () {
    return [
      'https://s3.eu-central-1.amazonaws.com/minerctldownloads/Claymore_v10.0.zip',
      'https://s3.eu-central-1.amazonaws.com/minerctldownloads/nvidia-smi.exe'
    ]
  }
}
