<template>
  <div class="chatInfo">
    <div class="box">
      <div class="scrollContainer">
        <div class="topContainer">
          <avatar
            class="roomImage"
            :mxcURL="getMxcFromRoom(room)"
            :fallback="room.roomId"
            :size="5"
          />
          <div class="info">
            <div class="roomName">{{room.name}}</div>
            <div class="users">{{members.length}} members</div>
          </div>
        </div>
        <user-list-element v-for="member in members.slice(0,20)" :key="member" :user="getUser(member)"/>
        <p v-if="members.length>20">and {{members.length-20}} other members</p>
      </div>
    </div>
    <icon class="closeBtn" @click.native="closeChatInfo()" ic="./sym/ic_close_white.svg" />
  </div>
</template>
<script>
import icon from './icon.vue';
import UserListElement from "@/components/userListElement";
import avatar from "@/components/avatar";
import {getMxcFromRoom} from "@/lib/getMxc";
import {getUser} from "@/lib/matrixUtils";

export default {
  name: "chatInformation",
  components:{
    avatar,
    UserListElement,
    icon,
  },
  props:{
    room: {},
    closeChatInfo: Function
  },
  methods: {
    getMembers(){
      return Object.keys(this.room.currentState.members)
    },
    getUser,
    getMxcFromRoom
  },
  data(){
    return{
      members: this.getMembers()
    }
  }
}

</script>
<style scoped>
.chatInfo{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 5rem;
  width: calc(100% - 4rem);
  max-width: 30rem;
  height: calc(100% - 10rem);
  background-color: #1d1d1d;
  box-shadow: 6px 6px 20px #111;
  border-radius: 1rem;
  text-align: center;
  z-index: 30;
}
@media (max-width: 30rem) {
  .chatInfo{
    transform: unset;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
@media (max-height: 40rem) {
  .chatInfo{
    top: 0;
    height: 100%;
  }
}
.closeBtn{
  position: absolute;
  top: 0;
  right: 0;
  background-color: #0000;
  box-shadow: none;
}
.box{
  position: absolute;
  top: 0;
  width: calc(100% - 2rem);
  padding: 0 1rem 0 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.scrollContainer{
  padding: 1rem 0 1rem 0;
  position: absolute;
  width: 100%;
  height: auto;
}
.info{
  position: absolute;
  top: 1rem;
  left: 6rem;
  text-align: left;
}
.roomName{
  color: white;
  font-size: 1.8rem;
}
.users {
  font-size: 1.2rem;
  color: #9c9c9c;
}
.topContainer{
  position: relative;
  height: 6rem;
  width: 100%;
}
.roomImage{
  position: absolute;
  width: 5rem;
  height: 5rem;
  left: 0;
}
</style>