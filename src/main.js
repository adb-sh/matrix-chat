import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import login from './views/login.vue'
import chat from './views/chat.vue'

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
      path: '/chat',
      name: 'chat',
      component: chat
    }
  ]
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
}).$mount('#app')

export default {
  mounted() {
    sendMessage()
  },
  data(){
    return {
      roomInfo: {
        name: "open chat",
        user: []
      }
    }
  },
  methods: {
    sendMessage(message){
      let msg = {
        type: "message",
        time: Date.now(),
        content: {
          message: message
        }
      }
      socket.send(JSON.stringify(msg))
    },
    sendWebSocket(msg){
      socket.send(JSON.stringify(msg))
    }
  }
}

const wsurl = 'ws://127.0.0.1:8090'
const socket = new WebSocket(wsurl)

function element(id){ return document.getElementById(id)}

socket.onopen = () => {
  let msg = {
    type: "info",
    time: Date.now(),
    content: "new session"
  }
  socket.send(JSON.stringify(msg))
}
socket.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}
socket.onclose = () => show_error('session ended (refresh)')
socket.onmessage = (e) => {
  console.log(`data received => ${e.data}`)
  let msg = JSON.parse(e.data)
  if (msg.type === 'error') show_error(msg.content)
  else if (msg.type === 'route') router.push({path: msg.path})
  else if (msg.type === 'room'){
    this.roomInfo.user = msg.user
  }
  else if (msg.type === 'message'){
    //just for now, ik it's dirty
    element('messages').innerHTML +=
        `<div class="messageContainer" data-v-032da2b2="">
            <div class="message" data-v-032da2b2="">
                ${msg.content.text}
            </div>
        </div>`;
  }
}

function show_error(msg) {
  let error_style = element('errorBox').style
  element('errorMessage').innerText = msg
  error_style.display = "block"
  error_style.animation = "slide-from-left alternate 0.2s"
  setTimeout(() => {error_style.animation = ""}, 200)
}

function sendMessage(message){
  let msg = {
    type: "message",
    time: Date.now(),
    content: {
      message: message
    }
  }
  socket.send(JSON.stringify(msg))
}