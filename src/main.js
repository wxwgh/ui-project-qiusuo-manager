import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element-ui
import ElementUI from 'element-ui';
//引入elment-ui css
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入jquery
import $ from 'jquery';
//引入字体图标
import './assets/fonts/fonts.css';

//引入自定义通用方法脚本
import myCommon from './assets/plugins/common.js'
Vue.prototype.myCommon = myCommon;

//引入axios
import axios from 'axios';
Vue.prototype.axios = axios;

//引入animate css动画效果库
import animated from 'animate.css';
Vue.use(animated)



Vue.prototype.$UUID = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
