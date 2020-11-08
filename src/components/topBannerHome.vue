<template>
  <div class="topBannerHome">
    <div>
      <router-link to="/login"><icon class="smallIcon" id="icon-arrow" ic="./sym/arrow_back-24px.svg" /></router-link>
      <div id="container">
        <div id="chatName">{{roomInfo.name}}</div>
      </div>
      <icon v-on:click.native="showChatInfo()" class="smallIcon" id="icon-menu" ic="./sym/menu-24px.svg" />
    </div>
  </div>
</template>
<script>
import icon from '@/components/icon.vue';

export default {
  name: "topBannerHome",
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
.topBannerHome{
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
#icon-menu{
  position: absolute;
  right: 1rem;
  background-color: #2d2d2d;
}
#container{
  position: absolute;
  top: 0.5rem;
  left: 4.2rem;
  background-color: #2d2d2d;
  border-radius: 2rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}
#chatName{
  font-size: 1.8rem;
  color: #ededed;
}
</style>