<template>
  <div class="topBanner">
    <div>
      <router-link to="/room"><icon class="smallIcon" id="icon-arrow" ic="./sym/arrow_back-24px.svg" /></router-link>
      <icon class="smallIcon" id="picTop" ic="./sym/supervisor_account-24px.svg" />
      <div id="container">
        <div id="chatName">{{roomInfo.name}}</div>
        <div id="users">{{roomInfo.user.length}} members</div>
      </div>
      <icon v-on:click.native="showChatInfo()" class="smallIcon" id="icon-menu" ic="./sym/menu-24px.svg" />
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';

export default {
  name: "topBanner",
  components:{
    icon
  },
  methods:{
    showChatInfo(){
      document.getElementById("chatInformation").style.display = 'block';
    }
  },
  data(){
    return {
      roomInfo: {
        name: "open chat",
        user: []
      }
    }
  }
}
</script>
<style scoped>
.topBanner{
  position: absolute;
  width: 100%;
  height: 3rem;
  background-color: #1d1d1d;
  box-shadow: 0 3px 10px #111;
}
.smallIcon{
  top: 0.25rem;
  background-color: #2d2d2d;
  height: 2.5rem;
  width: 2.5rem;
}
#icon-arrow{
  position: absolute;
  left: 1rem;
}
#picTop{
  position: absolute;
  left: 4rem;
  background-color: #42a7b9;
}
#icon-menu{
  position: absolute;
  right: 1rem;
  background-color: #2d2d2d;
}
#container{
  position: absolute;
  top: 0.55rem;
  left: 7.5rem;
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