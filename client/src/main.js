// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import router from './router'
import VueSocketIO from 'vue-socket.io'
Vue.config.productionTip = false
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import store from './store'
// import { Toast,MessageBox } from "mint-ui";
Vue.use(MintUI)

/* eslint-disable no-new */
Vue.use(new VueSocketIO({
  debug: true,
  // 服务器端地址
  // connection: 'http://127.0.0.1:3000/socket.io/socket.io.js',
  connection: 'http://192.168.43.247:3000',
  vuex: {       // 不需要用到vuex这个可以不加
    store
  }
}))


new Vue({
  el: '#app',
  router,
  store,
  render: x => x(App)
})
