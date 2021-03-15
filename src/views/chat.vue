<template>
  <div>
    <div @scroll="scrollHandler()" ref="msgContainer" id="messagesContainer" class="messagesContainer">
      <div id="messages" class="messages">
        <p v-if="room.timeline.length === 0" class="info">this room is empty</p>
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
        <div class="timeGroup" v-for="timeGroup in splitArray(room.timeline, obj => getDate(obj.event.origin_server_ts), obj => obj.event)" :key="timeGroup[0].origin_server_ts">
          <div class="time">{{getDate(timeGroup[0].origin_server_ts)}}</div>
          <div class="eventGroup" v-for="group in splitArray(timeGroup, obj => obj.sender)" :key="group[0].origin_server_ts">
            <div class="username" v-if="group[0].sender !== user">{{group[0].sender}}</div>
            <div class="thumbnailContainer">
              <userThumbnail v-if="group[0].sender !== user && room._membersPromise.length > 2" :userId="group[0].sender" width="64" height="64" resizeMethod="scale" class="userThumbnail" />
            </div>
            <div class="event" v-for="event in group" :key="event.origin_server_ts">
              <message :type="event.sender === user?'send':'receive'"
                       :group="room._membersPromise.length > 2"
                       :msg=event.content.body :time=getTime(event.origin_server_ts) />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<newMessage />-->
    <icon v-if="showScrollBtn" @click.native="scrollToBottom()" id="scrollDown" ic="./sym/expand_more-black-24dp.svg" />
    <!--<topBanner />-->
  </div>
</template>

<script>
import message from '@/components/message.vue';
//import newMessage from '@/components/newMessage.vue';
//import topBanner from '@/components/topBanner.vue';
import Icon from "@/components/icon";
import userThumbnail from '@/components/userThumbnail';

export default {
  name: 'chat',
  components: {
    Icon,
    message,
    //newMessage,
    //topBanner,
    userThumbnail
  },
  props: {
    room: {},
    user: String
  },
  methods:{
    scrollToBottom(){
      this.$nextTick(() => this.$refs.msgContainer.scrollTop = this.$refs.msgContainer.scrollHeight);
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
    splitArray(arr, key, get=obj=>obj){
      let payload = [[]];
      arr.forEach((obj, i) => {
        let nextObj = arr[i+1];
        payload[payload.length-1].push(get(obj));
        if (!nextObj) return payload;
        if (key(obj) !== key(nextObj)) payload.push([]);
      })
      return payload;
    }
  },
  data(){
    return {
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
  margin-left: 1rem;
}
.time{
  top: 0.25rem;
  position: sticky;
  z-index: 100;
  background-color: #2d2d2d;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: fit-content;
  left: 50%;
  transform: translate(-50%,0);
  margin-top: 0.5rem;
}
</style>
