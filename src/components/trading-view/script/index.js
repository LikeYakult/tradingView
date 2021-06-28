import {widget as TvWidget} from '../../../../public/charting_library/charting_library.min';
import Vue from "vue";
import DataFeed from "./datafeed";

const doc = (dom) => document.querySelector(dom);
const docEle = document.documentElement;
const metaInterval = ["1D", "1W", "1M"];


export default class TradingViewMain {
    widget = null;
    dataFeed = null;
    vue = null;
    ws = null;
    dataCache = {};
    cancelSendObj = "";
    styles = "";
    resolution = "";
    historyType = "";

    constructor(options, ws, id) {
        this.styles = options.styles;
        this.ws = ws;
        this.vue = new Vue();
        this.dataCache = {};
        this.dataFeed = new DataFeed(this, options);
        this.widget = new TvWidget({
            symbol: options.symbol,
            interval: options.interval,
            container_id: id,
            datafeed: this.dataFeed,
            library_path: '/charting_library/',
            fullscreen: false,
            disabled_features: [
                'header_chart_type',
                'header_symbol_search',
                'volume_force_overlay',
                'header_resolutions',
                'header_settings',
                // 'edit_buttons_in_legend',
                'header_compare',
                'header_undo_redo',
                'header_screenshot',
                'use_localstorage_for_settings',
                'timeframes_toolbar',
                'header_widget'
            ],
            enabled_features: [
                "header_fullscreen_button",
                "dont_show_boolean_study_arguments",
                "remove_library_container_border",
                "save_chart_properties_to_local_storage",
                "side_toolbar_in_fullscreen_mode",
                "hide_last_na_study_output",
                "constraint_dialogs_movement",
                "keep_left_toolbar_visible_on_small_screens",
                "hide_left_toolbar_by_default",
            ],
            numeric_formatting: {
                decimal_sign: '.'
            },
            timezone: options.timezone,
            locale: options.language,
            customFormatters: {
                dateFormatter: {
                    format: (date) => date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate()
                }
            },
            debug: false,
            autosize: true,
            allow_symbol_change: true,
            drawings_access: {
                type: 'black',
                tools: [
                    {name: "Trend Line", grayed: true},
                    {name: "Trend Angle", grayed: true}
                ]
            },
            studies_overrides: {
                "volume.volume.color.0": options.fallColor,
                "volume.volume.color.1": options.riseColor,
                "volume.volume.transparency": "53",
                // "volume.volume ma.plottype": "line"
            },
            overrides: {
                "volumePaneSize": "medium",
                "symbolWatermarkProperties.color": "rgba(0,0,0, 0)",
                "paneProperties.background": options.chartColor,
                "paneProperties.vertGridProperties.color": options.gridColor,
                "paneProperties.horzGridProperties.color": options.gridColor,
                "paneProperties.crossHairProperties.color": options.crossover,
                "paneProperties.crossHairProperties.style": 'LINESTYLE_DASHED',
                "mainSeriesProperties.style": options.mainSeriesProperties,
                "mainSeriesProperties.showCountdown": false,
                "scalesProperties.showSeriesLastValue": true,
                "mainSeriesProperties.visible": true,
                "mainSeriesProperties.showPriceLine": true,
                "mainSeriesProperties.priceLineWidth": 1,
                "mainSeriesProperties.minTick": "default",
                "mainSeriesProperties.extendedHours": false,
                "editorFontsList": ["Lato", "Arial", "Verdana", "Courier New", "Times New Roman"],
                "paneProperties.topMargin": 10,
                "paneProperties.bottomMargin": 5,
                "paneProperties.leftAxisProperties.autoScale": true,
                "paneProperties.leftAxisProperties.autoScaleDisabled": false,
                "paneProperties.leftAxisProperties.percentage": false,
                "paneProperties.leftAxisProperties.percentageDisabled": false,
                "paneProperties.leftAxisProperties.log": false,
                "paneProperties.leftAxisProperties.logDisabled": false,
                "paneProperties.leftAxisProperties.alignLabels": true,
                "paneProperties.legendProperties.showStudyArguments": true,
                "paneProperties.legendProperties.showStudyTitles": true,
                "paneProperties.legendProperties.showStudyValues": true,
                "paneProperties.legendProperties.showSeriesTitle": true,
                "paneProperties.legendProperties.showSeriesOHLC": true,
                "scalesProperties.showLeftScale": false,
                "scalesProperties.showRightScale": true,
                "scalesProperties.backgroundColor": options.chartColor,
                "scalesProperties.lineColor": options.lineColor,
                "scalesProperties.textColor": options.textColor,
                "scalesProperties.scaleSeriesOnly": true,
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                "mainSeriesProperties.priceAxisProperties.autoScaleDisabled": false,
                "mainSeriesProperties.priceAxisProperties.percentage": false,
                "mainSeriesProperties.priceAxisProperties.percentageDisabled": false,
                "mainSeriesProperties.priceAxisProperties.log": false,
                "mainSeriesProperties.priceAxisProperties.logDisabled": false,
                "mainSeriesProperties.candleStyle.upColor": options.riseColor,
                "mainSeriesProperties.candleStyle.downColor": options.fallColor,
                "mainSeriesProperties.candleStyle.drawWick": true,
                "mainSeriesProperties.candleStyle.drawBorder": false,
                "mainSeriesProperties.candleStyle.borderColor": options.riseColor,
                "mainSeriesProperties.candleStyle.borderUpColor": options.riseColor,
                "mainSeriesProperties.candleStyle.borderDownColor": options.fallColor,
                "mainSeriesProperties.candleStyle.wickColor": options.riseColor,
                "mainSeriesProperties.candleStyle.wickUpColor": options.riseColor,
                "mainSeriesProperties.candleStyle.wickDownColor": options.fallColor,
                "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
                "mainSeriesProperties.hollowCandleStyle.upColor": options.riseColor,
                "mainSeriesProperties.hollowCandleStyle.downColor": options.fallColor,
                "mainSeriesProperties.hollowCandleStyle.drawWick": true,
                "mainSeriesProperties.hollowCandleStyle.drawBorder": false,
                "mainSeriesProperties.hollowCandleStyle.borderColor": options.riseColor,
                "mainSeriesProperties.hollowCandleStyle.borderUpColor": options.riseColor,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor": options.fallColor,
                "mainSeriesProperties.hollowCandleStyle.wickColor": options.riseColor,
                "mainSeriesProperties.hollowCandleStyle.wickUpColor": options.riseColor,
                "mainSeriesProperties.hollowCandleStyle.wickDownColor": options.fallColor,
                "mainSeriesProperties.haStyle.upColor": options.riseColor,
                "mainSeriesProperties.haStyle.downColor": options.fallColor,
                "mainSeriesProperties.haStyle.drawWick": true,
                "mainSeriesProperties.haStyle.drawBorder": false,
                "mainSeriesProperties.haStyle.borderColor": options.riseColor,
                "mainSeriesProperties.haStyle.borderUpColor": options.riseColor,
                "mainSeriesProperties.haStyle.borderDownColor": options.fallColor,
                "mainSeriesProperties.haStyle.wickColor": "#737375",
                "mainSeriesProperties.haStyle.wickUpColor": options.riseColor,
                "mainSeriesProperties.haStyle.wickDownColor": options.fallColor,
                "mainSeriesProperties.haStyle.barColorsOnPrevClose": true,
                "mainSeriesProperties.barStyle.upColor": options.riseColor,
                "mainSeriesProperties.barStyle.downColor": options.fallColor,
                "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
                "mainSeriesProperties.barStyle.dontDrawOpen": true,
                "mainSeriesProperties.lineStyle.color": "#0cbef3",
                "mainSeriesProperties.lineStyle.linestyle": 0,
                "mainSeriesProperties.lineStyle.linewidth": 1,
                "mainSeriesProperties.lineStyle.priceSource": "close",
                "mainSeriesProperties.areaStyle.color1": "#0cbef3",
                "mainSeriesProperties.areaStyle.color2": "#0098c4",
                "mainSeriesProperties.areaStyle.linecolor": "#0cbef3",
                "mainSeriesProperties.areaStyle.linestyle": 0,
                "mainSeriesProperties.areaStyle.linewidth": 1,
                "mainSeriesProperties.areaStyle.priceSource": "close",
                "mainSeriesProperties.areaStyle.transparency": 80,
            },
            custom_css_url: 'chat.css?v=20190802'
        });

        this.widget.onChartReady(() => {
            this.widget.chart().createStudy('Moving Average', false, false, [5], null, {
                'Plot.color': 'rgba(125,150,235,0.6)',
                "precision": options.precision,
            });
            this.widget.chart().createStudy('Moving Average', false, false, [10], null, {
                'Plot.color': 'rgba(58,169,194,0.6)',
                "precision": options.precision,
            });
            this.widget.chart().createStudy('Moving Average', false, false, [30], null, {
                'Plot.color': 'rgba(235,172,125,0.6)',
                "precision": options.precision,
            });
            this.widget.chart().createStudy('Moving Average', false, false, [60], null, {
                'Plot.color': 'rgba(241,75,146,0.6)',
                "precision": options.precision,
            });
        });
    }

    deleteCache(ticker) {
        let item = `${ticker}.${this.resolution}`;
        delete this.dataCache[item];
    }

    handleClearDWMResolution(options) {
        let specialMeta = options.symbol + '_' + this.widget.chart().resolution();
        if (metaInterval.includes(this.widget.chart().resolution())) this.dataFeed.unsubscribeBars(specialMeta);
    }

    handleCancelSend() {
        if (this.cancelSendObj) this.subscribeKline(this.cancelSendObj);
    }

    handleClearHistoryStatus() {
        this.historyType = "";
    }

    getBars(symbolInfo, resolution, from, to, callBack) {
        callBack && callBack({
            s: "ok", bars: [
                {
                    "time": 1443139200000,
                    "open": 239.99,
                    "close": 235.2,
                    "low": 234.81,
                    "high": 239.99,
                    "volume": 190090
                },
                {
                    "time": 1443225600000,
                    "open": 235.2,
                    "close": 234.51,
                    "low": 232.91,
                    "high": 235.36,
                    "volume": 258488
                },
                {
                    "time": 1443312000000,
                    "open": 234.51,
                    "close": 233.29,
                    "low": 233.03,
                    "high": 234.76,
                    "volume": 161013
                },
                {
                    "time": 1443398400000,
                    "open": 233.29,
                    "close": 240.07,
                    "low": 232.9,
                    "high": 243.19,
                    "volume": 319143
                },
                {
                    "time": 1443484800000,
                    "open": 240.07,
                    "close": 237,
                    "low": 235.81,
                    "high": 241.5,
                    "volume": 368771
                },
                {
                    "time": 1443571200000,
                    "open": 237,
                    "close": 236.55,
                    "low": 235.56,
                    "high": 238.2,
                    "volume": 294736
                },
                {
                    "time": 1443657600000,
                    "open": 236.55,
                    "close": 238.1,
                    "low": 234.63,
                    "high": 239.53,
                    "volume": 180356
                },
                {
                    "time": 1443744000000,
                    "open": 238.1,
                    "close": 238,
                    "low": 237.09,
                    "high": 238.99,
                    "volume": 133911
                },
                {
                    "time": 1443830400000,
                    "open": 238,
                    "close": 239.67,
                    "low": 237.53,
                    "high": 241,
                    "volume": 127411
                },
                {
                    "time": 1443916800000,
                    "open": 239.67,
                    "close": 238.58,
                    "low": 238.3,
                    "high": 239.93,
                    "volume": 148659
                },
                {
                    "time": 1444003200000,
                    "open": 238.58,
                    "close": 240.85,
                    "low": 237.77,
                    "high": 240.85,
                    "volume": 255736
                },
                {
                    "time": 1444089600000,
                    "open": 240.85,
                    "close": 247.09,
                    "low": 240.68,
                    "high": 249,
                    "volume": 536943
                },
                {
                    "time": 1444176000000,
                    "open": 247.09,
                    "close": 243.43,
                    "low": 243.43,
                    "high": 247.8,
                    "volume": 428099
                },
                {
                    "time": 1444262400000,
                    "open": 243.43,
                    "close": 243.19,
                    "low": 243,
                    "high": 245.73,
                    "volume": 393019
                },
                {
                    "time": 1444348800000,
                    "open": 243.19,
                    "close": 244.4,
                    "low": 242.99,
                    "high": 244.91,
                    "volume": 466508
                },
                {
                    "time": 1444435200000,
                    "open": 244.4,
                    "close": 246,
                    "low": 243.77,
                    "high": 246.08,
                    "volume": 300969
                },
                {
                    "time": 1444521600000,
                    "open": 246,
                    "close": 248.13,
                    "low": 245.18,
                    "high": 248.56,
                    "volume": 657289
                },
                {
                    "time": 1444608000000,
                    "open": 248.13,
                    "close": 246.38,
                    "low": 245.7,
                    "high": 248.41,
                    "volume": 710444
                },
                {
                    "time": 1444694400000,
                    "open": 246.38,
                    "close": 250.76,
                    "low": 244.47,
                    "high": 251.49,
                    "volume": 1284157
                },
                {
                    "time": 1444780800000,
                    "open": 250.76,
                    "close": 253.32,
                    "low": 249.99,
                    "high": 255.55,
                    "volume": 1196167
                },
                {
                    "time": 1444867200000,
                    "open": 253.32,
                    "close": 254.86,
                    "low": 253.04,
                    "high": 257.18,
                    "volume": 3508869
                },
                {
                    "time": 1444953600000,
                    "open": 254.86,
                    "close": 263.89,
                    "low": 254.88,
                    "high": 267.55,
                    "volume": 4632494
                },
                {
                    "time": 1445040000000,
                    "open": 263.89,
                    "close": 273.91,
                    "low": 263,
                    "high": 278.51,
                    "volume": 9988015
                },
                {
                    "time": 1445126400000,
                    "open": 273.91,
                    "close": 265.63,
                    "low": 262,
                    "high": 275.05,
                    "volume": 3216612
                },
                {
                    "time": 1445212800000,
                    "open": 265.63,
                    "close": 265.35,
                    "low": 261.55,
                    "high": 270.69,
                    "volume": 2241882
                },
                {
                    "time": 1445299200000,
                    "open": 265.35,
                    "close": 271.85,
                    "low": 264.68,
                    "high": 274.49,
                    "volume": 2770928
                },
                {
                    "time": 1445385600000,
                    "open": 271.85,
                    "close": 268.37,
                    "low": 263.88,
                    "high": 273.45,
                    "volume": 2806074
                },
                {
                    "time": 1445472000000,
                    "open": 268.37,
                    "close": 276.9,
                    "low": 267.65,
                    "high": 280,
                    "volume": 2263003
                },
                {
                    "time": 1445558400000,
                    "open": 276.9,
                    "close": 279.8,
                    "low": 275.47,
                    "high": 282.38,
                    "volume": 1898945
                },
                {
                    "time": 1445644800000,
                    "open": 279.8,
                    "close": 285.39,
                    "low": 278.35,
                    "high": 286.9,
                    "volume": 2753916
                },
                {
                    "time": 1445731200000,
                    "open": 285.39,
                    "close": 285.79,
                    "low": 282.9,
                    "high": 299.51,
                    "volume": 5663816
                },
                {
                    "time": 1445817600000,
                    "open": 285.79,
                    "close": 289.32,
                    "low": 281.01,
                    "high": 292.29,
                    "volume": 3596017
                },
                {
                    "time": 1445904000000,
                    "open": 289.32,
                    "close": 296.51,
                    "low": 286.89,
                    "high": 305.32,
                    "volume": 4671955
                },
                {
                    "time": 1445990400000,
                    "open": 296.51,
                    "close": 306.99,
                    "low": 296.6,
                    "high": 310.36,
                    "volume": 4231430
                },
                {
                    "time": 1446076800000,
                    "open": 306.99,
                    "close": 316.6,
                    "low": 303.14,
                    "high": 322,
                    "volume": 5642264
                },
                {
                    "time": 1446163200000,
                    "open": 316.6,
                    "close": 333,
                    "low": 300,
                    "high": 336.81,
                    "volume": 7526523
                },
                {
                    "time": 1446249600000,
                    "open": 333,
                    "close": 317.73,
                    "low": 307.53,
                    "high": 338.7,
                    "volume": 5842767
                },
                {
                    "time": 1446336000000,
                    "open": 317.73,
                    "close": 331.38,
                    "low": 314,
                    "high": 335,
                    "volume": 2599899
                },
                {
                    "time": 1446422400000,
                    "open": 331.38,
                    "close": 371.98,
                    "low": 326.95,
                    "high": 380,
                    "volume": 3855966
                },
                {
                    "time": 1446508800000,
                    "open": 371.98,
                    "close": 422,
                    "low": 365.18,
                    "high": 440,
                    "volume": 6102534
                },
                {
                    "time": 1446595200000,
                    "open": 422,
                    "close": 424,
                    "low": 382,
                    "high": 558,
                    "volume": 5738641
                },
                {
                    "time": 1446681600000,
                    "open": 424,
                    "close": 402,
                    "low": 375,
                    "high": 472.73,
                    "volume": 3820602
                },
                {
                    "time": 1446768000000,
                    "open": 402,
                    "close": 377.61,
                    "low": 359,
                    "high": 408.32,
                    "volume": 3353266
                },
                {
                    "time": 1446854400000,
                    "open": 377.61,
                    "close": 384.34,
                    "low": 373.91,
                    "high": 394.99,
                    "volume": 2032334
                },
                {
                    "time": 1446940800000,
                    "open": 384.34,
                    "close": 372,
                    "low": 365,
                    "high": 394.82,
                    "volume": 1938629
                },
                {
                    "time": 1447027200000,
                    "open": 372,
                    "close": 383.25,
                    "low": 361.32,
                    "high": 395.21,
                    "volume": 2043266
                },
                {
                    "time": 1447113600000,
                    "open": 383.25,
                    "close": 339.45,
                    "low": 326.88,
                    "high": 385.96,
                    "volume": 3018387
                },
                {
                    "time": 1447200000000,
                    "open": 339.45,
                    "close": 314.5,
                    "low": 301.09,
                    "high": 344,
                    "volume": 3906724
                },
                {
                    "time": 1447286400000,
                    "open": 314.5,
                    "close": 338.25,
                    "low": 313.7,
                    "high": 349.84,
                    "volume": 3688177
                },
                {
                    "time": 1447372800000,
                    "open": 338.25,
                    "close": 338.81,
                    "low": 325.21,
                    "high": 344.75,
                    "volume": 1939377
                },
                {
                    "time": 1447459200000,
                    "open": 338.81,
                    "close": 333.63,
                    "low": 329.31,
                    "high": 345.03,
                    "volume": 1637971
                },
                {
                    "time": 1447545600000,
                    "open": 333.63,
                    "close": 320.43,
                    "low": 314.5,
                    "high": 335.08,
                    "volume": 1621865
                },
                {
                    "time": 1447632000000,
                    "open": 320.43,
                    "close": 332.05,
                    "low": 314.1,
                    "high": 334.77,
                    "volume": 1502612
                },
                {
                    "time": 1447718400000,
                    "open": 332.05,
                    "close": 336.4,
                    "low": 331.15,
                    "high": 342.69,
                    "volume": 1530487
                },
                {
                    "time": 1447804800000,
                    "open": 336.4,
                    "close": 336.5,
                    "low": 328.77,
                    "high": 339.69,
                    "volume": 1208577
                },
                {
                    "time": 1447891200000,
                    "open": 336.5,
                    "close": 326.65,
                    "low": 324.85,
                    "high": 336.84,
                    "volume": 1209300
                },
                {
                    "time": 1447977600000,
                    "open": 326.65,
                    "close": 322.09,
                    "low": 309.99,
                    "high": 327.37,
                    "volume": 1878107
                },
                {
                    "time": 1448064000000,
                    "open": 322.09,
                    "close": 328.24,
                    "low": 319.67,
                    "high": 330.62,
                    "volume": 1113793
                },
                {
                    "time": 1448150400000,
                    "open": 328.24,
                    "close": 324.92,
                    "low": 319.81,
                    "high": 328.6,
                    "volume": 912601
                },
                {
                    "time": 1448236800000,
                    "open": 324.92,
                    "close": 323.81,
                    "low": 320.96,
                    "high": 331.94,
                    "volume": 803797
                },
                {
                    "time": 1448323200000,
                    "open": 323.81,
                    "close": 319.8,
                    "low": 315.79,
                    "high": 323.76,
                    "volume": 927965
                },
                {
                    "time": 1448409600000,
                    "open": 319.8,
                    "close": 329.42,
                    "low": 315.84,
                    "high": 334.49,
                    "volume": 1220511
                },
                {
                    "time": 1448496000000,
                    "open": 329.42,
                    "close": 354.2,
                    "low": 329.25,
                    "high": 372.42,
                    "volume": 3054060
                },
                {
                    "time": 1448582400000,
                    "open": 354.2,
                    "close": 361.7,
                    "low": 350,
                    "high": 367.4,
                    "volume": 2415770
                },
                {
                    "time": 1448668800000,
                    "open": 361.7,
                    "close": 359.72,
                    "low": 350,
                    "high": 362.29,
                    "volume": 1678983
                },
                {
                    "time": 1448755200000,
                    "open": 359.72,
                    "close": 379.5,
                    "low": 355.1,
                    "high": 382.74,
                    "volume": 1407040
                },
                {
                    "time": 1448841600000,
                    "open": 379.5,
                    "close": 381.43,
                    "low": 373.32,
                    "high": 388.5,
                    "volume": 2619821
                },
                {
                    "time": 1448928000000,
                    "open": 381.43,
                    "close": 364.1,
                    "low": 347.03,
                    "high": 384.75,
                    "volume": 2092391
                },
                {
                    "time": 1449014400000,
                    "open": 364.1,
                    "close": 359.96,
                    "low": 346.67,
                    "high": 367.18,
                    "volume": 1896192
                },
                {
                    "time": 1449100800000,
                    "open": 359.96,
                    "close": 362.32,
                    "low": 355,
                    "high": 372.7,
                    "volume": 1909147
                },
                {
                    "time": 1449187200000,
                    "open": 362.32,
                    "close": 364.2,
                    "low": 353.21,
                    "high": 365.38,
                    "volume": 1174333
                },
                {
                    "time": 1449273600000,
                    "open": 364.2,
                    "close": 394,
                    "low": 363.35,
                    "high": 395,
                    "volume": 1884756
                },
                {
                    "time": 1449360000000,
                    "open": 394,
                    "close": 390.04,
                    "low": 387,
                    "high": 407.51,
                    "volume": 1995480
                },
                {
                    "time": 1449446400000,
                    "open": 390.04,
                    "close": 396.7,
                    "low": 384,
                    "high": 405.62,
                    "volume": 1632998
                },
                {
                    "time": 1449532800000,
                    "open": 396.7,
                    "close": 423,
                    "low": 390,
                    "high": 425.15,
                    "volume": 1589423
                },
                {
                    "time": 1449619200000,
                    "open": 423,
                    "close": 422.14,
                    "low": 407.5,
                    "high": 428.7,
                    "volume": 3017529
                },
                {
                    "time": 1449705600000,
                    "open": 422.14,
                    "close": 416.22,
                    "low": 411.16,
                    "high": 424.99,
                    "volume": 1725214
                },
                {
                    "time": 1449792000000,
                    "open": 416.22,
                    "close": 460,
                    "low": 416.64,
                    "high": 463.78,
                    "volume": 5284695
                },
                {
                    "time": 1449878400000,
                    "open": 460,
                    "close": 440.34,
                    "low": 418.27,
                    "high": 482.76,
                    "volume": 5297714
                },
                {
                    "time": 1449964800000,
                    "open": 440.34,
                    "close": 437.5,
                    "low": 419.99,
                    "high": 449.8,
                    "volume": 2447010
                },
                {
                    "time": 1450051200000,
                    "open": 437.5,
                    "close": 448.89,
                    "low": 432.48,
                    "high": 453.5,
                    "volume": 2231778
                },
                {
                    "time": 1450137600000,
                    "open": 448.89,
                    "close": 469.98,
                    "low": 447.48,
                    "high": 471,
                    "volume": 3419075
                },
                {
                    "time": 1450224000000,
                    "open": 469.98,
                    "close": 458.04,
                    "low": 404,
                    "high": 470.08,
                    "volume": 4154136
                },
                {
                    "time": 1450310400000,
                    "open": 458.04,
                    "close": 456.36,
                    "low": 446.17,
                    "high": 459.76,
                    "volume": 1152674
                },
                {
                    "time": 1450396800000,
                    "open": 456.36,
                    "close": 464.96,
                    "low": 443.05,
                    "high": 468.33,
                    "volume": 1493527
                },
                {
                    "time": 1450483200000,
                    "open": 464.96,
                    "close": 461.6,
                    "low": 451.37,
                    "high": 467.5,
                    "volume": 1481469
                },
                {
                    "time": 1450569600000,
                    "open": 461.6,
                    "close": 443.29,
                    "low": 429.24,
                    "high": 462.81,
                    "volume": 2584113
                },
                {
                    "time": 1450656000000,
                    "open": 443.29,
                    "close": 439.31,
                    "low": 423.7,
                    "high": 446,
                    "volume": 2103651
                },
                {
                    "time": 1450742400000,
                    "open": 439.31,
                    "close": 436.56,
                    "low": 433.47,
                    "high": 443.39,
                    "volume": 829379
                },
                {
                    "time": 1450828800000,
                    "open": 436.56,
                    "close": 445.26,
                    "low": 435.57,
                    "high": 446,
                    "volume": 560732
                },
                {
                    "time": 1450915200000,
                    "open": 445.26,
                    "close": 457.33,
                    "low": 439.49,
                    "high": 459.31,
                    "volume": 1020329
                },
                {
                    "time": 1451001600000,
                    "open": 457.33,
                    "close": 455.44,
                    "low": 448.48,
                    "high": 461.56,
                    "volume": 612453
                },
                {
                    "time": 1451088000000,
                    "open": 455.44,
                    "close": 416.76,
                    "low": 402.86,
                    "high": 458.45,
                    "volume": 2993927
                },
                {
                    "time": 1451174400000,
                    "open": 416.76,
                    "close": 426.82,
                    "low": 407.83,
                    "high": 433.95,
                    "volume": 1267415
                },
                {
                    "time": 1451260800000,
                    "open": 426.82,
                    "close": 422.5,
                    "low": 417.87,
                    "high": 432.67,
                    "volume": 1865178
                },
                {
                    "time": 1451347200000,
                    "open": 422.5,
                    "close": 434,
                    "low": 418.26,
                    "high": 434.97,
                    "volume": 1033533
                },
                {
                    "time": 1451433600000,
                    "open": 434,
                    "close": 424,
                    "low": 419.97,
                    "high": 434.47,
                    "volume": 841044
                },
                {
                    "time": 1451520000000,
                    "open": 424,
                    "close": 430.76,
                    "low": 415.99,
                    "high": 434.23,
                    "volume": 1072844
                },
                {
                    "time": 1451606400000,
                    "open": 430.76,
                    "close": 435.99,
                    "low": 426.37,
                    "high": 436.7,
                    "volume": 478071
                },
                {
                    "time": 1451692800000,
                    "open": 435.99,
                    "close": 435,
                    "low": 429.25,
                    "high": 438,
                    "volume": 729519
                },
                {
                    "time": 1451779200000,
                    "open": 435,
                    "close": 429.79,
                    "low": 422.14,
                    "high": 435.4,
                    "volume": 1218222
                },
                {
                    "time": 1451865600000,
                    "open": 429.79,
                    "close": 432.3,
                    "low": 427.5,
                    "high": 436.44,
                    "volume": 798056
                },
                {
                    "time": 1451952000000,
                    "open": 432.3,
                    "close": 432.57,
                    "low": 429,
                    "high": 434.97,
                    "volume": 480736
                },
                {
                    "time": 1452038400000,
                    "open": 432.57,
                    "close": 428.72,
                    "low": 425.01,
                    "high": 432.2,
                    "volume": 555455
                },
                {
                    "time": 1452124800000,
                    "open": 428.72,
                    "close": 461.02,
                    "low": 426.12,
                    "high": 464.04,
                    "volume": 3420928
                },
                {
                    "time": 1452211200000,
                    "open": 461.02,
                    "close": 453.53,
                    "low": 445.42,
                    "high": 469.49,
                    "volume": 2973447
                },
                {
                    "time": 1452297600000,
                    "open": 453.53,
                    "close": 450,
                    "low": 444.86,
                    "high": 454.81,
                    "volume": 1608658
                },
                {
                    "time": 1452384000000,
                    "open": 450,
                    "close": 450.5,
                    "low": 439.01,
                    "high": 450.75,
                    "volume": 1316820
                },
                {
                    "time": 1452470400000,
                    "open": 450.5,
                    "close": 450.43,
                    "low": 445.28,
                    "high": 454.89,
                    "volume": 2075229
                },
                {
                    "time": 1452556800000,
                    "open": 450.43,
                    "close": 431.45,
                    "low": 430,
                    "high": 453.35,
                    "volume": 1762340
                },
                {
                    "time": 1452643200000,
                    "open": 431.45,
                    "close": 429.94,
                    "low": 420.48,
                    "high": 438.01,
                    "volume": 2324192
                },
                {
                    "time": 1452729600000,
                    "open": 429.94,
                    "close": 427.87,
                    "low": 425.76,
                    "high": 432.92,
                    "volume": 651926
                },
                {
                    "time": 1452816000000,
                    "open": 427.87,
                    "close": 360,
                    "low": 360,
                    "high": 428.31,
                    "volume": 2562104
                },
                {
                    "time": 1452902400000,
                    "open": 360,
                    "close": 388.6,
                    "low": 350.83,
                    "high": 391.44,
                    "volume": 2530911
                },
                {
                    "time": 1452988800000,
                    "open": 388.6,
                    "close": 380,
                    "low": 377.33,
                    "high": 392.62,
                    "volume": 1923597
                },
                {
                    "time": 1453075200000,
                    "open": 380,
                    "close": 384.53,
                    "low": 373.16,
                    "high": 389.1,
                    "volume": 1207683
                },
                {
                    "time": 1453161600000,
                    "open": 384.53,
                    "close": 376.74,
                    "low": 375.99,
                    "high": 387.9,
                    "volume": 1139997
                },
                {
                    "time": 1453248000000,
                    "open": 376.74,
                    "close": 421.44,
                    "low": 372.99,
                    "high": 428,
                    "volume": 2780268
                },
                {
                    "time": 1453334400000,
                    "open": 421.44,
                    "close": 411.76,
                    "low": 404.2,
                    "high": 424.73,
                    "volume": 1709469
                },
                {
                    "time": 1453420800000,
                    "open": 411.76,
                    "close": 381.8,
                    "low": 368.01,
                    "high": 412.26,
                    "volume": 3898698
                },
                {
                    "time": 1453507200000,
                    "open": 381.8,
                    "close": 387.01,
                    "low": 380.58,
                    "high": 396.5,
                    "volume": 2642327
                },
                {
                    "time": 1453593600000,
                    "open": 387.01,
                    "close": 403.67,
                    "low": 386.21,
                    "high": 408.79,
                    "volume": 1659215
                },
                {
                    "time": 1453680000000,
                    "open": 403.67,
                    "close": 389,
                    "low": 388.17,
                    "high": 404.51,
                    "volume": 2331402
                },
                {
                    "time": 1453766400000,
                    "open": 389,
                    "close": 391.55,
                    "low": 386.98,
                    "high": 397.01,
                    "volume": 1281634
                },
                {
                    "time": 1453852800000,
                    "open": 391.55,
                    "close": 395.63,
                    "low": 391.31,
                    "high": 397.92,
                    "volume": 340083
                },
                {
                    "time": 1453939200000,
                    "open": 395.63,
                    "close": 380,
                    "low": 375.42,
                    "high": 394.94,
                    "volume": 1200822
                },
                {
                    "time": 1454025600000,
                    "open": 380,
                    "close": 377.35,
                    "low": 361,
                    "high": 385.58,
                    "volume": 2298885
                },
                {
                    "time": 1454112000000,
                    "open": 377.35,
                    "close": 376.95,
                    "low": 373,
                    "high": 383.43,
                    "volume": 964099
                },
                {
                    "time": 1454198400000,
                    "open": 376.95,
                    "close": 364.99,
                    "low": 360.01,
                    "high": 379,
                    "volume": 711509
                },
                {
                    "time": 1454284800000,
                    "open": 364.99,
                    "close": 371.62,
                    "low": 364.99,
                    "high": 378.56,
                    "volume": 1783415
                },
                {
                    "time": 1454371200000,
                    "open": 371.62,
                    "close": 372.69,
                    "low": 369.99,
                    "high": 376.13,
                    "volume": 637209
                },
                {
                    "time": 1454457600000,
                    "open": 372.69,
                    "close": 369.78,
                    "low": 365.71,
                    "high": 373.9,
                    "volume": 1088239
                },
                {
                    "time": 1454544000000,
                    "open": 369.78,
                    "close": 389.49,
                    "low": 369.31,
                    "high": 395,
                    "volume": 1487389
                },
                {
                    "time": 1454630400000,
                    "open": 389.49,
                    "close": 385.39,
                    "low": 384.59,
                    "high": 398.98,
                    "volume": 914820
                },
                {
                    "time": 1454716800000,
                    "open": 385.39,
                    "close": 374.3,
                    "low": 371,
                    "high": 386.18,
                    "volume": 1488034
                },
                {
                    "time": 1454803200000,
                    "open": 374.3,
                    "close": 375.74,
                    "low": 373.01,
                    "high": 380.29,
                    "volume": 497376
                },
                {
                    "time": 1454889600000,
                    "open": 375.74,
                    "close": 371.86,
                    "low": 370.89,
                    "high": 381.44,
                    "volume": 1034043
                },
                {
                    "time": 1454976000000,
                    "open": 371.86,
                    "close": 375.55,
                    "low": 371.15,
                    "high": 377.8,
                    "volume": 184439
                },
                {
                    "time": 1455062400000,
                    "open": 375.55,
                    "close": 381.39,
                    "low": 374.82,
                    "high": 385.93,
                    "volume": 347574
                },
                {
                    "time": 1455148800000,
                    "open": 381.39,
                    "close": 378.2,
                    "low": 374,
                    "high": 383,
                    "volume": 482977
                },
                {
                    "time": 1455235200000,
                    "open": 378.2,
                    "close": 382.22,
                    "low": 377.47,
                    "high": 384.56,
                    "volume": 716688
                },
                {
                    "time": 1455321600000,
                    "open": 382.22,
                    "close": 394.85,
                    "low": 382.11,
                    "high": 395,
                    "volume": 924733
                },
                {
                    "time": 1455408000000,
                    "open": 394.85,
                    "close": 408.92,
                    "low": 394.33,
                    "high": 409.4,
                    "volume": 1162021
                },
                {
                    "time": 1455494400000,
                    "open": 408.92,
                    "close": 399.17,
                    "low": 392,
                    "high": 413.99,
                    "volume": 1986806
                },
                {
                    "time": 1455580800000,
                    "open": 399.17,
                    "close": 406.6,
                    "low": 397.17,
                    "high": 410,
                    "volume": 1735067
                },
                {
                    "time": 1455667200000,
                    "open": 406.6,
                    "close": 414.99,
                    "low": 403.57,
                    "high": 422.2,
                    "volume": 1568296
                },
                {
                    "time": 1455753600000,
                    "open": 414.99,
                    "close": 420.77,
                    "low": 414.5,
                    "high": 426.11,
                    "volume": 1050982
                },
                {
                    "time": 1455840000000,
                    "open": 420.77,
                    "close": 419.71,
                    "low": 412,
                    "high": 422.19,
                    "volume": 843415
                },
                {
                    "time": 1455926400000,
                    "open": 419.71,
                    "close": 438.98,
                    "low": 420.33,
                    "high": 447,
                    "volume": 2922733
                },
                {
                    "time": 1456012800000,
                    "open": 438.98,
                    "close": 439.87,
                    "low": 427.5,
                    "high": 451.61,
                    "volume": 2183112
                },
                {
                    "time": 1456099200000,
                    "open": 439.87,
                    "close": 439.19,
                    "low": 430.35,
                    "high": 442.23,
                    "volume": 862594
                },
                {
                    "time": 1456185600000,
                    "open": 439.19,
                    "close": 420.07,
                    "low": 413.57,
                    "high": 442.23,
                    "volume": 1412797
                },
                {
                    "time": 1456272000000,
                    "open": 420.07,
                    "close": 424.52,
                    "low": 410.65,
                    "high": 426.83,
                    "volume": 786934
                },
                {
                    "time": 1456358400000,
                    "open": 424.52,
                    "close": 424.46,
                    "low": 418.8,
                    "high": 431.11,
                    "volume": 1013217
                },
                {
                    "time": 1456444800000,
                    "open": 424.46,
                    "close": 434.02,
                    "low": 418.45,
                    "high": 434.33,
                    "volume": 757074
                },
                {
                    "time": 1456531200000,
                    "open": 434.02,
                    "close": 432.04,
                    "low": 429.7,
                    "high": 436.1,
                    "volume": 660402
                },
                {
                    "time": 1456617600000,
                    "open": 432.04,
                    "close": 433.99,
                    "low": 423.18,
                    "high": 436,
                    "volume": 736904
                },
                {
                    "time": 1456704000000,
                    "open": 433.99,
                    "close": 435.96,
                    "low": 431.52,
                    "high": 442.79,
                    "volume": 877171
                },
                {
                    "time": 1456790400000,
                    "open": 435.96,
                    "close": 433.55,
                    "low": 424.5,
                    "high": 440.38,
                    "volume": 718888
                },
                {
                    "time": 1456876800000,
                    "open": 433.55,
                    "close": 423.8,
                    "low": 421.92,
                    "high": 435.53,
                    "volume": 584575
                },
                {
                    "time": 1456963200000,
                    "open": 423.8,
                    "close": 419.99,
                    "low": 417.8,
                    "high": 424.01,
                    "volume": 652635
                },
                {
                    "time": 1457049600000,
                    "open": 419.99,
                    "close": 408.68,
                    "low": 407.35,
                    "high": 423.33,
                    "volume": 734758
                },
                {
                    "time": 1457136000000,
                    "open": 408.68,
                    "close": 398.01,
                    "low": 390.08,
                    "high": 410.03,
                    "volume": 1053709
                },
                {
                    "time": 1457222400000,
                    "open": 398.01,
                    "close": 404.08,
                    "low": 392.76,
                    "high": 410.38,
                    "volume": 507708
                },
                {
                    "time": 1457308800000,
                    "open": 404.08,
                    "close": 412.92,
                    "low": 402.28,
                    "high": 414.58,
                    "volume": 550935
                },
                {
                    "time": 1457395200000,
                    "open": 412.92,
                    "close": 412.49,
                    "low": 409.02,
                    "high": 415.24,
                    "volume": 260292
                },
                {
                    "time": 1457481600000,
                    "open": 412.49,
                    "close": 413.64,
                    "low": 408.1,
                    "high": 414.15,
                    "volume": 218286
                },
                {
                    "time": 1457568000000,
                    "open": 413.64,
                    "close": 418.03,
                    "low": 411.06,
                    "high": 418.08,
                    "volume": 316241
                },
                {
                    "time": 1457654400000,
                    "open": 418.03,
                    "close": 421.87,
                    "low": 416.61,
                    "high": 423.48,
                    "volume": 648801
                },
                {
                    "time": 1457740800000,
                    "open": 421.87,
                    "close": 411.4,
                    "low": 407.23,
                    "high": 421.96,
                    "volume": 878204
                },
                {
                    "time": 1457827200000,
                    "open": 411.4,
                    "close": 412.58,
                    "low": 411.17,
                    "high": 416.17,
                    "volume": 147641
                },
                {
                    "time": 1457913600000,
                    "open": 412.58,
                    "close": 415.68,
                    "low": 412.58,
                    "high": 416.01,
                    "volume": 153706
                },
                {
                    "time": 1458000000000,
                    "open": 415.68,
                    "close": 415.53,
                    "low": 413.25,
                    "high": 418.05,
                    "volume": 168834
                },
                {
                    "time": 1458086400000,
                    "open": 415.53,
                    "close": 416.86,
                    "low": 413.47,
                    "high": 417.73,
                    "volume": 118770
                },
                {
                    "time": 1458172800000,
                    "open": 416.86,
                    "close": 419.2,
                    "low": 417,
                    "high": 419.46,
                    "volume": 124519
                },
                {
                    "time": 1458259200000,
                    "open": 419.2,
                    "close": 408.68,
                    "low": 402.49,
                    "high": 418.6,
                    "volume": 406058
                },
                {
                    "time": 1458345600000,
                    "open": 408.68,
                    "close": 409.25,
                    "low": 403.68,
                    "high": 409.81,
                    "volume": 316965
                },
                {
                    "time": 1458432000000,
                    "open": 409.25,
                    "close": 412.24,
                    "low": 406.81,
                    "high": 412.55,
                    "volume": 258957
                },
                {
                    "time": 1458518400000,
                    "open": 412.24,
                    "close": 412.25,
                    "low": 407.53,
                    "high": 412.25,
                    "volume": 239995
                },
                {
                    "time": 1458604800000,
                    "open": 412.25,
                    "close": 416.99,
                    "low": 411.18,
                    "high": 417.77,
                    "volume": 233530
                },
                {
                    "time": 1458691200000,
                    "open": 416.99,
                    "close": 416.57,
                    "low": 414.55,
                    "high": 419,
                    "volume": 440562
                },
                {
                    "time": 1458777600000,
                    "open": 416.57,
                    "close": 415.67,
                    "low": 412.41,
                    "high": 418.36,
                    "volume": 375917
                },
                {
                    "time": 1458864000000,
                    "open": 415.67,
                    "close": 415.82,
                    "low": 410.88,
                    "high": 416.84,
                    "volume": 298790
                },
                {
                    "time": 1458950400000,
                    "open": 415.82,
                    "close": 416.5,
                    "low": 413.45,
                    "high": 418.4,
                    "volume": 214610
                },
                {
                    "time": 1459036800000,
                    "open": 416.5,
                    "close": 425.5,
                    "low": 415.82,
                    "high": 433.97,
                    "volume": 1055387
                },
                {
                    "time": 1459123200000,
                    "open": 425.5,
                    "close": 422.46,
                    "low": 421.73,
                    "high": 427.76,
                    "volume": 500286
                },
                {
                    "time": 1459209600000,
                    "open": 422.46,
                    "close": 414.58,
                    "low": 406.9,
                    "high": 425.09,
                    "volume": 554114
                },
                {
                    "time": 1459296000000,
                    "open": 414.58,
                    "close": 412.09,
                    "low": 408.62,
                    "high": 414.99,
                    "volume": 271640
                },
                {
                    "time": 1459382400000,
                    "open": 412.09,
                    "close": 415.49,
                    "low": 412.08,
                    "high": 416.75,
                    "volume": 277938
                },
                {
                    "time": 1459468800000,
                    "open": 415.49,
                    "close": 417.04,
                    "low": 413.39,
                    "high": 417.04,
                    "volume": 155005
                },
                {
                    "time": 1459555200000,
                    "open": 417.04,
                    "close": 420,
                    "low": 417.03,
                    "high": 422.07,
                    "volume": 276964
                },
                {
                    "time": 1459641600000,
                    "open": 420,
                    "close": 419.6,
                    "low": 416.6,
                    "high": 420.69,
                    "volume": 217898
                },
                {
                    "time": 1459728000000,
                    "open": 419.6,
                    "close": 419.55,
                    "low": 417.64,
                    "high": 420.52,
                    "volume": 151366
                },
                {
                    "time": 1459814400000,
                    "open": 419.55,
                    "close": 423.24,
                    "low": 419.28,
                    "high": 423.98,
                    "volume": 196764
                },
                {
                    "time": 1459900800000,
                    "open": 423.24,
                    "close": 422.04,
                    "low": 420.96,
                    "high": 423.52,
                    "volume": 169323
                }]
        })
    }

    onUpdateData(result) {
        if (!result.data) {
            return
        }

        result.symbol = result.symbol.toUpperCase();
        let cacheItem = `${result.symbol}.${result.type}`;

        if (!this.dataCache[cacheItem]) {
            this.dataCache[cacheItem] = [];
        }

        if (result.topic === "kline.req") {
            this.toggleStyles(this.styles);
            this.dataCache[cacheItem] = result.data;
        } else if (result.topic === "kline") {
            result.data.interval = result.type;
            this.dataFeed.update(result.data);
        }
    }

    subscribeKline(params, callBack) {
        this.ws.send(JSON.stringify(params));
        this.ws.onmessage = e => {
            let data = JSON.parse(e.data);
            if (data.topic === "kline.req" || data.topic === "kline") {
                callBack && callBack(data);
            }
        };
    }

    remove() {
        this.widget.remove();
    }


    toggleThemeName(styles, overrides, studies, elementId) {
        let meta = this.widget.chart().getAllStudies()[0];
        let vol = this.widget.chart().getStudyById(meta.id);
        this.vue.$nextTick(() => {
            this.widget.applyOverrides(overrides);
            vol.applyOverrides(studies);
            this.toggleStyles(styles, elementId);
            docEle.className = styles;
            if (styles !== 'dark') {
                document.styleSheets[0].insertRule('body::after { background: black }', 0);
            }
            this.styles = styles;
        });
    }

    toggleStyles(styles, elementId) {
        let iframeHTMLElement = doc(`#${elementId} iframe`).contentWindow.document.documentElement || false;
        if (iframeHTMLElement) {
            let classList = iframeHTMLElement.classList;
            this.vue.$nextTick(() => {
                classList.remove("dark");
                classList.remove("white");
                classList.add(styles);
            })
        }
    }

    setSymbol(market, resolution, callBack) {
        this.widget.setSymbol(market, resolution, callBack);
    }

    showFullScreen() {
        this.widget._innerAPI()._chartWidgetCollection.startFullscreen();
    }

    hideFullScreen() {
        this.widget._innerAPI()._chartWidgetCollection.exitFullscreen();
    }

    showConfirmDialog() {
        this.widget.showConfirmDialog();
    }

    showLoadChartDialog() {
        this.widget.showLoadChartDialog();
    }

    showNoticeDialog() {
        this.widget.showNoticeDialog();
    }

    showSaveAsChartDialog() {
        this.widget.showSaveAsChartDialog();
    }

    setLanguage(lang) {
        this.widget.setLanguage(lang);
    }

    setResolution(r) {
        this.widget._innerAPI()._chartWidgetCollection.setResolution(r);
    }

    changeChatType(type) {
        this.widget.applyOverrides({
            'mainSeriesProperties.style': type
        });
    }

    chartSetResolution(r) {
        this.widget.chart().setResolution(r, () => {
        });
    }

    executeActionById(actionId) {
        // chartProperties      图表属性
        // compareOrAdd         比较或添加
        // scalesProperties     比例属性
        // tmzProperties        时区
        // paneObjectTree       窗格对象树
        // insertIndicator      插入指标
        // symbolSearch         符号搜索
        // changeInterval       改变间隔
        // timeScaleReset       时间比例重置
        // drawingToolbarAction 绘图工具栏
        this.widget.chart().executeActionById(actionId);
    }
}
