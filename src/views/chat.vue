<template>
  <div>
    <div ref="chatContainer" class="chatContainer">
      <div @scroll="scrollHandler()" ref="msgContainer" id="messagesContainer" class="messagesContainer">
        <div v-if="loadingStatus" @click="loadEvents()" class="loadMore">{{loadingStatus}}</div>
        <p v-if="room.timeline.length === 0" class="chatInfo">this room is empty</p>
        <timeline :timeline="room.timeline" :group-timeline="isGroup()" :user="user"/>
      </div>
      <icon v-if="showScrollBtn" @click.native="scrollToBottom()" id="scrollDown" ic="./sym/expand_more-black-24dp.svg" />
    </div>
    <newMessage :onResize="height=>resize(height)" :roomId="room.roomId"/>
    <topBanner :room="room" :close-chat="()=>closeChat()" :open-chat-info="()=>openChatInfo()"/>
  </div>
</template>

<script>
import newMessage from '@/components/newMessage.vue';
import topBanner from '@/components/topBanner.vue';
import Icon from '@/components/icon';
import {matrix} from '@/main';
import splitArray from '@/lib/splitArray.js'
import timeline from '@/components/timeline';

export default {
  name: 'chat',
  components: {
    timeline,
    Icon,
    newMessage,
    topBanner
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
    scrollHandler(){
      if (this.$refs.msgContainer.scrollTop === 0) this.loadEvents();
      let msg = this.$refs.msgContainer;
      this.showScrollBtn = msg.scrollHeight - msg.scrollTop > msg.offsetHeight + 200;
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
    },
    splitArray
  },
  data(){
    return {
      showScrollBtn: false,
      scrollOnUpdate: true,
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