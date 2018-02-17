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
          <h3 class="title">{{ claymore.response.shares.valid }}</h3>
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
        response: {
          hashrate: '',
          shares: {
            valid: '',
            rejected: ''
          },
          gpus: {}
        }
      },
      pool: {},
      apiKey: localStorage.getItem('apiKey'),
      wallet: {},
      timeout: {
        statsInterval: false,
        poolInterval: false
      },
      interval: false
    }
  },
  mounted () {
    // Recieve event bus
    this.$bus.$on('startInterval', () => this.getMinerStats())
    this.$bus.$on('stopInterval', () => this.stopInterval())
  },
  methods: {
    getPool () {
      this.$http.get(
        'http://192.168.0.46/api/pools/' + localStorage.getItem('currentMiningAddress')
      ).then(response => {
        this.pool = response.data[0]
      })
    },

    startInterval () {
      this.interval = setInterval(() => {
        this.getMinerStats()
        this.getPool()
        this.$pusher.trigger('minerctl_desktop', 'updateMinerStats_' + localStorage.getItem('userId'), this.claymore)
      }, 8000)
    },

    stopInterval () {
      clearInterval(this.interval)
    },

    setWallet (data) {
      this.wallet = data
    },

    getMinerStats () {
      if (this.interval === false) this.startInterval()
      const c = new Claymore('miner_getstat1')
      const response = new Promise((resolve, reject) => {
        c.socket(); resolve()
      })
      response.then((data) => {
        this.claymore = c
      })
    }
  }
}
</script>