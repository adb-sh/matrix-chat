import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {router} from '@/router'
import {MatrixHandler} from './lib/matrixHandler.js'
import {cookieHandler} from './lib/cookieHandler.js';

Vue.config.productionTip = false;
Vue.use(VueRouter);

export let matrix = new MatrixHandler();

let cookie = new cookieHandler().getCookies();
if (cookie && cookie.baseUrl && cookie.accessToken && cookie.userId) {
  matrix.tokenLogin(cookie.baseUrl, cookie.accessToken, cookie.userId);
}

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  data() {
    return {}
  }
}).$mount('#app');
