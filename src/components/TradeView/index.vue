<template>
  <div id="tradingView_container" style="width: 100%; height: 100%">
  </div>
</template>

<script>
import Tv from './script'
import {TvConfigInfo } from "./script/config"
export default {
  mounted() {
    Tv.init(TvConfigInfo, null);
  }
}
</script>

<style scoped>
#tv_chart_container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>

