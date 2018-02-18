import axios from 'axios'

export default class Backend {
  'use strict'
  response = {
    id: '',
    name: '',
    email: ''
  }

  constructor () {
    const config = require('electron-config-env')
    var host = config.config.HOME_URL
    var prefix = 'api'
    var headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('apiKey'),
      'X-Requested-With': 'XMLHttpRequest'
    }

    if (localStorage.apiKey === null) {
      this.headers = {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }

    this.http = axios.create({
      baseURL: host + '/' + prefix + '/',
      timeout: 25000,
      headers: headers
    })
  }

  request (url, params = '') {
    this.http.get(url + params).then(response => {
      this.formatResponse(response.data)
    }).catch(error => {
      throw new Error(error)
    })
  }

  formatResponse (data) {
    Object.keys(data).forEach((key) => {
      this.response[key] = data[key]
    })
  }
}
