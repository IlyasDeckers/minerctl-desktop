<template>
  <div style="margin-top:40px;">
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card card-stats">
        <div class="card-header" data-background-color="orange">
          <i class="material-icons">content_copy</i>
        </div>
        <div class="card-content">
          <p class="category">Total Hashrate</p>
          <h3 class="title" rel="tooltip" data-placement="bottom" data-original-title="Your effective current hashrate. It is calculated according your submitted shares using a 60 minute window. It will take up to 2 hours till the displayed hashrate is accurate. Deviations from your local hashrate are normal.">
            {{ roundNumber(claymore.response.hashrate, 2) }}<small> Mh/s</small>
          </h3>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card card-stats">
        <div class="card-header" data-background-color="blue">
          <i class="material-icons">work</i>
        </div>
        <div class="card-content">
          <p class="category">Shares</p>
          <h3 class="title">{{ claymore.response.shares_valid }}</h3>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card card-stats">
        <div class="card-header" data-background-color="red">
          <i class="material-icons">info_outline</i>
        </div>
        <div class="card-content">
          <p class="category">Unpaid Balance</p>
          <h3 class="title">{{ roundNumber(pool.unpaid, 5) }}
            <small>ETH</small>
          </h3>
        </div>
      </div>
    </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-content">
            <h4 class="card-title">Miner -
              <small class="category">Statistics</small>
            </h4>
            <div class="table-responsive">
              <table class="table">
                <thead class="text-primary">
                  <tr>
                    <th>GPU</th>
                    <th>Hashrate</th>
                    <th>Temperature</th>
                    <th>Fanspeed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gpu, index) in claymore.response.gpus">
                    <td>gpu{{ index }}</td>
                    <td>{{ roundNumber(gpu.hashrates, 2) }} MH/s</td>
                    <td>{{ gpu.temperature }} &#176;C</td>
                    <td>{{ gpu.fanSpeed }} %</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group form-button text-center">
                <a @click="$bus.$emit('stopMiner')" class="btn btn-fill btn-rose">Stop Mining<div class="ripple-container"></div></a>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Claymore from '../../app/Claymore'

export default {
  data () {
    return {
      claymore: {
        host: '',
        method: '',
        port: '',
        rigname: '',
        userId: '',
        response: {
          gpus: {},
          hashrate: '',
          shares_valid: 0,
          shares_invalid: 0
        }
      },
      pool: {
        unpaid: 0
      },
      apiKey: localStorage.getItem('apiKey'),
      wallet: {},
      interval: false,
      short_interval: false,
      rigName: '',
      connRefused: 0
    }
  },
  mounted () {
    this.getPool()

    // Recieve event bus
    this.$bus.$on('startInterval', () => this.getMinerStats())
    this.$bus.$on('stopInterval', () => this.stopInterval())
    this.$bus.$on('setRigName', data => { this.rigName = data })
  },
  methods: {
    getPool () {
      this.$http.get(
        this.$env.HOME_URL + 'api/pools/' + localStorage.getItem('currentMiningAddress')
      ).then(response => {
        this.pool = response.data[0]
      })
    },

    startInterval () {
      setTimeout(() => {
        this.sendHome()
      }, 5000)

      this.interval = setInterval(() => {
        console.log('interval')
        setTimeout(() => {
          this.getPool()
        }, 1000)
        this.sendHome()
      }, 60000)

      this.short_interval = setInterval(() => {
        console.log('shortinterval')
        this.rigName = localStorage.getItem('rigName')
        this.getMinerStats()
        console.log(Object.keys(this.claymore.response).length)
        if (Object.keys(this.claymore.response).length === 0) {
          this.connRefused++
          this.$bus.$emit('toggleLoading', 'Something went wong...')
          if (this.connRefused >= 4) {
            this.$bus.$emit('toggleLoading', 'Something went wong...')
          }
          if (this.connRefused >= 10) {
            this.minerHasStopped()
            this.connRefused = 0
          }
        }
      }, 1000)
    },

    minerHasStopped () {
      this.$bus.$emit('toggleLoading', 'Something went wong...')
      this.$bus.$emit('killProcess')
      this.$bus.$emit('stopInterval')
      this.$bus.$emit('error', 'Miner closed unexpectedly')
      // Send sms and post notification to the database
      this.$http.post('data/notification', {
        data: {
          message: 'miner <code>' + this.rigName + '</code> stopped unexpectedly',
          userId: localStorage.getItem('userId'),
          type: 'danger'
        }
      })
    },

    stopInterval () {
      console.log('Clearing interval')
      clearInterval(this.interval)
      clearInterval(this.short_interval)
      this.interval = false
      this.short_interval = false
      this.claymore = {}
    },

    setWallet (data) {
      this.wallet = data
    },

    sendHome () {
      // send post request to store the data
      this.$http.post('data/claymore', { data: this.claymore })
    },

    getMinerStats () {
      if (this.interval === false) this.startInterval()
      const c = new Claymore('miner_getstat1')
      const response = new Promise((resolve, reject) => {
        try {
          c.socket(); resolve()
        } catch (error) {
          reject(error)
        }
      })
      response.then((data) => {
        setTimeout(() => {
          this.claymore = c
          this.claymore.rigname = localStorage.getItem('rigName')
          this.claymore.userId = localStorage.getItem('userId')
        }, 200)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>