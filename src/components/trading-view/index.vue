<template>
    <div class="trading-wrap">
        <div class="trading-container">
            <div class="trading-chart" :id="elementsId"></div>
        </div>
    </div>
</template>

<script>
import Tv from './script'
import { TvConfigInfo, KlineEx_Dark } from "./script/config"

export default {
    name: "trading-view",
    props: {
        elementsId: {
            type: String,
            default: "",
            required: true
        },
    },
    data () {
        return {
            tradingView: null,
            klineInterval: "1"
        }
    },
    computed: {
        tvInfo() {
            return { ...TvConfigInfo, ...KlineEx_Dark }
        },
    },
    mounted () {
        this.tradingView = new Tv(this.tvInfo, null, this.elementsId);
    },
}
</script>
