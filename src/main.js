import Vue from 'vue';
import App from './App.vue';
import Components from "./components";
import router from './router';

Vue.use(Components);
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
