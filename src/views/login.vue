<template>
  <div class="login">
    <div class="loginBox">
      <h1 class="title">[chat]</h1>
      <form v-if="showLogin()" @submit.prevent="login()">
        <input v-model="user" class="input" name="user" type="text" maxlength="30" placeholder="@user:adb.sh"><br>
        <input v-model="password" class="input" name="password" type="password" maxlength="30" placeholder="password"><br>
        <input v-model="homeServer" class="input" name="homeserver" placeholder="https://matrix.org"><br>
        <div v-if="loginError" class="info">{{loginError}}</div>
        <textbtn type="submit" text="login" class="rounded"/>
      </form>
      <div v-else>
        <p>you are already logged in</p>
        <textbtn @click.native="$router.push('rooms')" text="chat" />
        <textbtn @click.native="logout()" text="logout" class="outline"/>
      </div>
    </div>
    <overlay v-if="loading"><throbber :text="loading"/></overlay>
  </div>
</template>

<script>
import textbtn from '@/components/layout/textbtn';
import {matrix} from '@/main.js';
import {isValidUserId} from '@/lib/matrixUtils';
import {DataStore} from '@/lib/DataStore';
import Overlay from '@/components/layout/overlay';
import Throbber from '@/components/layout/throbber';
const store = new DataStore();

export default {
  name: 'login.vue',
  components: {
    Throbber,
    Overlay,
    textbtn
  },
  methods: {
    login(){
      // eslint-disable-next-line no-cond-assign
      if (this.loginError = this.getInputErrors()) return false;
      this.loading = 'logging in';
      matrix.login(this.user, this.password, this.homeServer, (error) => {
        this.loginError = `login failed: ${error}`;
        this.loading = false;
      }, token => {
        this.store.set('login', {
          baseUrl: this.homeServer,
          userId: this.user,
          accessToken: token
        });
        this.loading = false;
        this.$router.push('/rooms/');
      });
    },
    async logout(){
      this.loading = 'logging out';
      await matrix.logout();
      this.store.set('login', {});
      this.loading = false;
      this.$forceUpdate();
    },
    getInputErrors(){
      if (matrix.client !== undefined) return 'you are already logged in';
      if (this.user === '') return 'username is empty';
      if (this.password === '') return 'password is empty';
      if (!isValidUserId(this.user)) return 'username is in wrong style';
      return false;
    },
    showLogin(){
      return matrix.client === undefined;
    }
  },
  data(){
    return {
      user: '',
      password: '',
      homeServer: 'https://adb.sh',
      loginError: '',
      store,
      loading: false
    }
  }
}
</script>

<style scoped>
input{
  padding: 0 2rem 0 2rem;
  height: 2.5rem;
  color: #fff;
  background-color: #1d1d1d;
  border-radius: 1.25rem;
  border: 0.1rem solid #fff;
  text-align: center;
  font-size: 1.1rem;
  margin: 0.5rem;
  appearance: none;
  outline: none;
}
input:focus{
  color: #000;
  background-color: #fff;
}
.login{
  width: 100%;
  height: 100%;
}
.loginBox{
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  height: min-content;
  width: 100%;
}

@media (max-width: 35rem) {
  input {
    width: calc(100% - 8rem);
  }
}
</style>