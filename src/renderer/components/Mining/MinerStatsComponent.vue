<template>
  <div>
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
          <h3 class="title">{{ roundNumber(pool.unpaid, 4) }}
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
                    <td>{{ gpu.hashrates }} MH/s</td>
                    <td>{{ gpu.temperature }} &#176;C</td>
                    <td>{{ gpu.fanSpeed }} %</td>
                  </tr>
                </tbody>
              </table>
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
      rigName: ''
    }
  },
  mounted () {
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
      this.interval = setInterval(() => {
        this.rigName = localStorage.getItem('rigName')
        this.getMinerStats()
        this.$pusher.trigger('minerctl_desktop', 'updateMinerStats_' + localStorage.getItem('userId'), this.claymore)
      }, 20000)
    },

    stopInterval () {
      clearInterval(this.interval)
    },

    setWallet (data) {
      this.wallet = data
    },

    sendHome () {
      // send post request to store the data
      this.$http.post('data/claymore', { data: this.claymore })
    },

    getMinerStats () {
      setTimeout(() => {
        this.getPool()
      }, 500)
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

          this.sendHome()
        }, 100)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>