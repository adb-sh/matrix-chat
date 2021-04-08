<template>
  <div class="event">
    <div v-if="event.content.msgtype==='m.text'" :class="type==='send'?'messageSend':'messageReceive'" class="message">
      <div v-if="replyEvent" class="reply">
        <span class="username">{{calcUserName(replyEvent.sender)}}</span><br>
        <span v-html="replyEvent.type==='m.room.message'?parseMessage(replyEvent.content.body):'unkown event'"></span>
      </div>
      <div v-html="parseMessage(event.content.body)"></div>
      <div class="time">{{getTime(event.origin_server_ts)}}</div>
    </div>
    <div v-else-if="event.content.msgtype==='m.notice'" class="notice">
      {{event.content.body}}
      <span class="time">{{getTime(event.origin_server_ts)}}</span>
    </div>
    <div v-else-if="event.type==='m.room.member'" class="info">
      {{membershipEvents[event.content.membership](event)}}
      <span class="time">{{getTime(event.origin_server_ts)}}</span>
    </div>
    <div v-else class="info">unknown event
      <span class="time">{{getTime(event.origin_server_ts)}}</span>
    </div>
  </div>
</template>

<script>
import {matrix} from '@/main';
import {calcUserName} from '@/lib/matrixUtils';
import {parseMessage} from '@/lib/eventUtils';
import {getTime} from '@/lib/getTimeStrings';

export default {
  name: 'message',
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
    calcMembershipEvents(){

    },
    calcUserName,
    parseMessage,
    getTime
  },
  data(){
    return{
      replyEvent: undefined,
      membershipEvents:{
        invite(event){ return `invited ${calcUserName(event.target.userId)}` },
        join(event){
          if (event.content.displayname !== null) return `changed username to ${event.content.displayname}`
          return 'joined the room'
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