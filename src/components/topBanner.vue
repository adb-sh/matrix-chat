<template>
  <div class="topBanner">
    <div>
      <icon @click.native="closeChat()" class="smallIcon" id="icon-arrow" ic="./sym/arrow_back-24px.svg" />
      <div @click="showChatInfo()" class="smallIcon" id="picTop">{{room.name.substr(0,2)}}</div>
      <div id="container">
        <div id="chatName">{{room.name}}</div>
        <div id="users">{{Object.keys(room.currentState.members).length}} members</div>
      </div>
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';
import main from '@/main.js';
import matrix from '@/matrix.js';

export default {
  name: "topBanner",
  components:{
    icon,
  },
  props:{
    room: [Object, undefined],
    closeChat: Function
  },
  methods:{
    showChatInfo(){
      document.getElementById("chatInformation").style.display = 'block';
    }
  },
  data(){
    return {
      chatroom: main.data().chatroom,
      session: matrix.data().session
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
  height: 3rem;
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
#picTop{
  position: absolute;
  left: 3.5rem;
  background-color: #42a7b9;
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