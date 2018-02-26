<template>
  <div class="col-md-10 col-md-offset-1">
   <div class="card" style="margin-top:120px;">
    <div class="card-header card-header-icon" data-background-color="rose">
      <i class="material-icons">perm_identity</i>
    </div>
    <div class="card-content">
      <h4 class="card-title">Enter your api key -
        <small class="category"></small>
      </h4>
      <form @submit.prevent="key()" class="form-horizontal">
      <div class="row">
        <div class="col-md-12">
          <label class="col-sm-2 label-on-left">API Key</label>
          <div class="form-group label-floating is-empty">
            <div class="col-md-9">
              <label class="control-label"></label>
              <input class="form-control" v-model="auth.apiKey" style="cursor: auto;" type="text">
              <span class="material-input"></span>
            </div>
          </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-rose">Connect<div class="ripple-container"></div></button>
          </div>
        </div>
      </form>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'landing-page',
  data () {
    return {
      auth: {
        apiKey: ''
      }
    }
  },
  mounted () {
    if (localStorage.getItem('apiKey') !== null) { this.$router.push('mining') }

    if (localStorage.getItem('menuHome') === null) {
      localStorage.setItem('menuWallet', true)
      localStorage.setItem('menuMining', true)
      localStorage.setItem('menuSettings', true)
      localStorage.setItem('menuSystem', false)
      localStorage.setItem('menuHome', false)
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },

    key () {
      localStorage.setItem('apiKey', this.auth.apiKey)
      location.reload()
    }
  }
}
</script>