export default class Claymore {
  method = ''
  host = '127.0.0.1'
  port = 3333
  response = {}

  constructor (method) {
    this.method = method
  }

  socket () {
    try {
      const socket = require('net')
      var s = socket.Socket()
      s.setEncoding('ascii')
      s.connect(this.port, this.host)
      var response = new Promise((resolve, reject) => {
        s.on('data', d => {
          var array = []
          JSON.parse(d).result.forEach(function (d) {
            array.push(d.split(';'))
          })
          resolve(array)
        })
      })
      response.then((result) => {
        s.end()
        this.formatResponse(result)
      })

      s.write('{"id":0,"jsonrpc":"2.0","method":"' + this.method + '"}')
    } catch (error) {
      throw new Error(error)
    }
  }

  formatResponse (data) {
    var response = {}
    var values = data
    var temperatures = []
    var hashrates = []
    var fanSpeeds = []
    var gpus = []

    response.hashrate = values[2][0] / 1000
    response.pool = values[7][0]
    response.shares = {
      valid: values[2][1],
      invalid: values[2][2]
    }
    // Set GPU temperatures
    values[6].forEach((data, i) => {
      if (i % 2) fanSpeeds.push(data); else temperatures.push(data)
    })
    // Set GPU fan speed
    values[3].forEach((data, i) => hashrates.push(data / 1000))

    // Build response
    temperatures.forEach((data, i) => {
      var n = i
      var gpu = {}
      gpu.temperature = data
      fanSpeeds.forEach((data, i) => { if (n === i) gpu.fanSpeed = data })
      hashrates.forEach((data, i) => { if (n === i) gpu.hashrates = data })

      gpus.push(gpu)
    })

    response.gpus = gpus
    this.response = response
  }
}
