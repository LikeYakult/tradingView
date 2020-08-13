<template>
  <div id="app">
    <TradeView/>
  </div>
</template>

<script>
import TradeView from './components/TradeView'

export default {
  name: 'App',
  components: {
    TradeView
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
