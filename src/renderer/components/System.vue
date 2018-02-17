<style>
  .cpu-processor {
    width: 50px;
    vertical-align: middle;
  }
  .svg-icon {
    display: initial;
    width: 50px;
    height: 50px;
    color: inherit;
    vertical-align: middle;
    margin: 20px;
  } 
</style>
<template>
  <div class="col-md-12 ">
    <div class="row">
      <div class="col-md-12 col-lg-8 col-lg-offset-2">
        <div class="nav-center">
          <Navigation></Navigation>
        </div>
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">System - <small class="category">System</small></h4>
          </div>

          <div class="card-content">
            <div class="row">
              <div class="col-md-4">
                <ul class="nav nav-pills nav-pills-icons nav-pills-info nav-stacked" role="tablist">
                  <li class="active">
                    <a href="#CPU" role="tab" data-toggle="tab">
                      <div class="svg-icon cpu-processor">
                        <svgicon color="#fff" class="cpu-processor" icon="chip"></svgicon>  
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#GPU" role="tab" data-toggle="tab">
                      <div class="svg-icon cpu-processor">
                        <svgicon color="#555555" class="cpu-processor" icon="gfx-card"></svgicon>  
                      </div> 
                    </a>
                  </li>
                  <li>
                    <a href="#schedule-2" role="tab" data-toggle="tab">
                      <div class="svg-icon cpu-processor">
                        <svgicon color="#555555" class="cpu-processor" icon="cooling-fan"></svgicon>  
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-md-8">
                <div class="tab-content">
                  <div class="tab-pane active" id="CPU">
                    CPU Info
                  </div>
                  <div class="tab-pane" id="GPU">
                    <div class="form-group label-floating is-empty">
                      <label class="control-label"></label>
                      <select class="form-control"name="apiKey">
                        <option v-for="gpu in gpus">{{ gpu.Caption }}</option>
                      </select>
                      <span class="material-input"></span>
                    </div>
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
import Navigation from './Navigation/NavigationComponent'
import '../assets/icons'

export default {
  name: 'system',
  components: { Navigation },

  data () {
    return {
      gpus: {}
    }
  },

  mounted () {
    this.getGpuInfo()
  },

  methods: {
    getGpuInfo () {
      var self = this
      const gpuInfo = require('gpu-info')

      gpuInfo().then(function (data) {
        self.gpus = data
      })
    }
  }
}
</script>