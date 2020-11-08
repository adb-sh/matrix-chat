<template>
  <div>
    <div ref="msgContainer" id="messagesContainer" class="messagesContainer">
      <div id="messages" class="messages">
        <p style="margin-left: 1rem; font-style: italic;">You entered the chat</p>
        <message style="display: none;" />
        <messageReceive style="display: none;" />
      </div>
    </div>
    <newMessage />
    <topBanner />
  </div>
</template>

<script>
import message from '@/components/message.vue';
import messageReceive from '@/components/messageReceive.vue';
import newMessage from '@/components/newMessage.vue';
import topBanner from "@/components/topBanner";

export default {
  name: 'chat',
  components: {
    message,
    messageReceive,
    newMessage,
    topBanner
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
</style>
