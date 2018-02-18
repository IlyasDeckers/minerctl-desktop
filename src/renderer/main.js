import Vue from 'vue'
import axios from 'axios'
import App from './app/App'
import router from './router'
import svgicon from 'vue-svgicon'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

require('dotenv').load()
Vue.prototype.$env = process.env
const env = process.env

Object.defineProperty(Vue.prototype, '$bus', {
  get () {
    return this.$root.bus
  }
})

const Pusher = require('pusher')
Vue.pusher = Vue.prototype.$pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.PUSHER_APP_CUSTER,
  encrypted: true
})

const Web3 = require('web3')
Vue.web3 = Vue.prototype.$web3 = new Web3(
  new Web3.providers.HttpProvider(env.INFURA_URL)
)

Vue.http = Vue.prototype.$http = axios.create({
  baseURL: env.HOME_URL + 'api/',
  timeout: 25000,
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('apiKey'),
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// import svg icons
Vue.config.productionTip = false
Vue.use(svgicon, {
  tagName: 'svgicon'
})

Vue.mixin({
  methods: {
    roundNumber: (number, precision) => {
      return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
    },
    truncate: (str, limit) => {
      return (str.length < limit) ? str : str.substring(0, limit).replace(/\w{3}$/gi, '...')
    },
    sleep: milliseconds => {
      var start = new Date().getTime()
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
          break
        }
      }
    },
    search: (arr, s) => {
      var i; var key; var matches = []
      for (i = arr.length; i--;) {
        for (key in arr[i]) {
          if (arr[i][key].indexOf(s) !== -1) {
            matches.push(arr[i])
          }
        }
      }
      if (matches !== 'undefined' && matches.length < 0) {
        return false
      }
      return matches
    }
  }
})

new Vue({
  components: { App },
  data: {
    bus: new Vue({})
  },
  router,
  Vue,
  template: '<App/>'
}).$mount('#app')
