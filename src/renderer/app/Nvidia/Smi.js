const exec = require('child_process').exec
const xml = require('xml2js').parseString
const remote = require('electron').remote
const app = remote.app

module.exports = function (callback) {
  // shell out
  exec(app.getPath('documents') + '\\minerctl\\bin\\nvidia-smi.exe -q -x', function (err, stdout, stderr) {
    // handle errors
    if (err) {
      return callback(err)
    }
    if (stderr) {
      return callback(stderr)
    }

    // XML parser options
    const options = {
      explicitArray: false,
      trim: true
    }

    // restructure the XML into json
    xml(stdout, options, function (err, data) {
      // handle errors
      if (err) {
        return callback(err)
      }

      // return the data
      return callback(null, data)
    })
  })
}
