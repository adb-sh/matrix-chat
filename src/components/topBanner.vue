<template>
  <div class="topBanner">
    <div>
      <icon @click.native="$router.back()" class="smallIcon" id="icon-arrow" ic="./sym/arrow_back-24px.svg" />
      <icon v-on:click.native="showChatInfo()" class="smallIcon" id="picTop" ic="./sym/supervisor_account-24px.svg" />
      <div id="container">
        <div id="chatName">{{chatroom.name}}</div>
        <div id="users">{{chatroom.user.length}} members</div>
      </div>
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';
import main from '@/main.js';

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
      chatroom: main.data().chatroom
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
  height: 2.5rem;
  width: 2.5rem;
}
#icon-arrow{
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