<template>
  <div>
    <div ref="msgContainer" id="messagesContainer" class="messagesContainer">
      <div id="messages" class="messages">
        <p style="text-align: center; font-style: italic;">you entered the chat</p>
        <div v-for="(message, i) in chatroom.messages" :key="message.time">
          <div v-if="message.content.user !== chatroom.username && function(){
               return i===0 || chatroom.messages[i-1].content.user!==message.content.user;}()"
               style="margin-left: 2rem; margin-top: 1rem">{{message.content.user}}
          </div>
          <messageReceive v-if="message.content.user !== chatroom.username" :msg=message.content.text />
          <message v-if="message.content.user === chatroom.username" :msg=message.content.text />
        </div>
      </div>
    </div>
    <newMessage />
    <icon v-on:click.native="scrollToBottom()" id="scrollDown" ic="./sym/expand_more-black-24dp.svg" />
    <topBanner />
    <chatInformation />
  </div>
</template>

<script>
import message from '@/components/message.vue';
import messageReceive from '@/components/messageReceive.vue';
import newMessage from '@/components/newMessage.vue';
import topBanner from '@/components/topBanner.vue';
import main from '@/main.js';
import ChatInformation from "@/components/chatInformation";
import Icon from "@/components/icon";
import matrix from '@/matrix.js';

export default {
  name: 'chat',
  components: {
    Icon,
    ChatInformation,
    message,
    messageReceive,
    newMessage,
    topBanner
  },
  methods:{
    scrollToBottom(){
      let msgContainer = document.getElementById("messagesContainer")
      msgContainer.scrollTo(0, msgContainer.scrollHeight)
      document.getElementById("scrollDown").style.display = "none"
    }
  },
  data(){
    return {
      chatroom: main.data().chatroom,
      sesssion: matrix.data().session
    }
  }
}
</script>

<style scoped>
.messagesContainer{
  position: absolute;
  margin: 0;
  left: 0;
  top: 3rem;
  height: calc(100% - 7rem);
  width: 100%;
  overflow-y: auto;
}
.messages{
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
#scrollDown{
  position: absolute;
  background-color: #fff;
  bottom: 5rem;
  right: 1rem;
  display: none;
}
</style>
