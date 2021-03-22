<template>
  <div class="topBanner">
    <div>
      <icon @click.native="closeChat()" class="topIcon" ic="./sym/arrow_back-24px.svg" />
      <div @click="openChatInfo()" class="container">
        <avatar class="topIcon avatar" :mxcURL="getMxcFromRoom(room)" :fallback="room.roomId" :size="3"/>
        <div class="chatName">{{room.name}}</div>
        <div class="info">{{Object.keys(room.currentState.members).length}} members</div>
      </div>
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';
import avatar from "@/components/avatar";
import {getMxcFromRoom} from "@/lib/getMxc";


export default {
  name: "topBanner",
  components:{
    icon,
    avatar
  },
  props:{
    room: [Object, undefined],
    closeChat: Function,
    openChatInfo: Function
  },
  methods: {
    getMxcFromRoom
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
.topIcon{
  position: absolute;
  width: 3rem;
  height: 3rem;
  left: 0.5rem;
  top: 0.25rem;
  background-color: unset;
  box-shadow: none;
}
.container{
  position: absolute;
  height: 100%;
  width: calc(100% - 3.5rem);
  right: 0;
}
.chatName{
  position: absolute;
  top: 1rem;
  left: 4rem;
}
.info{
  position: absolute;
  top: 2rem;
  left: 4rem;
  font-size: 0.8rem;
}
</style>