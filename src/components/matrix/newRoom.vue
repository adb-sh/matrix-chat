<template>
  <popup :on-close="callback">
    <h2>New room</h2>
    <input v-model="name" type="text" placeholder="Room name">
    <select v-model="access">
      <option>private</option>
      <option>public</option>
    </select><br>
    <textarea v-model="description" placeholder="Room description"></textarea><br>
    <h3>Add User</h3>
    <user-search :filter="prop=>!users.find(temp=>temp===prop)" :callback="addUser" class="userSearch"/>
    <h3 v-if="users.length">User</h3>
    <div>
      <user-list-element
        v-for="user in users"
        :user="user" :key="user.userId"
        @click.native="removeUser(user)"
      />
    </div>
    <textbtn :text="action" @click.native="createRoom({name, users, description, access}).then(callback)"/>
    <textbtn text="Cancel" @click.native="callback(false)" class="outline"/>
    <overlay v-if="loading"><throbber text="loading"/></overlay>
  </popup>
</template>

<script>
import textbtn from '@/components/layout/textbtn';
import popup from '@/components/layout/popup';
import userListElement from '@/components/matrix/userListElement';
import UserSearch from '@/components/matrix/userSearch';
import overlay from '@/components/layout/overlay';
import throbber from '@/components/layout/throbber';
import {createRoom} from '@/lib/matrixUtils';

export default {
  name: 'popupQuestion',
  components: {
    UserSearch,
    textbtn,
    popup,
    userListElement,
    overlay,
    throbber
  },
  props:{
    props: Object,
    callback: Function,
    action: {
      type: String,
      default: 'Apply'
    }
  },
  data(){
    return{
      name: this.props.name,
      description: this.props.description,
      users: [],
      loading: false,
      access: 'private'
    }
  },
  methods:{
    addUser(user){
      if (this.users.find(tmp => tmp === user)) return;
      this.users.push(user);
      this.userSearch = '';
    },
    removeUser(user){
      this.users = this.users.filter(tmp => tmp !== user);
    },
    async createRoom(props){
      this.loading = true;
      return await createRoom(props);
    }
  }
}
</script>

<style scoped lang="scss">
textarea{
  width: 100%;
}
.userSearch{

}
</style>