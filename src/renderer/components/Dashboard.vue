<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">

        <ul class="nav nav-pills nav-pills-info nav-pills-icons" role="tablist">
          <li  >
              <router-link to="/dashboard">
                  <i class="material-icons">home</i> Home
              </router-link>
          </li>
          <li >
              <router-link to="/wallet">
                  <i class="material-icons">account_balance_wallet</i> Wallet
              </router-link>
          </li>
          <li >
              <router-link to="/mining" role="tab" data-toggle="tab">
                  <i class="material-icons">gavel</i> Miner
              </router-link>
          </li>
          <li>
              <router-link to="/settings" role="tab" data-toggle="tab">
                  <i class="material-icons">settings</i> Settings
              </router-link>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'dashboard',
  data () {
    return {
      auth: {
        apiKey: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    logout () {
      localStorage.removeItem('apiKey')
      this.$router.push({ name: 'landing-page' })
    },

    getUser () {
    }
  }
}
</script>