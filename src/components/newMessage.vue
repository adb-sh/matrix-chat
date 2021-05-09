<template>
  <div class="newMessageBanner" ref="newMessageBanner">
    <reply-event v-if="replyTo" :event="replyTo" @click.native="resetReplyTo()"/>
    <div v-if="attachment" class="attachment">
      <event-content :content="attachment" class="attachmentContent" :compact="true"/>
      <icon
        title="remove"
        class="remove"
        ic="./sym/ic_close_white.svg"
        @click.native="resetAttachment()"
      />
    </div>
    <textarea
      @keyup.enter.exact="onSubmit(event)"
      @input="resizeMessageBanner(); sendTyping(2000);"
      v-model="event.content.body"
      ref="newMessageInput" class="newMessageInput"
      rows="1" placeholder="type a message ..."
    />
    <icon
      v-if="event.content.body && !getRecordingState() || attachment"
      type="submit"
      title="press enter to submit"
      class="sendMessageBtn"
      :ic="isSending?'./sym/throbber.svg':'./sym/ic_send_white.svg'"
      @click.native="onSubmit(event)"
    />
    <sound-recorder v-else class="recorder" :on-stop="setAttachment" ref="recorder"/>
    <div class="mediaButtons">
      <icon
        title="toggle emoji"
        class="leftBtn emojiToggle"
        ic="./sym/ic_insert_emoticon_white.svg"
        @click.native="toggleEmojiPicker()"
      />
     <fileUpload class="leftBtn" :on-change="setAttachment"/>
    </div>
    <v-emoji-picker
      v-show="showEmojiPicker"
      class="emojiPicker"
      @select="onSelectEmoji"
      :dark="true"
      :continuousList="true"
    />
  </div>
</template>

<script>
import icon from '@/components/icon.vue';
import {matrix} from '@/main.js';
import {parseMessage} from '@/lib/eventUtils';
import {calcUserName} from '@/lib/matrixUtils';
import ReplyEvent from '@/components/replyEvent';
import {VEmojiPicker} from 'v-emoji-picker';
import EventContent from '@/components/eventContent';
import SoundRecorder from '@/components/soundRecorder';
import FileUpload from '@/components/fileUpload';

export default {
  name: 'newMessage',
  components: {
    FileUpload,
    SoundRecorder,
    EventContent,
    ReplyEvent,
    icon,
    VEmojiPicker
  },
  props: {
    onResize: Function,
    roomId: String,
    replyTo: Object,
    resetReplyTo: Function
  },
  methods: {
    onSubmit(event){
      if (this.isSending) return;
      event.content.msgtype==='m.text'?this.sendEvent(event):this.sendMediaEvent(event);
    },
    async sendEvent(event){
      if (!event.content.body.trim()) return;
      this.setReplyTo(this.replyTo);
      this.isSending = true;
      await matrix.sendEvent(new Proxy(this.event, this.eventProxyHandler), this.roomId);
      this.isSending = false;
      event.content.body = '';
      this.resetAttachment();
      this.resetReplyTo();
      let id = this.$refs.newMessageInput;
      id.style.height = '1.25rem';
      this.onResize(id.parentElement.clientHeight);
    },
    sendMediaEvent(event){
      this.isSending = true;
      matrix.client.uploadContent(this.attachment.blob).then(mxc => {
        event.content.url = mxc;
        this.sendEvent(event);
      });
    },
    sendTyping(timeout){
      if (this.waitForSendTyping) return;
      matrix.client.sendTyping(this.roomId, true, timeout+100);
      setTimeout(()=>this.waitForSendTyping=false, timeout);
    },
    setReplyTo(event){
      this.event.content['m.relates_to'] = {
        'm.in_reply_to': event
      }
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
    getRecordingState(){
      return this.$refs.recorder && this.$refs.recorder.isRecording
    },
    async setAttachment({blob, file = blob}){
      this.attachment = {
        msgtype: this.getMsgType(file.type),
        mimetype: file.type,
        url: window.URL.createObjectURL(file),
        filename: file.name,
        blob,
        file
      };
      this.event.content = {
        body: file.name,
        msgtype: this.attachment.msgtype,
        mimetype: this.attachment.mimetype,
        filename: file.name
      };
    },
    resetAttachment(){
      if (!this.attachment) return this.attachment = undefined;
      window.URL.revokeObjectURL(this.attachment.file);
      this.event.content = {
        body: this.attachment?this.event.content.body.replace(this.attachment.filename, ''):'',
        msgtype: 'm.text'
      };
      this.attachment = undefined;
    },
    getMsgType(fileType){
      return {
        'image': 'm.image',
        'audio': 'm.audio',
        'video': 'm.video'
      }[fileType.split('/', 1)[0]] || 'm.file';
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
            'm.in_reply_to': undefined
          }
        }
      },
      eventProxyHandler: {
        set: () => true,
        get: (target, key) => {
          if (typeof target[key] === 'object') return new Proxy(Object.assign({}, target[key]), this.eventProxyHandler);
          return target[key];
        }
      },
      showEmojiPicker: false,
      waitForSendTyping: false,
      attachment: undefined,
      isSending: false
    }
  },
  updated() {
    this.$nextTick(this.resizeMessageBanner);
  }
}
</script>

<style scoped lang="scss">
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
  left: 5.5rem;
  min-height: 1.5rem;
  max-height: 10rem;
  width: calc(100% - 10rem);
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
.emojiPicker{
  position: absolute;
  bottom: calc(100% + 0.25rem);
  left: 0.25rem;
  z-index: 10;
  max-width: calc(100% - 0.5rem - 2px);
}
.mediaButtons{
  position: absolute;
  left: 0;
  bottom: 0;
  height: fit-content;
  width: fit-content;
}
.leftBtn{
  position: relative;
  left: 0.25rem;
  bottom: 0.5rem;
  background-color: unset;
  height: 2.5rem;
  width: 2.5rem;
  box-shadow: none;
}
.recorder{
  position: absolute;
  height: 100%;
  bottom: 0;
  right: 0;
  border-radius: 0 1rem 0 0;
}
.attachment{
  top: 0.5rem;
  left: 0.5rem;
  position: relative;
  width: fit-content;
  height: fit-content;
  .attachmentContent{
    position: relative;
    width: fit-content;
  }
  .remove{
    position: absolute;
    top: 0;
    right: -3rem;
    background-color: unset;
    height: 2.5rem;
    width: 2.5rem;
  }
}
img{
  max-width: 10rem;
  height: auto;
  max-height: 4rem;
  border-radius: 0.5rem;
}
</style>