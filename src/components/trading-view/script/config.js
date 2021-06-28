export let TvConfigInfo = {
    'exchange-traded': '',
    'exchange-listed': '',
    timezone: 'Asia/Singapore',
    minmov: 1,
    pointvalue: 1,
    fractional: false,
    session: '24x7',
    has_no_volume: false,
    has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
    has_daily: true, // 布尔值显示商品是否具有以日为单位的历史数据
    has_weekly_and_monthly: true, // 布尔值显示商品是否具有以W和M为单位的历史数据
    supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '720', '1D', '1W', '1M'],
    symbol: "BTC_USDT",
    interval: '60',
    name: 'BTC_USDT',
    description: 'BTC_USDT',
    pricescale: 100,
    ticker: 'BTC_USDT',
    id: "tradingView_container", // 图表id
    chartColor: "#152130", // 图表颜色
    currentTicker: "", // 当前刻度
    gridColor: "#243142", // 网格颜色
    language: "en", // 语言
    realtie: "REALTIME", // 分时的中英文
    lineColor: "#2E3947", // xy轴线条颜色
    textColor: "#545D69", // 文字颜色
    crossover: "#4F5E72", // 十字交叉颜色
    week: "1Week",
    mon: "1Mon",
    riseColor: "#38AF75", // 涨颜色
    fallColor: "#E75A5B", // 停颜色
    styles: "dark",
    precision: 4,
    mainSeriesProperties: 1
};


// k线图的颜色配置
export const handleKlineColorConfig = (colConfig) => {
    TvConfigInfo["chartColor"] = colConfig.chartColor;
    TvConfigInfo["styles"] = colConfig.styles;
    TvConfigInfo["lineColor"] = colConfig.lineColor;
    TvConfigInfo["gridColor"] = colConfig.gridColor;
    TvConfigInfo["crossover"] = colConfig.crossover;
    TvConfigInfo["textColor"] = colConfig.textColor;

    if (colConfig.riseColor) TvConfigInfo["riseColor"] = colConfig.riseColor;
    if (colConfig.fallColor) TvConfigInfo["fallColor"] = colConfig.fallColor;
};

// k线图的商品配置
export const handleReplaceTradingKey = (market) => {
    TvConfigInfo["symbol"] = market;
    TvConfigInfo["ticker"] = market;
    TvConfigInfo["description"] = market;
    TvConfigInfo["name"] = market;
};

export const KlineEx_Dark = {
    color: "#243142",
    chartColor: "#152130",
    gridColor: "#243142",
    lineColor: "#2E3947",
    textColor: "#545D69",
    crossover: "#4F5E72",
    riseColor: "#38AF75",
    fallColor: "#E75A5B",
    styles: "dark"
};

export const KlineEx_White = {
    chartColor: "#FFFBF6",
    gridColor: "rgba(238,240,243,1)",
    crossover: "#A0A2B2",
    color: "rgba(238,240,243,1)",
    lineColor: "#DBE0E6",
    textColor: "rgba(0,0,0,0.55)",
    riseColor: "#0D7680",
    fallColor: "#8F223A",
    styles: "white"
};

export const toggleTheme = (options) => ({
    "paneProperties.background": options.chartColor,
    "paneProperties.vertGridProperties.color": options.gridColor,
    "paneProperties.horzGridProperties.color": options.gridColor,
    "paneProperties.crossHairProperties.color": options.crossover,
    "scalesProperties.backgroundColor": options.chartColor,
    "scalesProperties.lineColor": options.lineColor,
    "scalesProperties.textColor": options.textColor,
    "mainSeriesProperties.candleStyle.upColor": options.riseColor,
    "mainSeriesProperties.candleStyle.borderColor": options.riseColor,
    "mainSeriesProperties.candleStyle.borderUpColor": options.riseColor,
    "mainSeriesProperties.candleStyle.wickColor": options.riseColor,
    "mainSeriesProperties.candleStyle.wickUpColor": options.riseColor,
    "mainSeriesProperties.hollowCandleStyle.upColor": options.riseColor,
    "mainSeriesProperties.hollowCandleStyle.borderColor": options.riseColor,
    "mainSeriesProperties.hollowCandleStyle.borderUpColor": options.riseColor,
    "mainSeriesProperties.hollowCandleStyle.wickColor": options.riseColor,
    "mainSeriesProperties.hollowCandleStyle.wickUpColor": options.riseColor,
    "mainSeriesProperties.haStyle.upColor": options.riseColor,
    "mainSeriesProperties.haStyle.borderColor": options.riseColor,
    "mainSeriesProperties.haStyle.borderUpColor": options.riseColor,
    "mainSeriesProperties.haStyle.wickUpColor": options.riseColor,
    "mainSeriesProperties.barStyle.upColor": options.riseColor,
    "mainSeriesProperties.candleStyle.downColor": options.fallColor,
    "mainSeriesProperties.candleStyle.borderDownColor": options.fallColor,
    "mainSeriesProperties.candleStyle.wickDownColor": options.fallColor,
    "mainSeriesProperties.hollowCandleStyle.downColor": options.fallColor,
    "mainSeriesProperties.hollowCandleStyle.borderDownColor": options.fallColor,
    "mainSeriesProperties.hollowCandleStyle.wickDownColor": options.fallColor,
    "mainSeriesProperties.haStyle.downColor": options.fallColor,
    "mainSeriesProperties.haStyle.borderDownColor": options.fallColor,
    "mainSeriesProperties.haStyle.wickDownColor": options.fallColor,
    "mainSeriesProperties.barStyle.downColor": options.fallColor,
});

export const toggleThemeStudies = ({fallColor, riseColor}) => ({
    "volume.color.0": fallColor,
    "volume.color.1": riseColor,
});
