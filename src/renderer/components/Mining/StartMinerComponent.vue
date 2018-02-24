<template>
<div>
  <form @submit.prevent="startMiner()" class="form-horizontal">
    <div class="row">
      <label class="col-sm-2 label-on-left">Pool</label>
      <div class="col-sm-9">
        <div class="form-group label-floating is-empty">
          <label class="control-label"></label>
          <input class="form-control" value="Ethermine" name="Username" type="text" disabled required>
          <span class="material-input"></span>
        </div>
      </div>
      <label class="col-sm-2 label-on-left">Rig Name</label>
      <div class="col-sm-9">
        <div class="form-group label-floating is-empty">
          <label class="control-label"></label>
          <input class="form-control" v-model="rigName" name="rigName" type="text" required>
          <span class="material-input"></span>
        </div>
      </div>
      <label class="col-sm-2 label-on-left">Wallet Address</label>
      <div class="col-sm-9">
        <div class="form-group label-floating is-empty">
          <label class="control-label"></label>
          <select class="form-control" v-model="wallet" required>
            <option v-for="wallet in wallets" :value="wallet">{{ wallet.address }}</option>
          </select>
        </div>
      </div>
      <label class="col-sm-2 label-on-left">Select GPU's</label>
      <div class="col-sm-9">
        <div class="col-sm-6" v-for="(gpu,index)  in gpus">
          <div class="togglebutton">
            <label>
              <input type="checkbox" v-model="startGpus[index]" checked=""><span class="toggle"></span> {{ gpu.product_name }}
            </label>
          </div>
        </div>
        
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group form-button text-center">
          <button type="submit" class="btn btn-fill btn-info">Start Miner<div class="ripple-container"></div></button>
        </div>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import childProcess from 'child_process'
import LoadingComponent from '../Loading/LoadingComponent'

export default {
  components: { LoadingComponent },
  data () {
    return {
      wallets: {},
      wallet: '',
      rigName: '',
      pool: '',
      gpus: {},
      startGpus: {}
    }
  },

  mounted () {
    this.getWallets()
    this.$bus.$on('setGpus', data => {
      if (data[ 0 ] === undefined) {
        data = {
          data
        }
      }
      this.gpus = data
    })
  },

  methods: {
    getWallets () {
      this.request('wallets', 'wallets')
    },

    request (url, key, params = '') {
      this.$http.get(url + params).then(response => {
        this[key] = response.data
      }).catch(err => {
        alert(err)
      })
    },

    startMiner () {
      localStorage.setItem('currentMiningAddress', this.wallet.address)
      if (this.wallet.currency === 'eth') { this.pool = 'eu1.ethermine.org:4444' }
      if (this.wallet.currency === 'etc') { this.pool = 'eu1-etc.ethermine.org:4444' }

      this.$bus.$emit('toggleLoading', 'Starting Miner')
      localStorage.setItem('rigName', this.rigName)

      var gpus = []
      Object.keys(this.startGpus).forEach((i) => {
        if (this.startGpus[i] === true) gpus.push(i)
      })

      const spawn = childProcess.spawn
      const remote = require('electron').remote
      const app = remote.app
      spawn('cmd.exe', [
        '/c', app.getPath('documents') + '\\minerctl\\bin\\Claymore_v10.0\\EthDcrMiner64.exe -epool ' + this.pool + ' -ewal ' + this.wallet.address + '.' + this.rigName + ' -di ' + gpus + ' -epsw x -mode 1 -allpools 1'
      ], { detached: true })

      setTimeout(data => {
        this.$bus.$emit('isRunning')
      }, 10000)

      this.loading = {
        state: false,
        message: 'Starting Miner'
      }
    }
  }
}
</script>