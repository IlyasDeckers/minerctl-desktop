<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        {{ error }}
        <div class="row">
          <MinerStatsComponent v-show="process || !loading"></MinerStatsComponent>
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Mining - <small class="category">{{ runningHeading }}</small></h4>
              </div>
              <div class="card-content" v-show="!loading.state">
                <StartMinerComponent v-show="!process"></StartMinerComponent>
                <div class="row" v-show="process">
                  <div class="col-md-12">
                    <div class="form-group form-button text-center">
                      <a @click="stopMiner()" class="btn btn-fill btn-info">Stop Miner<div class="ripple-container"></div></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-content" v-show="loading.state">
                <p class="text-center"><Loading :message="loading.message"></Loading></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '../Navigation/NavigationComponent'
import MinerStatsComponent from './MinerStatsComponent'
import StartMinerComponent from './StartMinerComponent'
import Loading from '../Loading/LoadingComponent'
import smi from '../../app/Nvidia/Smi'
import ps from 'ps-node'

export default {
  name: 'mining',
  components: { Navigation, Loading, MinerStatsComponent, StartMinerComponent },

  data () {
    return {
      loading: {
        state: true,
        message: 'Loading Miner...'
      },
      output: {},
      process: false,
      runningHeading: 'Not running',
      error: ''
    }
  },

  mounted () {
    this.$bus.$emit('stopInterval')
    // Check if miner is already running
    this.isRunning()
    // Recieve event bus
    this.$bus.$on('isRunning', event => this.isRunning())
    this.$bus.$on('toggleLoading', message => this.toggleLoading(message))
  },

  methods: {
    stopMiner () {
      this.toggleLoading('Stopping Miner')
      this.killProcess()
    },

    isRunning () {
      // Get the active processes per GPU
      // and check if claymore is running
      smi((err, data) => {
        if (err) {
          this.error = err
          throw new Error(err)
        }
        var gpu = data.nvidia_smi_log.gpu
        var processes

        // Check if there are more then 1 GPU on  the system
        // and return the processes
        if (Array.isArray(gpu) === true) {
          processes = gpu[ 0 ].processes.process_info
        } else {
          processes = gpu.processes.process_info
        }

        // Check the response if Claymore is running
        const response = this.search(processes, 'EthDcrMiner64.exe')
        console.log(response)
        if (response.length > 0) {
          this.$bus.$emit('startInterval')
          this.runningHeading = 'Currently mining ETH'
          this.process = response[ 0 ]
        } else {
          this.process = false
        }
        this.loading.state = false
      })
    },

    killProcess () {
      const pid = this.process.pid
      this.process = false
      var kill = new Promise((resolve, reject) => {
        ps.kill(pid, {
          timeout: 3
        }, (error) => { if (error) console.log('killprocess: ' + error); resolve() })
      })
      kill.then((resolve) => {
        this.toggleProcess(false)
        this.$bus.$emit('stopTimeout')
        this.isRunning()
      })
    },

    toggleLoading (message) {
      this.loading = {
        state: true,
        message: message
      }
    },

    toggleProcess (value) {
      this.process = value
      this.runningHeading = 'Not running'
    }
  }
}
</script>