<template>
  <div class="newMessageBanner" ref="newMessageBanner">
    <div class="reply" v-if="replyTo" @click="resetReplyTo">
      <span class="username">{{calcUserName(replyTo.sender)}}</span><br>
      {{parseMessage(replyTo.content.body)}}
    </div>
    <form v-on:submit.prevent="sendMessage()">
      <textarea
        @keyup.enter.exact="sendMessage()"
        @input="resizeMessageBanner()"
        v-model="event.content.body"
        ref="newMessageInput" class="newMessageInput"
        rows="1" placeholder="type a message ..."
      />
      <icon
        type="submit"
        title="press enter to submit"
        class="sendMessageBtn"
        ic="./sym/ic_send_white.svg"
      />
    </form>
  </div>
</template>

<script>
import icon from '@/components/icon.vue';
import {matrix} from '@/main.js';
import {parseMessage} from '@/lib/eventUtils';
import {calcUserName} from '@/lib/matrixUtils';

export default {
  name: 'newMessage',
  components: {
    icon
  },
  props: {
    onResize: Function,
    roomId: String,
    replyTo: Object,
    resetReplyTo: Function
  },
  methods: {
    sendMessage(){
      let content = this.event.content;
      if (!content.body.trim()) return;
      matrix.sendEvent(this.event, this.roomId, this.replyTo);
      content.body = '';
      this.resetReplyTo();
      let id = this.$refs.newMessageInput;
      id.style.height = '1.25rem';
      this.onResize(id.parentElement.clientHeight);
    },
    resizeMessageBanner(){
      let id = this.$refs.newMessageInput;
      id.style.height = '1.25rem';
      id.style.height = `${id.scrollHeight}px`;
      this.onResize(this.$refs.newMessageBanner.clientHeight);
    },
    focusInput(){
      this.$refs.newMessageInput.focus();
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    onSelectEmoji(emoji) {
      this.event.content.body += emoji.data;
    },
    parseMessage,
    calcUserName
  },
  data(){
    return {
      event: {
        type: 'm.room.message',
        content: {
          body: '',
          msgtype: 'm.text',
          'm.relates_to': {
            'm.in_reply_to': {
              event_id: undefined
            }
          }
        }
      },
      showEmojiPicker: false
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
  min-height: 3.5rem;
  background-color: #1d1d1d;
  border-radius: 1rem 1rem 0 0;
}
.newMessageInput{
  position: relative;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  padding: 0;
  left: 1rem;
  min-height: 1.5rem;
  max-height: 10rem;
  width: calc(100% - 7rem);
  height: 1.25rem;
  background-color: #fff0;
  border: 0 solid #fff0;
  appearance: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
  resize: none;
  vertical-align: middle;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.sendMessageBtn{
  position: absolute;
  right: 1rem;
  bottom: 0.25rem;
  background-color: unset;
}
.reply{
  position: relative;
  width: calc(100% - 7rem);
  left: 1rem;
  border-left:  2px solid #fff;
  padding-left: 0.5rem;
  margin-top: 0.75rem;
  margin-right: 0.5rem;
  word-break: break-word;
  white-space: pre-line;
}
.username{
  font-weight: bold;
}
</style>