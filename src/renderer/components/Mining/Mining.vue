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
      pid: '',
      runningHeading: 'Not running',
      error: ''
    }
  },

  mounted () {
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
      // Stop the interval everytime the component is loaded,
      // to prevent dubble/triple/... requests (hack!)
      this.$bus.$emit('stopInterval')
      // Get the active processes per GPU
      // and check if claymore is running
      smi((err, data) => {
        if (err) {
          this.error = err
          throw new Error(err)
        }
        // Get the GPUs installed on the host and send
        // this to StartMiner.
        var gpu = data.nvidia_smi_log.gpu
        this.$bus.$emit('setGpus', gpu)
        // Filter the GPUs processess for running
        // Claymore processess. This sets the process and
        // pid data.
        this.filterGpus(gpu)
        // Disable loading and show stats mining component
        this.loading.state = false
      })
    },

    killProcess () {
      this.process = false
      var kill = new Promise((resolve, reject) => {
        ps.kill(this.pid, {
          timeout: 3
        }, (error) => { if (error) console.log('killprocess: ' + error); resolve() })
      })
      kill.then((resolve) => {
        this.toggleProcess(false)
        this.$bus.$emit('stopInterval')
        this.isRunning()
      })
    },

    filterGpus (gpu) {
      const remote = require('electron').remote
      const app = remote.app
      const processPath = app.getPath('documents') + '\\minerctl\\bin\\Claymore_v10.0\\EthDcrMiner64.exe'
      console.log(gpu)
      const claymoreProcess = gpu.filter((g, index) => {
        try {
          if (typeof g.processes.process_info.pid !== 'undefined') {
            this.setPid(g.processes.process_info, processPath)
          } else if (g.processes !== 'N/A' || typeof g.processes.process_info !== 'undefined') {
            g.processes.process_info.forEach((process) => {
              this.setPid(process, processPath)
            })
          }
        } catch (err) {
          console.log('Error searching pid: ' + err)
          return false
        }

        if (this.pid !== '') {
          console.log('pid set: ' + this.pid)
          return true
        } else {
          console.log('pid not found')
          return false
        }
      })

      if (claymoreProcess[0]) {
        console.log('Claymore process found')
        this.process = true
        this.$bus.$emit('startInterval')
        this.runningHeading = 'Currently mining Ethereum'
      }
    },

    setPid (process, processPath) {
      if (process.process_name === processPath) {
        this.pid = process.pid
      }
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