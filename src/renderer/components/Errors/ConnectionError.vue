<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div class="card" style="color: rgba(60, 72, 88, 0.49);">
            <div class="card-content">
              <div class="text-center">
                <i class="material-icons" style="font-size: 185px;">error_outline</i>
                <h1><code>ConnectionError</code></h1>
                <p>Cannot connect to the main server. Please check your internet connection</p>
              </div>
              <div class="form-group form-button text-center">
                <router-link to="/dashboard" class="btn btn-fill btn-info">Retry<div class="ripple-container"></div></router-link>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectionError',
  data () {
    return {}
  }
}
</script>