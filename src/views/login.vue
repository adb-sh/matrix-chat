<template>
  <div id="login">
    <h1 class="title">[chat]</h1>
    <form v-if="showLogin" @submit.prevent="login()">
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
</template>

<script>
import textbtn from '@/components/textbtn';
import {matrix} from '@/main.js';
import {cookieHandler} from "@/lib/cookieHandler";

export default {
  name: "login.vue",
  components: {
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
      matrix.login(this.user, this.password, this.homeServer, (error) => {
        this.loginError = `login failed: ${error}`;
      }, (token)=> {
        let cookie = new cookieHandler();
        cookie.setCookie({
          baseUrl: this.homeServer,
          userId: this.user,
          accessToken: token
        });
        cookie.expires(15);
        cookie.store();
        this.$router.push('/rooms/');
      });
    },
    logout(){
      matrix.logout();
    }
  },
  data(){
    return {
      user: "",
      password: "",
      homeServer: "https://adb.sh",
      loginError: "",
      showLogin: (matrix.client === undefined)
    }
  }
}
</script>

<style scoped>
#login{
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


@media (max-width: 35rem) {
  input {
    width: calc(100% - 8rem);
  }
}
</style>