const metaInterval = ["1D", "1W", "1M"];

export default class DataFeed {
  constructor(context, options) {
    this._subscribers = {};
    this.v = context;
    this.options = options;
  }


  update = (data) => {
    metaInterval.includes(data.interval) ? data.time = (data.time + (24 * 60 * 60)) * 1000 : data.time *= 1000;
    for (let i in this._subscribers) {
      let item = this._subscribers[i];
      item.onRealtimeCallback(data);
    }
  };


  /**
   * @param callBack: function(configurationData) i.configurationData: object
   * 此方法旨在提供填充配置数据的对象
   * */
  onReady = callBack => new Promise(resolve => {
    resolve();
  }).then(() => callBack(DataFeed.defaultConfiguration()));

  /**
   * @param userInput: string，用户在商品搜索框中输入的文字
   * @param exchange:string，请求的交易所（由用户选择）。空值表示没有指定
   * @param symbolType: string，请求的商品类型：指数、股票、外汇等等（由用户选择）。空值表示没有指定
   * @param onResultReadyCallback: function(result) result: 数组
   * 方法介绍：通过商品名称解析商品信息(SymbolInfo)
   * */
  searchSymbols = (userInput, exchange, symbolType, onResultReadyCallback) => {
  };

  /**
   * @param symbolName: string类型，商品名称 或ticker if provided.
   * @param onSymbolResolvedCallback: function(SymbolInfo)
   * @param onResolveErrorCallback: function(reason)
   * 方法介绍：通过商品名称解析商品信息(SymbolInfo)
   * */
  resolveSymbol = (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => new Promise((resolve, reject) => {
    let symbolInfo = DataFeed.defaultSymbol();
    if (this.options) {
      symbolInfo = {...DataFeed.defaultSymbol(), ...this.options};
    }
    resolve(symbolInfo); // 异步返回成功结果
  }).then(result => onSymbolResolvedCallback(result)).catch(() => console.log("onResolveErrorCallback"));

  /**
   * @param symbolInfo:SymbolInfo 商品信息对象
   * @param resolution: string （周期）
   * @param from: unix 时间戳, 最左边请求的K线时间
   * @param to: unix 时间戳, 最右边请求的K线时间
   * @param onHistoryCallback: function(数组bars, meta = {noData = false})
   bars: Bar对象数组{time, close, open, high, low, volume}[]
   meta: object{noData = true | false, nextTime = unix time}
   * @param onErrorCallback: function(reason：错误原因)
   * @param firstDataRequest: 布尔值，以标识是否第一次调用此商品/周期的历史记录。当设置为true时 你可以忽略to参数（这取决于浏览器的Date.now()) 并返回K线数组直到当前K线（包括它）
   * 方法介绍：通过日期范围获取历史K线数据。图表库希望通过onHistoryCallback仅一次调用，接收所有的请求历史。而不是被多次调用。
   * */
  getBars = (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    const onLoadedCallback = (data) => {
      let bars = data.bars || [];
      bars.forEach((item) => item.time = this.periodLengthSeconds(resolution, item));
      let meta = {noData: data.noData};
      onHistoryCallback(bars, meta);
    };
    this.v.getBars(symbolInfo, resolution, from, to, onLoadedCallback);
  };


  /**
   * @param symbolInfo:SymbolInfo 商品信息对象
   * @param resolution: string （周期）
   * @param onRealtimeCallback: function(bar)
   * bar: object{time, close, open, high, low, volume}
   * @param subscriberUID: string
   * @param onResetCacheNeededCallback(从1.7开始): function()将在bars数据发生变化时执行
   * 方法介绍：订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
   * */
  subscribeBars = (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    this.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, subscriberUID);
  };

  /**
   * 订阅数据
   * @param symbolInfo:SymbolInfo 商品信息对象
   * @param resolution: string （周期）
   * @param onRealtimeCallback: function(bar)
   * @param subscriberUID: string
   */
  subscribeDataListener = (symbolInfo, resolution, onRealtimeCallback, subscriberUID) => {
    if (!this._subscribers.hasOwnProperty(subscriberUID)) {
      this._subscribers[subscriberUID] = {
        symbolInfo: symbolInfo,
        resolution: resolution,
        listeners: [],
        onRealtimeCallback
      };
    }
    this._subscribers[subscriberUID].listeners.push(onRealtimeCallback);
  };

  unsubscribeBars = subscriberUID => {
    delete this._subscribers[subscriberUID];
  };

  /**
   * exchanges                    一个交易所数组
   * symbols_types                一个商品类型过滤器数组
   * supported_resolutions        一个表示服务器支持的周期数组
   * supports_marks               布尔值来标识您的 datafeed 是否支持在K线上显示标记
   * supports_timescale_marks     布尔值来标识您的 datafeed 是否支持时间刻度标记
   * supports_time                将此设置为true假如您的datafeed提供服务器时间（unix时间）
   * */
  static defaultConfiguration = () => ({
    exchanges: [{value: '', name: 'Piexgo', desc: ''}],
    symbols_types: [{name: 'All types', value: ''}],
    supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '720', '1D', '1W', '1M'],
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true,
  });


  static defaultSymbol = () => ({
    name: 'BTC_USDT', // 商品名称。您的用户将看到它(作为一个字符串)。 此外，如果您不使用 tickers ，它将用于数据请求。
    'exchange-traded': '',
    'exchange-listed': '',
    timezone: 'Asia/Singapore', // 这个商品的交易所时区。我们希望以olsondb格式获取时区的名称
    minmov: 1, // 最小波动
    pointvalue: 1,
    fractional: false, // 分数价格
    session: '24x7', // 商品交易时间
    has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
    has_daily: true, // 布尔值显示商品是否具有以日为单位的历史数据
    has_weekly_and_monthly: true, // 布尔值显示商品是否具有以W和M为单位的历史数据
    has_no_volume: false,
    description: 'BTC_USDT',
    pricescale: 100, // 价格精度
    ticker: 'BTC_USDT',
    supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '720', '1D', '1W', '1M'],
  });

  periodLengthSeconds(resolution, item) {
    return metaInterval.includes(resolution) ? item.time = (item.time + (24 * 60 * 60)) * 1000 : item.time *= 1000;
  }
}