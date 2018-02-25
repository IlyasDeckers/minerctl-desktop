<template>
 <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-content" v-show="loading.state">
                <p class="text-center"><Loading :message="loading.message"></Loading></p>
              </div>
              <div class="card-content">
                <h4 class="card-title">Generate a new ethereum wallet-
                  <small class="category">Keep this information in a secure place</small>
                </h4> 
                <div class="col-md-8" v-show="request">
                  <form @submit.prevent="generateAddress()" class="form-horizontal">
                    <div class="row">
                    <label class="col-md-3 label-on-left">Password</label>
                    <div class="col-md-9">
                      <div class="form-group label-floating is-empty">
                          <label class="control-label"></label>
                          <input class="form-control" type="password" v-model="wallet.password" required>
                      <span class="material-input"></span></div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group form-button text-center">
                            <button type="submit" class="btn btn-fill btn-rose">Generate Wallet</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="col-md-12" v-show="download">
                  <div class="row">
                    <div >
                      <h2 class="text-center">Save your <code>Keystore</code> File.</h2>
                      <p class="text-center"><b>Do not lose this file and chosen password!</b> It cannot be recovered! </p>
                    </div>
                    <pre>{{ wallet.encrypted }}</pre>
                  </div>
                </div>
                <div class="col-md-4" v-show="request">
                  <blockquote>We cannot recover your funds or freeze your account... <a href="#" data-toggle="modal" data-target="#secwarn">Read More</a></blockquote>
                </div>

              </div>
              <!-- notice modal -->
              <div class="modal fade" id="secwarn" tabindex="-1" role="dialog" aria-labelledby="secwarn" aria-hidden="false">
                <div class="modal-dialog modal-notice">
                  <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"><i class="material-icons">clear</i></button>
                    <h5 class="modal-title" id="myModalLabel">Security Disclaimer</h5>
                  </div>
                  <div class="modal-body">
                    <div class="instruction">
                      <div class="row">
                          <div class="col-md-12">
                              <strong>You and only you are responsible for your security.</strong>
                              <ul>
                                  <li>Be diligent to keep your private key and password safe. Your private key is sometimes called your mnemonic phrase, keystore file, UTC file, JSON file, wallet file.</li>
                                  <li>If you lose your private key or password, no one can recover it.</li>
                                  <li>If you enter your private key on a phishing website, you will have <b>all your funds taken.</b></li>
                              </ul>

                          </div>
                      </div>
                    </div>
                    <div class="instruction">
                      <div class="row">
                          <div class="col-md-12">
                              <strong>Storing the keys</strong>
                              <p>We never transmit, receive or store your private key, password, or other account information. The handling of your keys happens entirely on your computer, inside your browser. Your keys will be displayed one time. It is your responsibility to store them securely.</p>
                          </div>
                      </div>
                   </div>
                    <div class="instruction">
                      <div class="row">
                          <div class="col-md-12">
                              <strong>Sending keys</strong>
                              <p>If you send your private key to someone, they now have full control of your account. If you send your public key (address) to someone, they can send you ETH or tokens.</p>
                          </div>
                      </div>
                    </div>
                   </div>
                    <div class="modal-footer text-center">
                      <a href="button" class="btn btn-rose btn-round" data-dismiss="modal">I Understand</a>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end notice modal -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '../Loading/LoadingComponent'
import Navigation from '../Navigation/NavigationComponent'

export default {
  components: { Navigation, Loading },
  data () {
    return {
      wallet: {
        privateKey: '',
        address: '',
        password: '',
        encrypted: {}
      },
      download: false,
      request: true,
      loading: {
        state: false,
        message: 'Loading Wallet'
      }
    }
  },
  mounted () {
  },
  methods: {
    generateAddress () {
      var response = this.$web3.eth.accounts.create()
      var wallet = this.wallet

      wallet.privateKey = response.privateKey
      wallet.address = response.address

      this.encryptPrivatekey()
    },
    encryptPrivatekey () {
      this.wallet.encrypted = this.$web3.eth.accounts.encrypt(this.wallet.privateKey, this.wallet.password)
      this.wallet.privateKey = ''
      this.wallet.password = ''

      this.download = true
      this.request = false
    }
  }
}
</script>