<template>
  <div class="login">
    <div class="loginBox">
      <h1 class="title">[chat]</h1>
      <form v-if="showLogin()" @submit.prevent="login()">
        <input v-model="user" class="input" name="user" type="text" maxlength="30" placeholder="@user:adb.sh"><br>
        <input v-model="password" class="input" name="password" type="password" maxlength="30" placeholder="password"><br>
        <input v-model="homeServer" class="input" name="homeserver" maxlength="50" placeholder="https://matrix.org"><br>
        <div v-if="loginError" class="info">{{loginError}}</div>
        <textbtn type="submit" text="login" />
      </form>
      <div v-else>
        <p>you are already logged in</p>
        <textbtn @click.native="$router.push('rooms')" text="chat" />
        <textbtn @click.native="logout()" text="logout" />
      </div>
    </div>
    <throbber-overlay v-if="loading" :text="loading" class="throbber"/>
  </div>
</template>

<script>
import textbtn from '@/components/textbtn';
import {matrix} from '@/main.js';
import {cookieHandler} from "@/lib/cookieHandler";
import ThrobberOverlay from "@/components/throbberOverlay";

export default {
  name: "login.vue",
  components: {
    ThrobberOverlay,
    textbtn
  },
  methods: {
    login(){
      if (matrix.client !== undefined) {
        this.loginError = 'you are already logged in';
        return;
      } if (this.user === '') {
        this.loginError = 'username is empty';
        return;
      } if (this.password === '') {
        this.loginError = 'password is empty';
        return;
      } if (!(this.user.match(/^@[a-zA-Z0-9]+:[a-z0-9]+\.[a-z]/))) {
        this.loginError = 'username is in wrong style';
        return;
      }
      this.loading = 'logging in';
      matrix.login(this.user, this.password, this.homeServer, (error) => {
        this.loginError = `login failed: ${error}`;
      }, token => {
        this.loading = 'store token';
        this.cookie.setCookie({
          baseUrl: this.homeServer,
          userId: this.user,
          accessToken: token
        });
        this.cookie.setExpire(15);
        this.cookie.store();
        this.loading = false;
        this.$router.push('/rooms/');
      });
    },
    async logout(){
      this.loading = 'logging out';
      await matrix.logout();
      this.loading = 'remove token';
      this.cookie.setCookie({
        baseUrl: undefined,
        userId: undefined,
        accessToken: undefined
      });
      this.cookie.setExpire(0);
      this.cookie.store();
      this.loading = false;
      this.$forceUpdate();
    },
    showLogin(){
      return matrix.client === undefined;
    }
  },
  data(){
    return {
      user: "",
      password: "",
      homeServer: "https://adb.sh",
      loginError: "",
      cookie: new cookieHandler(),
      loading: false
    }
  }
}
</script>

<style scoped>
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
input{
  padding: 0 2rem 0 2rem;
  height: 2.5rem;
  color: #fff;
  background-color: #1d1d1d;
  border-radius: 1.25rem;
  border: 1px solid #fff;
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
.throbber{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 35rem) {
  input {
    width: calc(100% - 8rem);
  }
}
</style>