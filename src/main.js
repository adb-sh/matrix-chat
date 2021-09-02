import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {router} from '@/router'
import {MatrixHandler} from './lib/MatrixHandler.js'
import {DataStore} from '@/lib/DataStore';
import {enableBackgroundMode} from '@/lib/backgroundMode';
import VueLazyRenderer from 'vue-lazy-renderer';
import {fetchConfig} from '@/lib/getConfig';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueLazyRenderer);

export let matrix = new MatrixHandler();

Promise.all([
  fetchConfig().then(conf => console.log('config:', conf)),
  new DataStore().get('login').then(login => {
    if (login && login.baseUrl && login.accessToken && login.userId && login.deviceId) {
      return matrix.tokenLogin(login);
    }
  })
]).then(() => {
  enableBackgroundMode();
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App},
    data() {
      return {}
    }
  }).$mount('#app');
});
