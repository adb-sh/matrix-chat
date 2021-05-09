import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {router} from '@/router'
import {MatrixHandler} from './lib/MatrixHandler.js'
import {DataStore} from '@/lib/DataStore';

Vue.config.productionTip = false;
Vue.use(VueRouter);

export let matrix = new MatrixHandler();

let store = new DataStore();

if (store.get('baseUrl') && store.get('accessToken') && store.get('userId')) {
  matrix.tokenLogin(store.get('baseUrl'), store.get('accessToken'), store.get('userId'));
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
