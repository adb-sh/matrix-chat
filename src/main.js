import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import {router} from './router.js'

Vue.config.productionTip = false
Vue.use(VueRouter)



export default {
  methods: {
    router(route){router.push(route)}
  }
}

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  data(){
    return {
    }
  }
}).$mount('#app')
