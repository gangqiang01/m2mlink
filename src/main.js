// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import swal from 'sweetalert'
import Cookies from './assets/js/cookie'
import _g from './assets/js/global'
import store from './vuex/store'
import moment from 'moment';
import filter from './assets/js/filter'
import {i18n, vueI18n} from './lang/lang'

import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/base.scss';
import './assets/css/global.scss';

window.axios = axios;
window.swal = swal;
window.Cookies = Cookies;
window._g = _g;
window.store = store;
window.router = router;
window.moment = moment;

axios.defaults.baseURL = 'https://portal-rmm.wise-paas.com';
axios.defaults.timeout = 1000 * 200
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
axios.defaults.headers['Content-Type'] = 'application/json'

Vue.config.productionTip = false

Vue.use(ElementUI)

vueI18n(Vue)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    filter,
    i18n,
    template: '<router-view></router-view>'
})
