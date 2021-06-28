<template>
    <div id="app">
        <TradingView elementsId="tradingview_container" />
    </div>
</template>

<script>
export default {
    name: "App",
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

html, body, #app, .trading-wrap, .trading-container, .trading-chart {
    width: 100%;
    height: 100%;
}
</style>