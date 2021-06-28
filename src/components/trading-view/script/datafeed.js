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

    onReady = callBack => new Promise(resolve => {
        resolve();
    }).then(() => callBack(DataFeed.defaultConfiguration()));


    searchSymbols = () => {};

    resolveSymbol = (symbolName, onSymbolResolvedCallback) => new Promise((resolve) => {
        let symbolInfo = DataFeed.defaultSymbol();
        if (this.options) {
            symbolInfo = {...DataFeed.defaultSymbol(), ...this.options};
        }
        resolve(symbolInfo);
    }).then(result => onSymbolResolvedCallback(result)).catch(() => console.log("onResolveErrorCallback"));

    getBars = (symbolInfo, resolution, from, to, onHistoryCallback) => {
        const onLoadedCallback = (data) => {
            let bars = data.bars || [];
            bars.forEach((item) => item.time = this.periodLengthSeconds(resolution, item));
            let meta = {noData: data.noData};
            onHistoryCallback(bars, meta);
        };
        this.v.getBars(symbolInfo, resolution, from, to, onLoadedCallback);
    };

    subscribeBars = (symbolInfo, resolution, onRealtimeCallback, subscriberUID) => {
        this.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, subscriberUID);
    };

    subscribeDataListener = (symbolInfo, resolution, onRealtimeCallback, subscriberUID) => {
        // eslint-disable-next-line no-prototype-builtins
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

    static defaultConfiguration = () => ({
        exchanges: [{value: '', name: 'Piexgo', desc: ''}],
        symbols_types: [{name: 'All types', value: ''}],
        supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '720', '1D', '1W', '1M'],
        supports_marks: true,
        supports_timescale_marks: true,
        supports_time: true,
    });


    static defaultSymbol = () => ({
        name: 'BTC_USDT',
        'exchange-traded': '',
        'exchange-listed': '',
        timezone: 'Asia/Singapore',
        minmov: 1, // 最小波动
        pointvalue: 1,
        fractional: false,
        session: '24x7',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        has_no_volume: false,
        description: 'BTC_USDT',
        pricescale: 100,
        ticker: 'BTC_USDT',
        supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '720', '1D', '1W', '1M'],
    });

    periodLengthSeconds(resolution, item) {
        return metaInterval.includes(resolution) ? item.time = (item.time + (24 * 60 * 60)) * 1000 : item.time *= 1000;
    }
}