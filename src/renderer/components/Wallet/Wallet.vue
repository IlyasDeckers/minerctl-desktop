<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-10 col-sm-12 col-lg-offset-1">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="card card-profile">
              <div class="card-header">
                <h4 class="card-title text-left">Wallet - <small class="category">Transactions</small></h4>
              </div>
              <div class="card-content" v-show="loading.state">
                <p class="text-center"><Loading :message="loading.message"></Loading></p>
              </div>

              <div class="card-content" v-show="!loading.state">

                <div class="col-md-8" style="text-align: initial;margin-top:10px;">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class="text-primary">
                        <tr><th>From</th>
                          <th>To</th>
                          <th>Tx</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="transaction in transactions">
                          <td>{{ truncate(transaction.from, 10) }}</td>
                          <td>{{ truncate(transaction.to, 10) }}</td>
                          <td>{{ truncate(transaction.hash, 15) }}</td>
                          <td v-if="transaction.way === '+'" class="text-success">{{ transaction.way + ' ' + roundNumber(transaction.value, 4) }}</td>
                          <td v-if="transaction.way === '-'" class="text-danger">{{ transaction.way + ' ' + roundNumber(transaction.value, 4) }}</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-md-4" v-show="!loading.state">
                <div class="card-avatar" style="margin: -20px auto 0;">
                  <a href="#pablo">
                    <img class="img" src="~@/assets/logo.png">
                  </a>
                </div>
                <div  style="margin-top:20px;">
                <h4 class="card-title">{{ roundNumber(wallet.value, 4) }} ETH</h4>
                <div class="col-md-6">
                  <p>{{ roundNumber(wallet.value_eur, 2) }} EUR</p>
                </div>
                <div class="col-md-6">
                  <p>{{ roundNumber(wallet.value_usd, 2) }} USD</p>
                </div>
                <a href="#pablo" class="btn btn-rose btn-round">Deposit</a>
                </div>
              </div>
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
import Loading from '../Loading/LoadingComponent'

export default {
  name: 'wallet',
  components: { Navigation, Loading },
  data () {
    return {
      wallets: {},
      wallet: '',
      transactions: {},
      temp: {},
      loading: {
        state: true,
        message: 'Loading Wallet'
      }
    }
  },

  mounted () {
    this.getWallets()
  },

  methods: {
    getWallets () {
      this.request('wallets', 'wallets')
    },

    getWallet () {
      console.log('getWallet triggered')
      this.request('wallet/', 'wallet', this.wallets[ 0 ].address)
    },

    check () {
      if (this.wallet !== '' && this.wallets !== {}) {
        this.loading.state = false
      } else {
        this.getWallet()
        this.getTransactions()
        setTimeout(() => {
          this.check()
        }, 2000)
      }
    },

    getTransactions () {
      this.request('wallet/transactions/', 'transactions', this.wallets[ 0 ].address)
    },

    request (url, key, params = '') {
      this.$http.get(url + params).then(response => {
        this[key] = response.data

        if (key === 'transactions') {
          response.data.forEach((data) => {
            if (data.to.toLowerCase() === this.wallets[ 0 ].address.toLowerCase()) {
              data.way = '+'
            } else {
              data.way = '-'
            }
          })
        }
        if (key === 'wallets') {
          this.check()
        }
      })
    }
  }
}
</script>
