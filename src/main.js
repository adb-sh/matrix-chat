import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

export default {
  mounted() {
    sendMessage()
  },
  methods: {
    callSendMessage(data) {
      sendMessage(data)
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
socket.onclose = () => show_error('session timed out (refresh)')
socket.onmessage = (e) => {
  console.log(`data received => ${e.data}`)
  let msg = JSON.parse(e.data)
  if (msg.type === 'error') show_error(msg.content)
  else if (msg.type === 'message'){
    element('messages').innerHTML += `<messageReceive msg="${msg.content.message}" />`;
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