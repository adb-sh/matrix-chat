<template>
  <div>
    <div v-if="accessDenied">access denied!</div>
    <div class="admin" v-else-if="users !== undefined">
      <h1>admin</h1>
      <h2>users</h2>
      <div class="tableScroll">
        <table>
          <tr>
            <th class="left">user</th>
            <th class="mid">displayname</th>
            <th class="mid">deactivated</th>
            <th class="mid">admin</th>
            <th class="right edit">edit</th>
          </tr>
          <tr v-for="user in users.users" :key="user.name">
            <td class="left">{{user.name}}</td>
            <td class="mid">{{user.displayname}}</td>
            <td class="mid">{{user.deactivated}}</td>
            <td class="mid">{{user.admin}}</td>
            <td class="right edit">
              <icon @click.native="newUser.userId = user.name" class="editIcon" type="submit" ic="./sym/ic_create_white.svg"/>
              <icon class="editIcon" type="submit" ic="./sym/ic_delete_white.svg"/>
            </td>
          </tr>
        </table>
      </div>
      <h2>update user</h2>
      <div class="update">
        <input v-model="newUser.userId" type="text" placeholder="userId"><br>
        <input v-model="newUser.password" type="password" placeholder="password"><br>
        <input v-model="newUser.displayname" type="text" placeholder="displayname">
      </div>
      <textbtn @click.native="updateUser()" text="update user"/>
    </div>
    <throbber-overlay v-if="loading" :text="loading"/>
  </div>
</template>

<script>
import {matrix} from "@/main";
import {AdminAPI} from "@/lib/AdminAPI";
import icon from "@/components/icon";
import textbtn from "@/components/textbtn";
import ThrobberOverlay from "@/components/throbberOverlay";

export default {
  name: "admin",
  components:{
    ThrobberOverlay,
    icon,
    textbtn
  },
  data(){
    return{
      users: undefined,
      newUser:{
        userId: '',
        password: '',
        displayname: '',
      },
      loading: false,
      accessDenied: false
    }
  },
  methods:{
    async updateUser(){
      await this.api.updateUser(this.newUser);
    }
  },
  async created() {
    this.loading = 'loading';
    this.api = new AdminAPI(matrix.baseUrl+'/_synapse/admin/', matrix.accessToken);
    this.users = await this.api.getUsers('users');
    this.accessDenied = !this.users;
    this.loading = false;
  }
}
</script>

<style scoped>
.admin{
  text-align: center;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}
.editIcon{
  float: left;
  margin: 0 0.25rem;
}
.edit{
  width: 6rem;
  text-align: center;
}
.tableScroll{
  position: relative;
  width: 100%;
  height: auto;
  overflow-x: auto;
}
table {
  position: relative;
  margin: auto;
  width: calc(100% - 2rem);
  max-width: 80%;
  background-color: #1f262b;
  box-shadow: 3px 3px 10px #333;
  border: 2px solid #fff;
  border-collapse: separate;
  border-spacing: 2px;
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  table-layout: auto;
  min-width: max-content;
}

tr {
  margin: auto;
  border: 1px solid #fff;
  text-align: left;
}

th {
  margin: auto;
  background-color: #546E7A;
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
}

td {
  margin: auto;
  background-color: #37474F;
  padding: 0.5rem;
  border-radius: 1rem;
}

td.left, th.left {
  border-radius: 0.5rem 0 0 0.5rem;
  width: auto;
}

td.right, th.right {
  border-radius: 0 0.5rem 0.5rem 0;
}

td.mid, th.mid {
  border-radius: 0 0 0 0;
  width: auto;
}
</style>