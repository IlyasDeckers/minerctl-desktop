<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Settings - <small class="category">Dashboard</small></h4>
          </div>
          <div class="text-center" v-show="loading.state">
            <Loading :message="loading.message"></Loading>
          </div>
          <div class="card-content" v-show="!loading.state">
            <form class="form-horizontal">
              <div class="row">
                <label class="col-sm-2 label-on-left">Username</label>
                <div class="col-sm-9">
                  <div class="form-group label-floating is-empty">
                    <label class="control-label"></label>
                    <input class="form-control" v-model="user.name" name="Username" type="text" disabled>
                    <span class="material-input"></span>
                  </div>
                </div>
                <label class="col-sm-2 label-on-left">Email</label>
                <div class="col-sm-9">
                  <div class="form-group label-floating is-empty">
                    <label class="control-label"></label>
                    <input class="form-control" v-model="user.email" name="Email" type="email" disabled>
                    <span class="material-input"></span>
                  </div>
                </div>
                <label class="col-sm-2 label-on-left">API Key</label>
                <div class="col-sm-9">
                  <div class="form-group label-floating is-empty">
                    <label class="control-label"></label>
                    <input class="form-control" v-model="apiKey" name="apiKey" :type="input.typeApi">
                    <span class="material-input"></span>
                  </div>
                </div>
                <label class="col-sm-1 label-on-right" style="padding: 11px 0 0 5px;">
                  <a class="btn btn-fill btn-info btn-xs" @click="showApiKey">{{ viewButton }}</a>
                </label>
              </div>
              <div class="row">
                <label class="col-sm-2 label-on-left">Edit Menu</label>
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
              <div class="row">
                <label class="col-md-2"></label>
                <div class="col-md-9">
                  <div class="form-group form-button text-center">
                    <a @click="saveSettings()" class="btn btn-fill btn-info">Save Settings<div class="ripple-container"></div></a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation/NavigationComponent'
import Loading from './Loading/LoadingComponent'
import Backend from '../app/Backend/Backend'

export default {
  name: 'settings',
  components: { Navigation, Loading },

  data () {
    return {
      apiKey: localStorage.getItem('apiKey'),
      viewButton: 'View',
      input: {
        typeApi: 'password'
      },
      menu: {
        home: Boolean(JSON.parse((localStorage.getItem('menuHome').toString()).toLowerCase())),
        wallet: Boolean(JSON.parse((localStorage.getItem('menuWallet').toString()).toLowerCase())),
        mining: Boolean(JSON.parse((localStorage.getItem('menuMining').toString()).toLowerCase())),
        system: Boolean(JSON.parse((localStorage.getItem('menuSystem').toString()).toLowerCase())),
        settings: Boolean(JSON.parse((localStorage.getItem('menuSettings').toString()).toLowerCase()))
      },
      user: {
        name: '',
        email: ''
      },
      loading: {
        state: true,
        message: 'Loading'
      },
      response: {}
    }
  },

  mounted () {
    this.getUser()
  },

  methods: {
    getUser () {
      let b = new Backend()
      b.request('user')
      this.user = b.response
      this.loading.state = false
    },
    saveSettings () {
      // store the api key
      localStorage.setItem('apiKey', this.apiKey)

      localStorage.setItem('menuHome', this.menu.home)
      localStorage.setItem('menuWallet', this.menu.wallet)
      localStorage.setItem('menuMining', this.menu.mining)
      localStorage.setItem('menuSystem', this.menu.system)
      localStorage.setItem('menuSettings', this.menu.settings)

      this.$bus.$emit('reloadNavigation')
    },
    showApiKey () {
      if (this.input.typeApi === 'password') {
        this.input.typeApi = 'text'
        this.viewButton = 'hide'
      } else {
        this.input.typeApi = 'password'
        this.viewButton = 'show'
      }
    }
  }
}
</script>