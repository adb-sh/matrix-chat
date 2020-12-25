<template>
  <div>
    <div @scroll="scrollHandler()" ref="msgContainer" id="messagesContainer" class="messagesContainer">
      <div id="messages" class="messages">
        <p v-if="session.currentRoom.messages.length === 0" class="info">this room is empty</p>
        <!--<div v-for="(message, i) in session.currentRoom.messages" :key="message.origin_server_ts" class="event">
          <div v-if="i===0 || getDate(session.currentRoom.messages[i-1].origin_server_ts)!==getDate(message.origin_server_ts)"
               style="margin-left: 2rem; margin-top: 1rem" class="info">{{getDate(message.origin_server_ts)}}
          </div>
          <div v-if="(message.sender !== session.user) && (i===0 || session.currentRoom.messages[i-1].sender!==message.sender)"
               style="margin-left: 3rem; margin-top: 1rem">{{message.sender}}
          </div>
          <message :type="message.sender === session.user?'send':'receive'"
                   :group="session.currentRoom.members.length > 2"
                   :msg=message.content.body :time=getTime(message.origin_server_ts) />
          <userThumbnail v-if="(message.sender !== session.user) && (i===session.currentRoom.messages.length-1 || session.currentRoom.messages[i+1].sender!==message.sender)"
                         :userId="message.sender" width="64" height="64" resizeMethod="scale" class="userThumbnail" />
        </div>-->
        <div class="eventGroup" v-for="group in splitEventsToGroups(session.currentRoom.messages)" :key="group[0].origin_server_ts">
          <div class="username" v-if="group[0].sender !== session.user">{{group[0].sender}}</div>
          <div class="thumbnailContainer">
            <userThumbnail v-if="group[0].sender !== session.user && session.currentRoom.members.length > 2" :userId="group[0].sender" width="64" height="64" resizeMethod="scale" class="userThumbnail" />
          </div>
          <div class="event" v-for="message in group" :key="message.origin_server_ts">
            <message :type="message.sender === session.user?'send':'receive'"
                     :group="session.currentRoom.members.length > 2"
                     :msg=message.content.body :time=getTime(message.origin_server_ts) />
          </div>
        </div>
      </div>
    </div>
    <newMessage />
    <icon v-if="showScrollBtn" @click.native="scrollToBottom()" id="scrollDown" ic="./sym/expand_more-black-24dp.svg" />
    <topBanner />
  </div>
</template>

<script>
import message from '@/components/message.vue';
import newMessage from '@/components/newMessage.vue';
import topBanner from '@/components/topBanner.vue';
import main from '@/main.js';
import Icon from "@/components/icon";
import matrix from '@/matrix.js';
import userThumbnail from '@/components/userThumbnail';

export default {
  name: 'chat',
  components: {
    Icon,
    message,
    newMessage,
    topBanner,
    userThumbnail
  },
  methods:{
    scrollToBottom(){
      let msgContainer = document.getElementById("messagesContainer")
      msgContainer.scrollTo(0, msgContainer.scrollHeight)
    },
    getTime(time){
      let date = new Date(time);
      return `${date.getHours()}:${(date.getMinutes()<10)?"0":""}${date.getMinutes()}`;
    },
    getDate(time){
      let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      let date = new Date(time);
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    scrollHandler(){
      if (this.$refs.msgContainer.scrollTop === 0){
        console.log("load messages")
      }
      let msgContainer = document.getElementById("messagesContainer")
      this.showScrollBtn = msgContainer.scrollHeight - msgContainer.scrollTop > msgContainer.offsetHeight + 200;
    },
    splitEventsToGroups(events){
      let payload = [[]];
      let group = 0;
      for(let i=0; i<events.length; i++){
        payload[group].push(events[i]);
        if (events[i].sender !== (events[i+1]?events[i+1].sender:undefined) ||
            this.getDate(events[i].origin_server_ts) !== this.getDate(events[i+1]?events[i+1].origin_server_ts:undefined)){
          if (i < events.length-1) payload.push([]);
          group++;
        }
      }
      return payload;
    }
  },
  data(){
    return {
      chatroom: main.data().chatroom,
      session: matrix.data().session,
      showScrollBtn: false,
      scrollOnUpdate: true
    }
  },
  updated(){
    //this.scrollToBottom();
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
  display: block;
}
.info{
  text-align: center;
  font-style: italic;
  margin: 1rem;
}
.eventGroup{
  position: relative;
  width: 100%;
  height: fit-content;
  margin-top: 0.75rem;
}
.userThumbnail{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
.thumbnailContainer{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 3rem;
}
.username{
  margin-left: 3rem;
}
</style>
