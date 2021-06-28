import TradingView from "./trading-view";


const components = {
    TradingView,
};

const install = (vue) => {
    Object.keys(components).forEach((key) => {
        vue.component(key, components[key]);
    });
}

export default {
    ...components,
    install
}
