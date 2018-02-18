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
        <div class="col-sm-2">
          <div class="togglebutton">
            <label>
              <input type="checkbox" checked="" v-model="menu.home"><span class="toggle"></span> Home
            </label>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="togglebutton">
            <label>
              <input type="checkbox" checked="" v-model="menu.wallet"><span class="toggle"></span> Wallet
            </label>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="togglebutton">
            <label>
              <input type="checkbox" checked="" v-model="menu.mining"><span class="toggle"></span> Mining
            </label>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="togglebutton">
            <label>
              <input type="checkbox" checked="" v-model="menu.system"><span class="toggle"></span> System
            </label>
          </div>
        </div>
      </div>
      <label class="col-sm-1 label-on-right" style="padding: 11px 0 0 5px;">
        <a class="btn btn-fill btn-info btn-xs">Create</a>
      </label>
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
      pool: ''
    }
  },

  mounted () {
    this.getWallets()
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

      var spawn = childProcess.spawn
      spawn('cmd.exe', [
        '/c', 'C:\\Claymore_v10.0\\EthDcrMiner64.exe -epool ' + this.pool + ' -ewal ' + this.wallet.address + '.' + this.rigName + ' -epsw x -mode 1 -allpools 1'
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