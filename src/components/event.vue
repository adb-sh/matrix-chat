<template>
  <div class="event">
    <div v-if="event.type==='m.room.message'" :class="type==='send'?'messageSend':'messageReceive'" class="message">
      <reply-event :event="replyEvent" v-if="replyEvent"/>
      <event-content :content="event.content"/>
      <div class="time">{{getTime(event.origin_server_ts)}}</div>
    </div>
    <div v-else :class="type==='send'?'info send':'info receive'">
      <span v-if="event.type==='m.room.member'">{{membershipEvents[event.content.membership](event)}}</span>
      <span v-else>unsupported event: {{event.type}}</span>
      <span class="time"> {{getTime(event.origin_server_ts)}}</span>
    </div>
  </div>
</template>

<script>
import {matrix} from '@/main';
import {calcUserName} from '@/lib/matrixUtils';
import {parseMessage} from '@/lib/eventUtils';
import {getTime} from '@/lib/getTimeStrings';
import {getMediaUrl} from '@/lib/getMxc';
import ReplyEvent from '@/components/replyEvent';
import EventContent from '@/components/eventContent';

export default {
  name: 'message',
  components: {EventContent, ReplyEvent},
  props: {
    type: String,
    event: Object,
    onUpdate: Function
  },
  methods:{
    async getReplyEvent(event){
      let replyId = this.getReplyId(event.content);
      return replyId && await matrix.client.fetchRoomEvent(this.event.room_id, replyId);
    },
    getReplyId(content){
      return content['m.relates_to']
        && content['m.relates_to']['m.in_reply_to']
        && content['m.relates_to']['m.in_reply_to'].event_id
    },
    calcUserName,
    parseMessage,
    getTime,
    getMediaUrl
  },
  data(){
    return{
      replyEvent: undefined,
      membershipEvents:{
        invite(event){ return `invited ${event.target?calcUserName(event.target.userId):event.content.displayname||event.state_key}` },
        join(event){
          if (!event.unsigned.prev_content) return 'joined the room';
          if (event.unsigned.prev_content.displayName !== event.content.displayname)
            return `changed displayname from ${event.unsigned.prev_content.displayname} to ${event.content.displayname}`;
          return 'updated their account';
        },
        leave(){ return 'left the room' },
        ban(event){return `banned ${calcUserName(event.target.userId)}` }
      }
    }
  },
  created(){
    this.getReplyEvent(this.event).then((res) => this.replyEvent = res);
  },
  updated(){
    this.onUpdate();
  }
}
</script>

<style scoped lang="scss">
.event{
  .info {
    font-style: italic;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    .time {
      font-size: 0.7rem;
    }
  }
  .info.send{
    text-align: right;
  }
  .message{
    position: relative;
    width: max-content;
    min-width: 2rem;
    max-width: calc(100% - 5rem);
    padding: 0.8rem 1rem 0.45rem 1rem;
    background-color: #42a7b9;
    border-radius: 1rem 1rem 0 1rem;
    text-align: left;
    word-break: break-word;
    white-space: pre-line;
    margin-top: 0.25rem;
    .reply{
      border-left:  2px solid #fff;
      padding-left: 0.5rem;
      margin-bottom: 0.5rem;
      .username{
        font-weight: bold;
      }
    }
    .time{
      position: relative;
      bottom: -0.2rem;
      font-size: 0.7rem;
      text-align: right;
    }
    .notice{
      font-style: italic;
    }
  }
  .messageReceive{
    background-color: #424141;
    border-radius: 1rem 1rem 1rem 0;
  }
  .messageSend{
    margin-left:auto;
    margin-right:0;
    background-color: #357882;
    border-radius: 1rem 1rem 0 1rem;
  }
  .notice{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    .time{
      font-size: 0.7rem;
    }
  }
}
</style>