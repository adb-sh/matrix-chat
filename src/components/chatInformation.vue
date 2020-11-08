<template>
  <div id="chatInformation">
    <h1>open chat</h1>
    <icon class="closeBtn" onclick="this.parentNode.style.display = 'none'" ic="./sym/ic_close_white_24px.svg" />
    <div id="box">
      <div class="informationBox">
      <div class="picBoxBig"><div class="placeholderBig"><p>O P</p></div></div>
      <div class="roomInformation">
        <div class="roomName">Open Chat room</div>
        <div class="users">2 members in group</div>
      </div>
      </div>
      <div id="textMembers">Members</div>
      <div class="contentBox">
        <div class="picBox"><div class="picPlaceholder"><p>O P</p></div></div>
        <div class="information">
          <div class="userName">{{name}}</div>
          <div class="status">{{status}}</div>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
import icon from './icon.vue';

export default {
  name: "chatInformation",
  components:{
    icon
  },
  props:{
    name: String,
    status: String
  }
}

</script>
<style scoped>
#chatInformation{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 5rem;
  width: calc(100% - 8rem);
  height: calc(100% - 10rem);
  background-color: #1d1d1d;
  box-shadow: 6px 6px 20px #111;
  border-radius: 1rem;
  text-align: center;
}
@media (max-width: 30rem) {
  #chatInformation{
    transform: unset;
    top: 0;
    left: 0;
    width: 100%;
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
#box{
  position: relative;
  width: calc(100% - 2rem);
  background-color: #2d2d2d;
  padding: 0.001rem 1rem 1rem;
  overflow: auto;
  max-height: calc(100% - 8rem);
}
.informationBox{
  margin-top: 0.2rem;
  height: 5rem;
  padding: 0.2rem;
  border-bottom: 2px solid #9c9c9c;
}
.picBoxBig{
  text-align: center;
  background-color: #42b983 ;
  width: 5rem;
  height:5rem;
  border-radius: 5rem;
}
.placeholderBig{
  padding-top: 1rem;
  margin-bottom: 1rem;
}
.roomInformation{
  position: relative;
  text-align: left;
  margin-top: -4rem;
  margin-left: 5.7rem;
}
.roomName{
  color: white;
  font-size: 1.8rem;
}
.users {
  font-size: 1.2rem;
  color: #9c9c9c;
}
#textMembers{
  font-size: 1.5rem;
  text-align: left;
  margin-left: 0.2rem;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
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
.userName{
  color: white;
}
.status{
  font-size: 0.8rem;
  color: #9c9c9c;
}
</style>