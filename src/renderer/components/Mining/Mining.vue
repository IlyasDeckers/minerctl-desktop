<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-10 col-sm-12 col-lg-offset-1">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        <div class="row">
          <MinerStatsComponent v-show="process || !loading"></MinerStatsComponent>
          <div class="col-md-12" v-show="!process">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Mining - <small class="category">{{ runningHeading }}</small></h4>
              </div>
              <div class="card-content" v-show="!loading.state">
                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                <StartMinerComponent v-show="!process"></StartMinerComponent>
                
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
      runningHeading: 'Not running'
    }
  },

  mounted () {
    // Check if miner is already running
    this.isRunning()
    // Recieve event bus
    this.$bus.$on('isRunning', event => this.isRunning())
    this.$bus.$on('toggleLoading', message => this.toggleLoading(message))
    this.$bus.$on('stopMiner', event => this.stopMiner())
    this.$bus.$on('restartMiner', event => this.restartMiner())
    this.$bus.$on('error', error => { this.error = error })
  },

  methods: {
    stopMiner () {
      this.toggleLoading('Stopping Miner')
      this.killProcess()
    },

    restartMiner () {
      this.toggleLoading('Restarting Miner')
      this.killProcess()
      setTimeout(() => {
        this.$bus.$emit('startMiner')
      }, 3000)
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
        if (this.process === true) {
          this.runningHeading = 'Currently mining Ethereum'
        } else {
          this.runningHeading = 'Not running'
        }
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
      const claymoreProcess = new Promise((resolve, reject) => {
        gpu.filter((g, index) => {
          this.pid = ''
          try {
            // The returned Array can be multidiensional
            // if there are multiple processes on one GPU
            this.detectGpuArrays(g)
          } catch (err) {
            // No such process in this array
            console.log('Error searching pid: ' + err)
          }

          if (this.pid !== '') {
            console.log('pid set: ' + this.pid)
            resolve()
          }
        })
      })

      claymoreProcess.then(() => {
        console.log('response')
        this.$bus.$emit('startInterval')
      })
    },

    detectGpuArrays (g) {
      const remote = require('electron').remote
      const app = remote.app
      const processPath = app.getPath('documents') + '\\minerctl\\bin\\Claymore_v10.0\\EthDcrMiner64.exe'
      if (typeof g.processes.process_info.pid !== 'undefined') {
        this.setPid(g.processes.process_info, processPath)
      } else if (g.processes !== 'N/A' || typeof g.processes.process_info !== 'undefined') {
        g.processes.process_info.forEach((process) => {
          this.setPid(process, processPath)
        })
      }
    },

    setPid (process, processPath) {
      if (process.process_name === processPath) {
        this.pid = process.pid
        this.process = true
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