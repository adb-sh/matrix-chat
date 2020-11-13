import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import login from './views/login.vue'
import chat from './views/chat.vue'
import rooms from './views/rooms.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/chat/*',
      name: 'chat',
      component: chat
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: rooms
    }
  ]
})

let chatroom = {
  name: "open chat",
  user: [],
  username: "you",
  messages: []
};

export default {
  data(){
    return {
      chatroom: chatroom
    }
  },
  methods: {
    error(msg){
      show_error(msg)
    },
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
      chatroom: chatroom
    }
  }
}).$mount('#app')

function element(id){ return document.getElementById(id)}
function show_error(msg) {
  let error_style = element('errorBox').style
  element('errorMessage').innerText = msg
  error_style.display = "block"
  error_style.animation = "slide-from-left alternate 0.2s"
  setTimeout(() => {error_style.animation = ""}, 200)
}