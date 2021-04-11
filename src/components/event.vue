<template>
  <div class="event">
    <div v-if="event.type==='m.room.message'" :class="type==='send'?'messageSend':'messageReceive'" class="message">
      <reply-event :event="replyEvent" v-if="replyEvent"/>

      <div v-if="event.content.msgtype==='m.text'" v-html="parseMessage(event.content.body)"/>
      <div v-else-if="event.content.msgtype==='m.notice'" class="notice" v-html="parseMessage(event.content.body)"/>
      <div v-else-if="event.content.msgtype==='m.image'" class="image">
        <img :src="getMediaUrl(event.content.url)" :alt="event.content.body"/><br>
        {{event.content.body}}
      </div>
      <div v-else-if="event.content.msgtype==='m.file'" class="file">
        file: <a :href="getMediaUrl(event.content.url)">
          {{event.content.filename || getMediaUrl(event.content.url)}}
        </a><br>{{event.content.body}}
      </div>
      <div v-else-if="event.content.msgtype==='m.audio'" class="audio">
        <audio controls>
          <source :src="getMediaUrl(event.content.url)" :type="event.content.mimetype">
          your browser doesn't support audio
        </audio><br>
        {{event.content.body}}
      </div>
      <div v-else-if="event.content.msgtype==='m.video'" class="video">
        <video controls>
          <source :src="getMediaUrl(event.content.url)" :type="event.content.mimetype">
          your browser doesn't support video
        </video><br>
        {{event.content.body}}
      </div>
      <div v-else class="italic">unsupported message type {{event.content.msgtype}}</div>

      <div class="time">{{getTime(event.origin_server_ts)}}</div>
    </div>
    <div v-else class="info">
      <span v-if="event.type==='m.room.member'">{{membershipEvents[event.content.membership](event)}}</span>
      <span v-else>unsupported event</span>
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

export default {
  name: 'message',
  components: {ReplyEvent},
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
    .image{
      width: 100%;
      img{
        max-width: 100%;
        height: auto;
        max-height: 35rem;
        border-radius: 0.5rem;
      }
    }
    .video{
      width: 100%;
      video{
        max-width: 100%;
        height: auto;
        max-height: 35rem;
        border-radius: 0.5rem;
      }
    }
    .audio{
      audio{
        max-width: 100%;
      }
    }
    .italic{
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