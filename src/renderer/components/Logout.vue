<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
            <Navigation></Navigation>
        </div>
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Mining - <small class="category">Mining</small></h4>
            </div>
            <div class="card-content text-center">
                <button class="btn btn-danger btn-round btn-fab btn-fab-mini" style="width:120px; height:120px;">
                  <i class="material-icons" style="font-size:70px; top: 48%; left: 32%;">warning</i>
                  <div class="ripple-container"></div>
                </button>
                <h3>Are you sure you want to <code>CLOSE</code> this app?</h3>
                <button class="btn btn-danger">
                  <i class="material-icons">close</i> Yes, take me out of here
                  <div class="ripple-container"></div>
                </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation/NavigationComponent'

export default {
  name: 'logout',
  components: { Navigation },

  data () {
    return {
      deleteStore: false
    }
  },
  methods: {
    logout () {

    },
    removeData () {

    }
  }
}
</script>