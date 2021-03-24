<template>
  <div class="admin">
    <h2>users</h2>
    <table v-if="users">
      <tr>
        <th class="left">user</th>
        <th class="mid">displayname</th>
        <th class="mid">deactivated</th>
        <th class="right">admin</th>
      </tr>
      <tr v-for="user in users.users" :key="user.name">
        <td class="left">{{user.name}}</td>
        <td class="mid">{{user.displayname}}</td>
        <td class="mid">{{user.deactivated}}</td>
        <td class="right">{{user.admin}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import {matrix} from "@/main";
import {AdminAPI} from "@/lib/AdminAPI";

export default {
  name: "admin",
  data(){
    return{
      users: undefined
    }
  },
  async created() {
    this.api = new AdminAPI(matrix.baseUrl+'/_synapse/admin/v2/', matrix.accessToken);
    this.users = await this.api.getUsers('users');
  }
}
</script>

<style scoped>
.admin{
  text-align: center;
}
table {
  position: relative;
  margin: auto;
  width: calc(100% - 2rem);
  max-width: 40rem;
  background-color: #1f262b;
  box-shadow: 3px 3px 10px #333;
  border: 2px solid #fff;
  border-collapse: separate;
  border-spacing: 2px;
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1.2rem;
  font-family: "Roboto", regular, sans-serif;
}

tr {
  margin: auto;
  border: 1px solid #fff;
  text-align: left;
}

th {
  margin: auto;
  background-color: #546E7A;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

td {
  margin: auto;
  background-color: #37474F;
  padding: 10px;
  border-radius: 8px;
}

td.left, th.left {
  border-radius: 0.5rem 0 0 0.5rem;
}

td.right, th.right {
  border-radius: 0 0.5rem 0.5rem 0;
}

td.mid, th.mid {
  border-radius: 0 0 0 0;
}
</style>