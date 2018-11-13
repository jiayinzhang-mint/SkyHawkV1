// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'
import qs from 'qs';

Vue.config.productionTip = false

import {
    Vuetify,
    VApp, // required
    VNavigationDrawer,
    VToolbar,
    VList,
    VDivider,
    VCard,
    VTabs,
    VBtn,
    VTextField,
    VIcon,
    VSubheader,
    VMenu,
    VAvatar,
    VDataTable,
    VDataIterator,
    VSelect,
    VBottomNav,
    VImg,
    VProgressLinear,
    VGrid,
    VFooter,
    VChip,
    transitions,
    VDialog,
    VTimeline
} from 'vuetify'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    components: {
        VApp,
        VNavigationDrawer,
        VToolbar,
        VList,
        VDivider,
        VCard,
        VTabs,
        VBtn,
        VTextField,
        VIcon,
        VSubheader,
        VMenu,
        VAvatar,
        VDataTable,
        VDataIterator,
        VSelect,
        VBottomNav,
        VImg,
        VProgressLinear,
        VGrid,
        VFooter,
        VChip,
        transitions,
        VDialog,
        VTimeline
    },
    directives: {
        Ripple
    },
    theme: {
        primary: colors.blue.lighten1, // #E53935
    }

})
require('vuetify/src/stylus/app.styl')


if (process.env.NODE_ENV === 'development') {
    require('element-ui/lib/theme-chalk/index.css')
}

import ELEMENT from 'element-ui'
Vue.use(ELEMENT)


import VueInitialsImg from 'vue-initials-img';
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";

Vue.use(Viewer, {
    defaultOptions: {
        title: false,
        toolbar: 0,
        tooltip: false,
        navbar: 0
    }
})

Vue.use(VueInitialsImg);
Vue.use(require('vue-moment'));
//axios.defaults.baseURL = 'http://skyhawkapi.huilab.cn/api';
axios.defaults.baseURL = 'http://localhost:8000/api';

Vue.prototype.$ajax = axios;

import store from './store/store'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})

axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post' || config.method === 'put') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    _.toast("错误的传参", 'fail');
    return Promise.reject(error);
});

