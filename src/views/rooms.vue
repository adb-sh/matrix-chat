<template>
  <overlay v-if="matrix.loading"><throbber text="loading" class="center"/></overlay>
  <overlay v-else-if="!matrix.client">
    <popup-question :callback="()=>$router.push('/login')" :on-reject="()=>reconnect()"
    :title="'Connection failed'" :question="'Go to login?'" :reject="'Retry'" class="center"/>
  </overlay>
  <div v-else>
    <div id="roomList" class="roomList">
      <div ref="topLogo" class="top"><h1 class="wideElement topLogo">[chat]</h1><h1 class="smallElement topLogo">[c]</h1></div>
      <div class="stickySearch top" ref="stickySearch">
        <icon class="menu" ic="./sym/ic_menu_white.svg" @click.native="()=>showSideMenu=true"/>
        <input v-model="search.data" class="input wideElement search" type="text" maxlength="50" placeholder="search">
      </div>
      <div v-for="category in delayedSearch.data?[
        {rooms: matrix.rooms.all.filter(r=>matchResults(r.name, delayedSearch.data)||r.roomId===delayedSearch.data), name: 'rooms'}
      ]:[
        {rooms: matrix.rooms.favourite, name: 'favourites'},
        {rooms: matrix.rooms.other, name: 'rooms'},
        {rooms: matrix.rooms.lowPriority, name: 'low priority'}
      ].filter(c=>c.rooms.length)" :key="category.name">
        <p class="wideElement">- {{category.name}} -</p><p class="smallElement">—</p>
        <room-list-element
          v-for="room in category.rooms" :key="room.roomId"
          @click.native="openChat(room)"
          :room="room"
          class="roomListElement"
          @contextmenu.native.prevent="event=>setContextMenu({event, options:{
            'Add to Favourites':()=>{setTag(room, 'm.favourite'); removeTag(room, 'm.lowpriority'); },
            'Low Priority':()=>{setTag(room, 'm.lowpriority'); removeTag(room, 'm.favourite'); },
            'Reset Priority':()=>{removeTag(room, 'm.favourite'); removeTag(room, 'm.lowpriority'); },
            'Forget and Delete':()=>matrix.client.forget(room.roomId, true)
          }})"
        />
      </div>
      <div v-if="delayedSearch.data">
        <p class="wideElement">- users -</p><p class="smallElement">—</p>
        <user-list-element
          v-for="user in matrix.client.getUsers()
            .filter(prop=>matchResults(prop.displayName, delayedSearch.data)||matchResults(prop.userId, delayedSearch.data))
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
          <p v-if="isValidUserId(delayedSearch.data)"
            class="suggestion"
            @click="setQuestion({
            title:'New Chat',
            question:`Create private chat with '${delayedSearch.data}'?`,
            callback:()=>createRoom({users:[{userId:delayedSearch.data}], access: 'private'}).then(openChat)
          })"
          >create chat: {{delayedSearch.data}} ➤</p>
          <p v-if="isValidRoomId(delayedSearch.data)"
            class="suggestion"
            @click="setQuestion({
              title:'Join room',
              question:`Join '${delayedSearch.data}'?`,
              callback:()=>joinRoom(delayedSearch.data)
            })"
          >join room: {{delayedSearch.data}} ➤</p>
          <p v-if="delayedSearch.data.match(/^[a-zA-Z0-9_.+-]+$/)"
            @click="setShowCreateRoom({name: delayedSearch.data}, openChat)"
            class="suggestion"
          >create room: {{delayedSearch.data}} ➤</p>
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
      <sideMenu v-if="showSideMenu" :close="()=>showSideMenu=false"
        :options="{setShowCreateRoom, setQuestion}"/>
      <chatInformation v-if="showRoom && showChatInfo" :room="getCurrentRoom()" :close-chat-info="()=>showChatInfo=false" class="center"/>
      <new-room v-if="showCreateRoom.props" :callback="showCreateRoom.callback" :props="showCreateRoom.props" class="center"/>
      <popup-question v-if="popup.question" :callback="popup.callback" :onReject="popup.onReject" :question="popup.question" :title="popup.title" class="center"/>
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
import icon from '@/components/layout/icon';
import {DataStore} from '@/lib/DataStore';
import SideMenu from '@/components/layout/sideMenu';
import {setContextMenu} from '@/lib/contextMenuUtils';

export default {
  name: 'rooms',
  components:{
    SideMenu,
    Throbber,
    Overlay,
    PopupQuestion,
    userListElement,
    chat,
    chatInformation,
    roomListElement,
    newRoom,
    icon
  },
  methods:{
    openChat(room){
      this.showChatInfo = false;
      this.showRoom = false;
      this.$router.push(`/rooms/${room.roomId}`);
      this.$nextTick(() => this.showRoom = true);
      this.search.data = '';
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
        callback:()=>{
          this.popup = {};
          callback();
        },
        onReject:()=>{
          this.popup = {};
        }
      }
    },
    joinRoom(roomId){
      this.matrix.client.joinRoom(roomId).then(room=>{
        this.openChat(getRoom(room.roomId));
      });
    },
    setShowCreateRoom(props, callback=()=>{}){
      this.showCreateRoom = {
        props,
        callback:(res)=>{
          this.showCreateRoom = {};
          callback(res);
        }
      }
    },
    reconnect(){
      new DataStore().get('login').then(login => {
        if (login && login.baseUrl && login.accessToken && login.userId){
          matrix.tokenLogin(login.baseUrl, login.accessToken, login.userId);
        }
        else this.$router.push('/login');
      });
    },
    setTag(room, tag){
      matrix.client.setRoomTag(room.roomId, tag, {}).then(matrix.reloadRooms);
    },
    removeTag(room, tag){
      matrix.client.deleteRoomTag(room.roomId, tag).then(matrix.reloadRooms);
    },
    proxyOnTimeout(data, callback, ms){
      let timeout;
      return new Proxy(data, {
        set: (target, key, value) => {
          target[key] = value;
          clearTimeout(timeout);
          timeout = setTimeout(() => callback(data), ms);
          return true;
        },
        get: (target, key) => target[key]
      });
    },
    getMxcFromRoom,
    getRoom,
    getUser,
    isValidUserId,
    isValidRoomId,
    createRoom,
    setContextMenu
  },
  data(){
    return {
      matrix,
      showChatInfo: false,
      showRoom: true,
      delayedSearch: {data: ''},
      search: this.proxyOnTimeout({data: ''}, data=>this.delayedSearch={...data}, 250),
      popup:{},
      showCreateRoom:{},
      showSideMenu: false
    }
  },
  created(){
    if (matrix.client === undefined) this.$router.push('/login');
  },
  updated(){
    if (this.$refs.stickySearch) new IntersectionObserver(
      ([e]) => [e.target, this.$refs.topLogo].map(el=>el?.classList?.toggle('isSticky', e.intersectionRatio < 1)),
      {threshold: [1]}
    ).observe(this.$refs.stickySearch);
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
  background-color: var(--grey500);
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
  z-index: 10;
}
.roomListElement{
  position: relative;
  height: 3rem;
  margin: 0.5rem 0 0.5rem 0;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #222;
  transition: all 200ms;
}
.noRoomSelected{
  position: absolute;
  width: calc(100% - 20rem);
  top: 5rem;
  left: 20rem;
  text-align: center;
}
input{
  position: absolute;
  top: 50%;
  left: 4rem;
  transform: translate(0, -50%);
  margin: 0;
  width: calc(100% - 5.5rem);
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
.topLogo{
  margin: 0;
  padding: 0.75rem;
  font-size: 2rem;
}
.stickySearch{
  position: sticky;
  top: -1px;
  padding-top: 1px;
  width: 100%;
  height: 3.5rem;
  z-index: 10;
  .menu{
    position: absolute;
    left: 0.5rem;
    background-color: unset;
    box-shadow: none;
    top: 50%;
    transform: translate(0, -50%);
  }
}
.top{
  transition: 0.4s;
  background-color: inherit;
}
.top.isSticky{
  background-color: var(--grey600);
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
  .roomList::-webkit-scrollbar {
    display: none;
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
  .roomList:hover::-webkit-scrollbar {
    display: block;
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
