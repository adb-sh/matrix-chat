<template>
  <overlay v-if="matrix.loading"><throbber text="loading" class="center"/></overlay>
  <div v-else>
    <div id="roomList" class="roomList">
      <h1 class="wideElement">[chat]</h1><h1 class="smallElement">[c]</h1>
      <input v-model="search" class="input wideElement" type="text" maxlength="50" placeholder="search">
      <p class="wideElement">- rooms -</p>
      <room-list-element
        v-for="room in matrix.client.getRooms()
          .filter(prop=>matchResults(prop.name, search)||prop.roomId===search)"
        :key="room.roomId" @click.native="openChat(room)"
        :room="room"
        class="roomListElement"
      />
      <div v-if="search">
        <p class="wideElement">- users -</p><p class="smallElement">—</p>
        <user-list-element
          v-for="user in matrix.client.getUsers()
            .filter(prop=>matchResults(prop.displayName, search)||matchResults(prop.userId, search))
            .slice(0,10)"
          :user="user" :key="user.userId"
          @click.native="setQuestion({
            title:'New Chat',
            question:`Create private chat with '${user.displayName}'?`,
            callback:()=>createRoom({users:[user], access: 'private'}).then(openChat)
          })"
        />
        <p class="wideElement">- suggestions -</p><p class="smallElement">…</p>
        <div class="wideElement">
          <p v-if="isValidUserId(search)" class="suggestion">create chat: {{search}} ➤</p>
          <p v-if="isValidRoomId(search)"
            class="suggestion"
            @click="setQuestion({
              title:'Join room',
              question:`Join '${search}'?`,
              callback:()=>joinRoom(search)
            })"
          >join room: {{search}} ➤</p>
          <p v-if="search.match(/^[a-zA-Z0-9_.+-]+$/)"
            @click="setShowCreateRoom({name: search}, openChat)"
            class="suggestion"
          >create room: {{search}} ➤</p>
        </div>
      </div>
    </div>
    <chat
      class="chat"
      v-if="showRoom && getCurrentRoom()"
      :room="getCurrentRoom()"
      :user="matrix.user"
      :close-chat="closeChat"
      :open-chat-info="()=>showChatInfo=true"
    />
    <div class="noRoomSelected" v-else>Please select a room to be displayed.</div>
    <overlay>
      <chatInformation v-if="showRoom && showChatInfo" :room="getCurrentRoom()" :close-chat-info="()=>showChatInfo=false" class="center"/>
      <new-room v-if="showCreateRoom.props" :callback="showCreateRoom.callback" :props="showCreateRoom.props" class="center"/>
      <popup-question v-if="popup.question" :callback="popup.callback" :question="popup.question" :title="popup.title" class="center"/>
    </overlay>
  </div>
</template>

<script>
import chat from '@/components/chat/chat.vue';
import chatInformation from '@/components/chat/chatInformation';
import {matrix} from '@/main';
import {getMxcFromRoom} from '@/lib/getMxc';
import roomListElement from '@/components/matrix/roomListElement';
import {getRoom, getUser} from '@/lib/matrixUtils';
import {isValidUserId, isValidRoomId} from '@/lib/matrixUtils';
import userListElement from '@/components/matrix/userListElement';
import PopupQuestion from '@/components/layout/popupQuestion';
import newRoom from '@/components/matrix/newRoom';
import Overlay from '@/components/layout/overlay';
import Throbber from '@/components/layout/throbber';
import {createRoom} from '@/lib/matrixUtils';

export default {
  name: 'rooms',
  components:{
    Throbber,
    Overlay,
    PopupQuestion,
    userListElement,
    chat,
    chatInformation,
    roomListElement,
    newRoom
  },
  methods:{
    openChat(room){
      this.showChatInfo = false;
      this.showRoom = false;
      this.$router.push(`/rooms/${room.roomId}`);
      this.$nextTick(() => this.showRoom = true);
      this.search = '';
    },
    getCurrentRoom(){
      return getRoom(this.$route.path.split('/')[2]);
    },
    closeChat(){
      this.$router.push('/rooms');
    },
    matchResults(prop, search){
      return prop.toLowerCase().includes(search.toLowerCase().trim());
    },
    setQuestion({title, question, callback}){
      this.popup = {
        question,
        title,
        callback:(res)=>{
          this.popup = {};
          if (res) callback();
        }
      }
    },
    joinRoom(room){
      this.matrix.client.join(room).then(()=>{
        this.openChat(getRoom(room.room_id));
      });
    },
    setShowCreateRoom(props, callback=()=>{}){
      this.showCreateRoom = {
        props,
        callback:(res)=>{
          this.showCreateRoom = {};
          if (res) callback(res);
        }
      }
    },
    getMxcFromRoom,
    getRoom,
    getUser,
    isValidUserId,
    isValidRoomId,
    createRoom
  },
  data(){
    return {
      matrix,
      showChatInfo: false,
      showRoom: true,
      search: '',
      popup:{},
      showCreateRoom:{}
    }
  },
  mounted() {
    if (matrix.client === undefined) this.$router.push('/login');
  }
}
</script>

<style scoped lang="scss">
.roomList{
  position: absolute;
  left: 0;
  top: 0;
  width: 18rem;
  height: 100%;
  background-color: #222;
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.chat{
  position: absolute;
  right: 0;
  top: 0;
  width: calc(100% - 18rem);
  height: 100%;
  background-color: #313131;
}
.roomListElement{
  position: relative;
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #222;
}
.noRoomSelected{
  position: absolute;
  width: calc(100% - 20rem);
  top: 5rem;
  left: 20rem;
  text-align: center;
}
input{
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: calc(100% - 4rem);
}
.wideElement{
  display: block;
}
.smallElement{
  display: none;
}
.center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.suggestion{
  cursor: pointer;
  text-decoration: underline;
}
.suggestion:hover{
  background-color: #4444;
}

@media (max-width: 48rem) and (min-width: 30rem) {
  .wideElement{
    display: none;
  }
  .smallElement{
    display: block;
  }
  .roomList{
    z-index: 30;
    width: 4rem;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .roomList:hover{
    width: 18rem;
    scrollbar-width: thin;
    box-shadow: 0 0 20px #111;
    .wideElement{
      display: block;
    }
    .smallElement{
      display: none;
    }
  }
  .chat{
    width: calc(100% - 4rem);
  }
  .noRoomSelected{
    left: 4rem;
    width: calc(100% - 4rem);
  }
}

@media (max-width: 30rem) {
  .wideElement{
    display: block;
  }
  .smallElement{
    display: none;
  }
  .roomList{
    width: 100%;
  }
  .chat{
    width: 100%;
  }
  .noRoomSelected{
    display: none;
  }
}
</style>