<template>
    <div :class="type==='send'?'messageSend':'messageReceive'" class="message">
      <div v-if="replyEvent" class="reply">
        {{replyEvent.sender}}<br>
        {{replyEvent.type==='m.room.message'?replyEvent.content.body:'unkown event'}}
      </div>
      <div v-html="parseMessage(msg)"></div>
      <div class="time">{{time}}</div>
    </div>
</template>

<script>
import {matrix} from "@/main";

export default {
  name: "message",
  props: {
    msg: String,
    time: String,
    type: String,
    content: Object,
    roomId: String
  },
  methods:{
    solveTextLinks(text){
      return (text || "").replace(
        /([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi,
        (match, space, url)=>{
          let hyperlink = url;
          if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink;
          }
          return `${space}<a href="${hyperlink}" target="_blank">${url}</a>`;
        }
      )
    },
    async getReplyEvent(content) {
      let replyId = this.getReplyId(content);
      if (replyId === undefined) return undefined;
      await matrix.client.fetchRoomEvent(this.roomId, replyId).then((res) => {
        this.replyEvent = res;
      });
    },
    getReplyId(content){
      if(!content['m.relates_to']) return undefined;
      return content['m.relates_to']['m.in_reply_to'].event_id || undefined;
    },
    parseMessage(msg){
      return this.solveTextLinks(
        msg.replace(/>.*\n/gm, '').trim()
          .replace(/</g, '&lt')
          .replace(/>/g, '&gt')
      );
    }
  },
  data(){
    return{
      replyEvent: undefined
    }
  },
  created() {
    this.getReplyEvent(this.content);
  }
}
</script>

<style scoped>
  .message{
    position: relative;
    width: max-content;
    min-width: 2rem;
    max-width: calc(100% - 5rem);
    padding: 0.7rem 1rem 0.45rem 1rem;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
    margin-top: 0.25rem;
  }
  .messageReceive{
    background-color: #42b983;
    border-radius: 1rem 1rem 1rem 0;
  }
  .messageSend{
    margin-left:auto;
    margin-right:0;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
  }
  .time{
    position: relative;
    bottom: -0.2rem;
    font-size: 0.7rem;
    text-align: right;
  }
  .reply{
    border-left:  2px solid #fff;
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>