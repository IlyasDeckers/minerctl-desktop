<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
            <Navigation></Navigation>
        </div>
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Home - <small class="category">Dashboard</small></h4>
            </div>
            <div class="card-content">
                Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits.
                <br />
                <br /> Dramatically visualize customer directed convergence without revolutionary ROI.
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation/NavigationComponent'

export default {
  name: 'dashboard',
  components: { Navigation },
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