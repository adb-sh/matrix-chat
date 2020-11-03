<template>
  <div class="newMessageBanner">
    <label for="newMessageInput"></label><textarea id="newMessageInput" class="newMessageInput" placeholder="type a message ..." v-model="content" />
    <icon id="sendMessageBtn" style="position: absolute; right: 1rem; bottom: 0.5rem;" ic="./sym/ic_send_white_24px.svg" />
  </div>
</template>

<script>
import icon from './icon.vue';
import sendMessage from '../main.js';

export default {
  name: "newMessage",
  components: {
    icon
  },
  props: {
    content: String
  },
  mounted() {
    ResizeListener(document.getElementById("newMessageInput"));
    document.getElementById("sendMessageBtn").addEventListener("click", () => {
      if (document.getElementById("newMessageInput").value !== '') {
        sendMessage.methods.callSendMessage(document.getElementById("newMessageInput").value)
        document.getElementById("newMessageInput").value = ''
        //sendMessage.methods.callSendMessage(this.data.message)
      }
    })
  },
  data: function () {
    return { message: this.content}
  }
}

export const ResizeListener = id => {
  id.addEventListener("input", function(){
    this.style.height = '1.25rem'
    this.style.height = `${this.scrollHeight}px`
    let msgContainer = document.getElementById("messagesContainer")
    msgContainer.style.height
        = `calc(100% - ${this.parentElement.clientHeight}px)`
    //msgContainer.scrollTo(0, msgContainer.scrollHeight)
  });
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
    max-height: 14rem;
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
</style>