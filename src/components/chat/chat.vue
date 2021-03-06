<template>
  <div>
    <div @mouseover="onActive()" ref="chatContainer" class="chatContainer">
      <div @scroll="onScroll()" ref="timelineContainer" class="timelineContainer">
        <div v-if="loadingStatus" @click="loadEvents()" class="loadMore">{{loadingStatus}}</div>
        <p v-if="room.timeline.length === 0" class="chatInfo">this room is empty</p>
        <timeline
          v-if="room.timeline.length"
          :timeline="room.timeline" :group-timeline="isGroup()"
          :user="user" :roomId="room.roomId"
          :setReplyTo="setReplyTo"
          :beforeUpdate="()=>scrollBottom = scroll.getScrollBottom()"
          :onUpdate="()=>manageScrollBottom()"
          :receipts="room._receipts"
        />
      </div>
      <icon v-if="showScrollBtn" @click.native="scroll.scrollToBottom()" id="scrollDown" ic="./sym/ic_expand_more_black.svg" />
    </div>
    <overlay class="overlay">
      <popup-question
        v-if="room.currentState.members[matrix.user].membership==='invite'"
        class="acceptInvite"
        title="Accept Invite"
        reject="Reject"
        :question="`Join ${room.name}?`"
        :callback="()=>matrix.client.joinRoom(room.roomId)"
        :onReject="()=>matrix.client.leave(room.roomId)"
      />
    </overlay>
    <newMessage
      :onResize="resize" :roomId="room.roomId" ref="newMessage"
      :replyTo="replyTo" :resetReplyTo="resetReplyTo"
    />
    <topBanner :info="getTypingInfo()" :room="room" :close-chat="closeChat" :open-chat-info="openChatInfo"/>
  </div>
</template>

<script>
import newMessage from '@/components/chat/newMessage.vue';
import topBanner from '@/components/chat/topBanner.vue';
import Icon from '@/components/layout/icon';
import {matrix} from '@/main.js';
import splitArray from '@/lib/splitArray.js'
import timeline from '@/components/chat/timeline';
import scrollHandler from '@/lib/scrollHandler';
import {getUser, calcUserName} from '@/lib/matrixUtils';

export default {
  name: 'chat',
  components: {
    timeline,
    Icon,
    newMessage,
    topBanner,
    overlay:()=>import('@/components/layout/overlay'),
    popupQuestion:()=>import('@/components/layout/popupQuestion')
  },
  props: {
    room: [Object, undefined],
    user: String,
    closeChat: Function,
    openChatInfo: Function
  },
  methods:{
    onScroll(){
      if (this.$refs.timelineContainer.scrollTop < 400 && this.loadingStatus !== 'loading') this.loadEvents();
      this.showScrollBtn = this.scroll.getScrollBottom() > 500;
    },
    resize(height = this.$refs.newMessage.$refs.newMessageBanner.clientHeight){
      this.scrollBottom = this.scroll.getScrollBottom();
      this.$refs.chatContainer.style.height = `calc(100% - ${height}px - 3.5rem)`;
      this.manageScrollBottom();
    },
    isGroup(){
      return Object.keys(this.room.currentState.members).length > 2;
    },
    async loadEvents(){
      this.loadingStatus = 'loading';
      await matrix.client.scrollback(this.room, 30);
      this.loadingStatus = 'load more';
    },
    setReplyTo(event){
      this.replyTo=event;
      this.$refs.newMessage.focusInput();
      this.$nextTick(this.resize);
    },
    resetReplyTo(){
      this.replyTo=undefined;
      this.$nextTick(this.resize);
    },
    manageScrollBottom(){
      if(this.scroll.getScrollBottom() < 400 && this.loadingStatus !== 'loading') this.scroll.scrollToBottom();
      else this.scroll.setScrollBottom(this.scrollBottom);
    },
    getUsersTyping(){
      return Object.values(this.room.currentState.members).filter(user => user.typing && user.userId!==this.matrix.user);
    },
    getTypingInfo(){
      let usersTyping = this.getUsersTyping();
      if (!usersTyping) return null;
      switch (usersTyping.length) {
      case 0: return '';
      case 1: return `${calcUserName(usersTyping[0].userId)} is typing ...`;
      case 2: return `${calcUserName(usersTyping[0].userId)} and ${calcUserName(usersTyping[1].userId)} are typing ...`;
      default: return`${calcUserName(usersTyping[0].userId)} and ${usersTyping.length-1} others are typing ...`;
      }
    },
    getLatestEvent(room){
      return room.timeline.length && room.timeline[room.timeline.length-1]
    },
    onActive(){
      if(this.isActive) return;
      this.isActive = true;
      setTimeout(()=>this.isActive=false, 10000);
      if (this.getLatestEvent(this.room)) matrix.client.setRoomReadMarkers(
        this.room.roomId,
        this.getLatestEvent(this.room).event.event_id,
        this.getLatestEvent(this.room)
      );
    },
    getUser,
    calcUserName,
    splitArray
  },
  data(){
    return {
      showScrollBtn: false,
      scrollOnUpdate: true,
      loadingStatus: 'load more',
      scroll: ()=>{},
      replyTo: undefined,
      active: false,
      matrix,
      scrollBottom: 0
    }
  },
  beforeUpdate(){
    this.scrollBottom = this.scroll.getScrollBottom();
  },
  updated(){
    this.manageScrollBottom();
  },
  mounted(){
    this.scroll = new scrollHandler(this.$refs.timelineContainer);
    this.$nextTick(this.scroll.scrollToBottom());
    this.onScroll();
    this.onActive();
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
  .timelineContainer{
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
.overlay{
  z-index: 20;
}
.acceptInvite{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.info{
  font-style: italic;
  margin-left: 1rem;
}
</style>