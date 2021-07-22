<template>
  <popup :on-close="closeChatInfo" class="popup">
    <div class="topContainer">
      <avatar
        class="roomImage"
        :mxcURL="getMxcFromChat(room)"
        :fallback="room.roomId"
        :size="5"
      />
      <div class="info">
        <div class="roomName">{{room.name}}</div>
        <div class="users">{{members.length}} members</div>
      </div>
    </div>
    <h3>Members</h3>
    <user-list-element
      v-for="member in members.slice(0,20)"
      :key="member.userId"
      :user="getUser(member.userId)"
      :info="member.typing?'is typing ...':null"
    />
    <p v-if="members.length>20">and {{members.length-20}} other members</p>
    <h3>Add User</h3>
    <user-search :filter="prop=>!(usersToAdd.find(temp=>temp===prop)||members.find(temp=>temp.userId===prop.userId))" :callback="addUser" class="userSearch"/>
    <div>
      <user-list-element
        v-for="user in usersToAdd"
        :user="user" :key="user.userId"
        @click.native="removeUser(user)"
      />
    </div>
    <textbtn v-if="usersToAdd.length" @click.native="inviteUsers(usersToAdd).then(()=>usersToAdd=[])">Invite</textbtn>
    <h3>Other</h3>
    <textbtn class="leave" @click.native="matrix.client.leave(room.roomId)">Leave room</textbtn>
  </popup>
</template>
<script>
import UserListElement from '@/components/matrix/userListElement';
import avatar from '@/components/matrix/avatar';
import {getMxcFromChat} from '@/lib/getMxc';
import {getUser} from '@/lib/matrixUtils';
import popup from '@/components/layout/popup';
import textbtn from '@/components/layout/textbtn';
import {matrix} from '@/main';
import userSearch from '@/components/matrix/userSearch';

export default {
  name: 'chatInformation',
  components:{
    avatar,
    UserListElement,
    popup,
    textbtn,
    userSearch
  },
  props:{
    room: {},
    closeChatInfo: Function
  },
  methods: {
    getMembers(){
      return Object.values(this.room.currentState.members)
    },
    addUser(user){
      if (this.usersToAdd.find(tmp => tmp === user)) return;
      this.usersToAdd.push(user);
      this.userSearch = '';
    },
    removeUser(user){
      this.usersToAdd = this.usersToAdd.filter(tmp => tmp !== user);
    },
    async inviteUsers(users){
      await Promise.all(users.map(async user => await matrix.client.invite(this.room.roomId, user.userId)));
      this.$forceUpdate();
    },
    getUser,
    getMxcFromChat
  },
  data(){
    return{
      members: this.getMembers(),
      matrix,
      usersToAdd: []
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
.popup{
  min-height: calc(100% - 10rem);
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
.leave{
  background-color: var(--red);
}
</style>