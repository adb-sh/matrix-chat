<template>
  <div class="newMessageBanner">
    <form v-on:submit.prevent="sendMessage()">
      <label for="newMessageInput"></label>
      <textarea v-on:keyup.shift.enter="sendMessage()" v-on:input="resizeMessageBanner()" ref="newMessageInput" id="newMessageInput" class="newMessageInput"
                autocomplete="off" placeholder="type a message ..." v-model="msg.content.text" />
      <icon @click.native="sendMessage()" title="press shift + enter to submit" id="sendMessageBtn"
            ic="./sym/ic_send_white_24px.svg" />
    </form>
  </div>
</template>

<script>
import icon from '@/components/icon.vue';
import main from '@/main.js';

export default {
  name: "newMessage",
  components: {
    icon
  },
  methods: {
    sendMessage(){
      if (this.msg.content.text !== "") {
        this.msg.time = Date.now()
        main.methods.sendWebSocket(this.msg)
        this.msg.content.text = ""
        document.getElementById("messagesContainer").style.height = "calc(100% - 7rem)"
        document.getElementById("newMessageInput").style.height = "1.25rem"
        //let msgContainer = document.getElementById("messagesContainer")
        //msgContainer.scrollTo(0, msgContainer.scrollHeight)
      }
    },
    resizeMessageBanner(){
      let id = this.$refs.newMessageInput
      id.style.height = '1.25rem'
      id.style.height = `${id.scrollHeight}px`
      let msgContainer = document.getElementById("messagesContainer")
      msgContainer.style.height
          = `calc(100% - ${id.parentElement.clientHeight}px - 3rem)`
    }
  },
  data(){
    return {
      msg: {
        type: "message",
        time: Date.now(),
        content: {
          user: "you",
          text: ""
        }
      },
      chatroom: main.data().chatroom
    }
  }
}
</script>

<style scoped>
.newMessageBanner{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: min-content;
  min-height: 4rem;
  background-color: #1d1d1d;
  border-radius: 1rem 1rem 0 0;
}
.newMessageInput{
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  left: 2rem;
  min-height: 1.25rem;
  max-height: 10rem;
  width: calc(100% - 7rem);
  height: 1.25rem;
  background-color: #fff0;
  border: 0 solid #fff0;
  color: #fff;
  font-size: 1rem;
  resize: none;
  vertical-align: middle;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
#sendMessageBtn{
  position: absolute;
  right: 1rem;
  bottom: 0.5rem;
}
#sendMessageBtn:hover::after{
  content: "press shift + enter to submit";
  position: absolute;
  padding: 1rem;
  bottom: 4rem;
  right: 0;
  width: 14rem;
  background-color: #eee;
  color: #000;
  border-radius: 1rem;
}
</style>