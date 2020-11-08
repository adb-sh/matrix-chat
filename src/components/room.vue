<template>
  <div id="chatInformation">
    <div class="box">
    <div class="contentBox">
      <div class="picBox"><div class="picPlaceholder"><p>O P</p></div></div>
      <div class="information">
        <div class="roomName">{{roomName}}</div>
        <div class="status">{{onlineUsers}} Online</div>
      </div>
    </div>
    <div class="contentBox">
      <div class="picBox"><div class="picPlaceholder"><p>O P</p></div></div>
      <div class="information">
        <div class="roomName">Open Chatroom 2</div>
        <div class="status">3 Online</div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "room",
  props: {
    roomName: String,
    onlineUsers: String
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
#chatInformation{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 3rem;
  width: 100%;
  height: calc(100% - 3rem);
  background-color: #1d1d1d;
  box-shadow: 6px 6px 20px #111;
  text-align: center;
}
.box{
  position: relative;
  background-color: #2d2d2d;
  overflow: auto;
  max-height: 100%;
}
.contentBox{
  margin-top: 0.2rem;
  height: 3.2rem;
  border-bottom: 2px solid #9c9c9c ;
  padding: 0.2rem;
  max-height: 48px;
}
.picBox{
  text-align: center;
  background-color: #00BCD4;
  width: 3rem;
  height:3rem;
  border-radius: 2rem;
}
.picPlaceholder{
  padding-top: 0.001rem;
  margin-bottom: 1rem;
}
.information{
  position: relative;
  text-align: left;
  margin-top: -2.4rem;
  margin-left: 3.7rem;
}
.roomName{
  color: white;
}
.status{
  font-size: 0.8rem;
  color: #9c9c9c;
}

</style>