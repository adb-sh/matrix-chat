<template>
  <div id="chatInformation">
    <div id="box">
      <div class="scrollContainer">
        <div class="informationBox">
        <div class="picBoxBig"><div class="placeholderBig">{{room.name.substr(0,2)}}</div></div>
        <div class="roomInformation">
          <div class="roomName">{{room.name}}</div>
          <div class="users">{{room.members.length}} members</div>
        </div>
        </div>
        <h2 v-if="room.members.length !== 0">members:</h2>
        <div v-for="member in room.members.slice(0,20)" :key="member.sender" class="contentBox" :title="member.sender">
          <!---<img v-if="member.content.avatar_url" class="picBox"
               :src="`https://adb.sh/_matrix/media/r0/thumbnail/adb.sh/${member.content.avatar_url.split('/',4)[3]}?width=64&height=64&method=crop`"/>-->
          <div class="picBox"><p>{{member.content.displayname?member.content.displayname.substr(0,2):member.sender.substr(1,2)}}</p></div>
          <div class="information">
            <div class="userName">{{member.content.displayname?member.content.displayname:member.sender}}</div>
            <div v-if="member.content.displayname" class="status">{{member.sender}}</div>
          </div>
        </div>
        <p v-if="room.members.length>20">and {{room.members.length-20}} other members</p>
      </div>
    </div>
    <icon class="closeBtn" onclick="this.parentNode.style.display = 'none'" ic="./sym/ic_close_white_24px.svg" />
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
    room: {}
  }
}

</script>
<style scoped>
#chatInformation{
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
  display: none;
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
@media (max-height: 40rem) {
  #chatInformation{
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
#box{
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
.picBoxBig{
  text-align: center;
  background-color: #42a7b9;
  padding-top: 1.5rem;
  width: 5rem;
  height: 3.5rem;
  border-radius: 5rem;
  font-size: 2rem;
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
.contentBox{
  position: relative;
  margin-top: 0.5rem;
  height: 3rem;
  width: 100%;
}
.picBox{
  position: absolute;
  left: 0;
  top: 0;
  background-color: #42a7b9;
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
}
img.picBox{
  background-color: unset;
}
.information{
  position: absolute;
  left: 4rem;
  top: 0;
  width: calc(100% - 4rem);
}
.userName{
  position: absolute;
  top: 0.75rem;
  color: white;
}
.status{
  position: absolute;
  font-size: 0.8rem;
  top: 1.75rem;
  color: #9c9c9c;
}
</style>