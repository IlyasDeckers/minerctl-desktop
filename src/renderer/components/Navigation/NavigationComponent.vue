<template>
  <div>
    <ul class="nav nav-pills nav-pills-primaryinfo nav-pills-icons" role="tablist">
                  <!--
      color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger"
  -->
      <li  v-show="menu.home === 'true'" v-bind:class="{ active : route.path === '/dashboard'}">
          <router-link to="/dashboard">
              <i class="material-icons">home</i> Home
          </router-link>
      </li>
      <li  v-show="menu.wallet === 'true'" v-bind:class="{ active : route.path === '/wallet'}">
          <router-link to="/wallet">
              <i class="material-icons">account_balance_wallet</i> Wallet
          </router-link>
      </li>
      <li v-show="menu.mining === 'true'" v-bind:class="{ active : route.path === '/mining'}">
          <router-link to="/mining" role="tab" data-toggle="tab">
              <i class="material-icons">gavel</i> Miner
          </router-link>
      </li>
      <li  v-show="menu.system === 'true'" v-bind:class="{ active : route.path === '/system'}">
          <router-link to="/system">
              <i class="material-icons">info</i> System
          </router-link>
      </li>
      <li v-bind:class="{ active : route.path === '/settings'}">
          <router-link to="/settings" role="tab" data-toggle="tab">
              <i class="material-icons">settings</i> Settings
          </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        route: {
          path: ''
        },
        menu: {
          home: true,
          wallet: true,
          mining: true,
          system: true,
          settings: true
        }
      }
    },

    mounted () {
      this.route.path = this.$route.path
      this.reloadNavigation()
      this.$bus.$on('reloadNavigation', event => {
        this.reloadNavigation()
      })
    },

    methods: {
      reloadNavigation () {
        this.menu.home = localStorage.getItem('menuHome')
        this.menu.wallet = localStorage.getItem('menuWallet')
        this.menu.mining = localStorage.getItem('menuMining')
        this.menu.system = localStorage.getItem('menuSystem')
        this.menu.settings = localStorage.getItem('menuSettings')
      }
    }
  }
</script>
