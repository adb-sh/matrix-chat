<template>
  <div class="topBanner">
    <div>
      <icon @click.native="closeChat()" class="smallIcon" id="icon-arrow" ic="./sym/arrow_back-24px.svg" />
      <userThumbnail @click.native="openChatInfo()" class="userThumbnail"
                     :mxcURL="getUrl()" :fallback="room.roomId" :size="3"/>
      <div id="container">
        <div id="chatName">{{room.name}}</div>
        <div id="users">{{Object.keys(room.currentState.members).length}} members</div>
      </div>
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';
import {matrix} from "@/main";
import userThumbnail from "@/components/userThumbnail";
import sdk from 'matrix-js-sdk'

export default {
  name: "topBanner",
  components:{
    icon,
    userThumbnail
  },
  props:{
    room: [Object, undefined],
    closeChat: Function,
    openChatInfo: Function
  },
  data(){
    return {
    }
  },
  methods: {
    getRoom(roomId) {
      return matrix.client.getRoom(roomId);
    },
    getUrl(){
      let avatarState = this.room.getLiveTimeline().getState(sdk.EventTimeline.FORWARDS).getStateEvents("m.room.avatar");
      return avatarState.length>0?avatarState[avatarState.length-1].getContent().url:undefined;
     //return this.room.getLiveTimeline().getStateEvents("m.room.avatar");
    }
  }
}
</script>
<style scoped>
.topBanner{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3.5rem;
  background-color: #1d1d1d;
}
.smallIcon{
  top: 0.25rem;
  background-color: #2d2d2d;
  padding-top: 0.75rem;
  height: 1.75rem;
  width: 2.5rem;
  box-shadow: none;
  border-radius: 1.25rem;
  text-align: center;
  user-select: none;
  cursor: pointer;
}
#icon-arrow{
  height: 2.5rem;
  position: absolute;
  left: 0.5rem;
  background-color: unset;
  box-shadow: none;
}
.userThumbnail{
  position: absolute;
  top: 0.25rem;
  left: 3.5rem;
  width: 3rem;
  height: 3rem;
}
#container{
  position: absolute;
  top: 0.55rem;
  left: 7rem;
}
#chatName{
  font-size: 1rem;
  color: #ededed;
}
#users{
  font-size: 0.75rem;
  color: #9c9c9c;
}
</style>