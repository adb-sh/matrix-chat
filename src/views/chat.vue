<template>
  <div>
    <div ref="chatContainer" class="chatContainer">
      <div @scroll="scrollHandler()" ref="msgContainer" id="messagesContainer" class="messagesContainer">
        <div v-if="loadingStatus" @click="loadEvents()" class="loadMore">{{loadingStatus}}</div>
        <div id="messages" class="messages" ref="messages">
          <p v-if="room.timeline.length === 0" class="chatInfo">this room is empty</p>
          <div class="timeGroup" v-for="timeGroup in splitArray(room.timeline,
          obj => getDate(obj.event.origin_server_ts),obj => obj.event)" :key="timeGroup[0].origin_server_ts">
            <div class="time">{{getDate(timeGroup[0].origin_server_ts)}}</div>
            <div class="eventGroup" v-for="group in splitArray(timeGroup, obj => obj.sender)" :key="group[0].origin_server_ts">
              <div :class="isGroup()?'groupEvent':'eventContainer'">
                <div class="thumbnailContainer">
                  <div class="filler"></div>
                  <userThumbnail v-if="group[0].sender !== user && isGroup()" :fallback="group[0].sender"
                                 class="userThumbnail"
                                 :mxcURL="getUser(group[0].sender).avatarUrl" :size="2"/>
                </div>
                <div class="username" v-if="group[0].sender !== user && isGroup()">{{getUser(group[0].sender).displayName || group[0].sender}}</div>
                <div class="event" v-for="event in group" :key="event.origin_server_ts" :title="`${group[0].sender} at ${getTime(event.origin_server_ts)}`">
                  <message v-if="event.content.msgtype==='m.text'" :type="event.sender === user?'send':'receive'"
                           :group="false"
                           :msg=event.content.body :time=getTime(event.origin_server_ts) />
                  <div v-else-if="event.type==='m.room.member'" class="info">{{membershipEvents[event.content.membership]}}</div>
                  <div v-else class="info">unknown event</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <icon v-if="showScrollBtn" @click.native="scrollToBottom()" id="scrollDown" ic="./sym/expand_more-black-24dp.svg" />
    </div>
    <newMessage :onResize="height=>resize(height)" :roomId="room.roomId"/>
    <topBanner :room="room" :close-chat="()=>closeChat()" :open-chat-info="()=>openChatInfo()"/>
  </div>
</template>

<script>
import message from '@/components/message.vue';
import newMessage from '@/components/newMessage.vue';
import topBanner from '@/components/topBanner.vue';
import Icon from '@/components/icon';
import userThumbnail from '@/components/userThumbnail';
import {matrix} from '@/main';

export default {
  name: 'chat',
  components: {
    Icon,
    message,
    newMessage,
    topBanner,
    userThumbnail
  },
  props: {
    room: [Object, undefined],
    user: String,
    closeChat: Function,
    openChatInfo: Function
  },
  methods:{
    scrollToBottom(){
      this.$refs.msgContainer.scrollTop = this.$refs.msgContainer.scrollHeight;
    },
    getTime(time){
      let date = new Date(time);
      return `${date.getHours()}:${(date.getMinutes()<10)?'0':''}${date.getMinutes()}`;
    },
    getDate(time){
      let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      let date = new Date(time);
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    },
    scrollHandler(){
      if (this.$refs.msgContainer.scrollTop === 0) this.loadEvents();
      let msg = this.$refs.msgContainer;
      this.showScrollBtn = msg.scrollHeight - msg.scrollTop > msg.offsetHeight + 200;
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
    },
    resize(height){
      this.$refs.chatContainer.style.height = `calc(100% - ${height}px - 3.5rem)`;
    },
    isGroup(){
      return Object.keys(this.room.currentState.members).length > 2;
    },
    async loadEvents(){
      this.loadingStatus = 'loading ...';
      await matrix.client.paginateEventTimeline(this.room.getLiveTimeline(), {backwards: true})
        .then(state => this.loadingStatus = state?'load more':false);
    },
    getUser(userId){
      return matrix.client.getUser(userId);
    }
  },
  data(){
    return {
      showScrollBtn: false,
      scrollOnUpdate: true,
      membershipEvents:{
        invite: 'was invented',
        join: 'joined the room',
        leave: 'left the room',
        ban: 'was banned'
      },
      loadingStatus: 'load more'
    }
  },
  updated(){
    //this.scrollToBottom();
  },
  mounted(){
    //this.scrollToBottom();
  }
}
</script>

<style scoped lang="scss">
.chatContainer{
  position: absolute;
  margin: 0;
  left: 0;
  top: 3.5rem;
  width: 100%;
  height: calc(100% - 7rem);
  .messagesContainer{
    height: 100%;
    overflow-y: auto;
    .messages{
      position: relative;
      margin-top: 1rem;
      margin-bottom: 1rem;
      .eventGroup{
        position: relative;
        width: 100%;
        height: fit-content;
        margin-top: 0.75rem;
        .info{
          font-style: italic;
          margin: 1rem;
        }
      }
      .chatInfo{
        text-align: center;
        font-style: italic;
        margin: 1rem;
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
    }

  }
  #scrollDown{
    position: absolute;
    background-color: #fff;
    bottom: 1rem;
    right: 1rem;
    display: block;
    height: 2rem;
    width: 2rem;
  }
}
.groupEvent{
  margin-left: 2rem;
}

.thumbnailContainer{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  .filler{
    height: calc(100% - 2rem);
  }
  .userThumbnail{
    position: sticky;
    bottom: 0.5rem;
    width: 2rem;
    height: 2rem;
    margin-left: 0.5rem;
  }
}
.username{
  margin-left: 1rem;
}
.loadMore{
  position: relative;
  background-color: #2d2d2d;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: fit-content;
  left: 50%;
  transform: translate(-50%,0);
  margin-top: 0.5rem;
  cursor: pointer;
}
</style>
