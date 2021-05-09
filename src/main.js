import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {router} from '@/router'
import {MatrixHandler} from './lib/MatrixHandler.js'
import {DataStore} from '@/lib/DataStore';

Vue.config.productionTip = false;
Vue.use(VueRouter);

export let matrix = new MatrixHandler();

(async () => {
  let login = await new DataStore().get('login');
  if (login && login.baseUrl && login.accessToken && login.userId) {
    matrix.tokenLogin(login.baseUrl, login.accessToken, login.userId);
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
})()


