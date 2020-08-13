import {widget as TvWidget} from '../../../../static/charting_library/charting_library.min';
import Vue from "vue";
import Datafeeds from './datafeed'
import TestData from "./data";

const doc = dom => document.querySelector(dom);
const docEle = document.documentElement;

const metaInterval = ["1D", "1W", "1M"];

export default {
  widget: null,
  dataFeed: null,
  dataCache: {}, // 缓存数据
  getBarTimer: null,
  vue: null,
  ws: null,
  cancelSendObj: {},
  init: function (options, ws) {
    this.styles = options.styles;                                            // 样式
    this.ws = ws;                                                            // websocket实例
    this.vue = new Vue();                                                    // vue 实例
    this.dataCache = {};                                                     // 缓存数据
    this.dataFeed = new Datafeeds(this, options);                            // 图表库Widget的构造函数
    // this.langType = i18n[handlerGetCookie('lang')].TradingView;           // 国际化
    this.widget = new TvWidget({
      symbol: options.symbol,
      interval: options.interval,
      container_id: options.id,
      datafeed: this.dataFeed,
      library_path: '/static/charting_library/',
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

    // MA线 移动平均线
    this.widget.onChartReady(() => {
      this.widget.chart().createStudy('Moving Average', false, false, [5], null, {
        'Plot.color': 'rgba(125,150,235,0.6)',
        "precision": options.precision,
      });  // 蓝色
      this.widget.chart().createStudy('Moving Average', false, false, [10], null, {
        'Plot.color': 'rgba(58,169,194,0.6)',
        "precision": options.precision,
      });  // 绿色
      this.widget.chart().createStudy('Moving Average', false, false, [30], null, {
        'Plot.color': 'rgba(235,172,125,0.6)',
        "precision": options.precision,
      });  // 黄色
      this.widget.chart().createStudy('Moving Average', false, false, [60], null, {
        'Plot.color': 'rgba(241,75,146,0.6)',
        "precision": options.precision,
      });  // 红色
    });
  },
  deleteCache(ticker) {
    let item = `${ticker}.${this.resolution}`;
    delete this.dataCache[item];
  },
  handleClearDWMResolution(options) {
    let specialMeta = options.symbol + '_' + this.widget.chart().resolution();
    if (metaInterval.includes(this.widget.chart().resolution())) this.dataFeed.unsubscribeBars(specialMeta);
  },
  handleCancelSend() {
    if (this.cancelSendObj) this.subscribeKline(this.cancelSendObj);
  },
  handleClearHistoryStatus() {
    this.historyType = "";
  },
  getBars: function (symbolInfo, resolution, from, to, callBack) {
    callBack && callBack({s: 'ok', bars: TestData})
    // if (!callBack) return;
    // let data;
    // this.resolution = resolution;
    // let cacheItem = `${symbolInfo.ticker}.${resolution}`;
    // let symbolData = this.dataCache[cacheItem];
    // if (symbolData) data = symbolData;
    // const requestTitle = `kline.${symbolInfo.ticker.toLowerCase()}.${resolution}`;
    // const fetchCacheData = bars => {
    //   let first = bars[0].time;
    //   let http_params = {symbol: symbolInfo.ticker, from, to, type: resolution};
    //   if (this.historyType === "request") {
    //     // 请求历史数据
    //     axios.get(REQUEST_URL + "/data/kline", {params: http_params}).then(result => {
    //       let responseData = result.data.data;
    //       if (!responseData) return callBack({bars: [], noData: true});
    //       bars = responseData;
    //       if (!bars.length) {
    //         callBack({bars: [], noData: true});
    //       } else if (bars.length && bars[0].time) {
    //         callBack({bars, noData: false});
    //       }
    //     }).catch(err => console.log(err));
    //   } else {
    //     to < first ? callBack({bars: [], noData: true}) : callBack({bars, noData: false});
    //     let params = {sub: `kline.${symbolInfo.ticker.toLowerCase()}.${resolution}`, from, to, unsub: "", pong: 0};
    //     this.subscribeKline(params, this.onUpdateData.bind(this));
    //   }
    //
    //   this.cancelSendObj = {unsub: requestTitle, pong: 0};
    //   this.historyType = "request";
    // };
    //
    // const requestKline = () => {
    //   const params = {req: requestTitle, from, to, unsub: "", pong: 0};
    //   this.subscribeKline(params, result => {
    //     this.onUpdateData(result);
    //     this.getBars(symbolInfo, resolution, from, to, callBack);
    //   });
    // };
    //
    // (data && data.length) ? fetchCacheData(data) : setTimeout(() => requestKline(), 500);
  },
  onUpdateData(result) {
    if (!result.data) return;
    result.symbol = result.symbol.toUpperCase();
    let cacheItem = `${result.symbol}.${result.type}`;

    if (!this.dataCache[cacheItem]) {
      this.dataCache[cacheItem] = [];
    }

    if (result.topic === "kline.req") {
      this.toggleStyles(this.styles);
      this.dataCache[cacheItem] = result.data;
      store.commit("UPDATE_KLINE_LOADING", false);
    } else if (result.topic === "kline") {
      result.data.interval = result.type;
      this.dataFeed.update(result.data);
    }
  },
  subscribeKline(params, callBack) {
    this.ws.send(JSON.stringify(params));
    this.ws.onmessage = e => {
      let data = JSON.parse(e.data);
      if (data.topic === "kline.req" || data.topic === "kline") {
        callBack && callBack(data);
      }
    };
  },
  remove() {
    this.widget.remove();
  },
  toggleThemeName(styles, overrides, studies, theme) {
    let meta = this.widget.chart().getAllStudies()[0];
    let vol = this.widget.chart().getStudyById(meta.id);
    this.styles = styles;
    this.vue.$nextTick(() => {
      this.toggleStyles(styles);
      this.widget.applyOverrides(overrides);
      vol.applyOverrides(studies);
      if (theme === 'black') {
        docEle.className = "xxx";
      } else {
        docEle.className = "xxx";
        document.styleSheets[0].insertRule('body::after { background: black }', 0);
      }
    });
  },
  /*
  切换图表主题
  具体在TV的iframe主题上的html根节点添加主题class，然后对应的手动更改自己的图表配置颜色
  * */
  toggleStyles(theMe) {
    let clsPrefix = theMe.split("_")[0];
    let iframeHTMLElement = doc("#tradingView_container iframe").contentWindow.document.documentElement || false;
    if (iframeHTMLElement) {
      let classList = iframeHTMLElement.classList;
      if (classList.value.indexOf(clsPrefix) > -1) {
        for (let i = 0; i < classList.length; i++) {
          let eleClass = classList[i];
          if (clsPrefix === eleClass.split("_")[0]) {
            classList.remove(eleClass);
          }
        }
      }
      classList.add(theMe);
    }
  },
  setSymbol(market, resolution, callBack) {
    this.widget.setSymbol(market, resolution, callBack);
  },
  // 全屏方法
  showFullScreen() {
    this.widget._innerAPI()._chartWidgetCollection.startFullscreen();
  },
  // 关闭全屏
  hideFullScreen() {
    this.widget._innerAPI()._chartWidgetCollection.exitFullscreen();
  },
  // 显示确认对话框
  showConfirmDialog() {
    this.widget.showConfirmDialog();
  },
  // 显示加载对话框
  showLoadChartDialog() {
    this.widget.showLoadChartDialog();
  },
  // 显示通知对话框
  showNoticeDialog() {
    this.widget.showNoticeDialog();
  },
  // 显示保存对话框
  showSaveAsChartDialog() {
    this.widget.showSaveAsChartDialog();
  },
  // 设置语言
  setLanguage(lang) {
    this.widget.setLanguage(lang);
  },
  // 设置分辨率
  setResolution(r) {
    this.widget._innerAPI()._chartWidgetCollection.setResolution(r);
  },
  changeChatType(type) {
    this.widget.applyOverrides({
      'mainSeriesProperties.style': type
    });
  },
  chartSetResolution(r) {
    this.widget.chart().setResolution(r, () => {
    });
  },
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
  },
}