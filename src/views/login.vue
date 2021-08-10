<template>
  <div class="login">
    <div class="loginBox">
      <h1 class="title">[chat]</h1>
      <form v-if="!matrix.client" @submit.prevent="login()">
        <input v-model="user" class="input" name="user" type="text" :placeholder="config.user.placeholder"><br>
        <input v-model="password" class="input" name="password" type="password" :placeholder="config.password.placeholder"><br>
        <input v-model="homeServer" class="input" name="homeserver" :placeholder="config.homeServer.placeholder"><br>
        <div v-if="loginError" class="info">{{loginError}}</div>
        <textbtn type="submit" text="login" class="rounded"/>
      </form>
      <div v-else>
        <p>you are already logged in</p>
        <textbtn @click.native="$router.push('rooms')" text="chat" />
        <textbtn @click.native="$router.push('logout')" text="logout" class="outline"/>
      </div>
      <div class="notice">
        <a href="https://git.cybre.town/adb/matrix-chat">matrix-chat</a> powered by <a href="https://matrix.org">Matrix</a>
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
import {config} from '@/lib/getConfig';

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
    getInputErrors(){
      if (matrix.client !== undefined) return 'you are already logged in';
      if (this.user === '') return 'username is empty';
      if (this.password === '') return 'password is empty';
      if (!isValidUserId(this.user)) return 'username is in wrong style';
      return false;
    }
  },
  data(){
    return {
      user: '',
      password: '',
      homeServer: config?.login?.homeServer?.default||'',
      loginError: '',
      store,
      loading: false,
      matrix,
      config:{
        user:{placeholder: config?.login?.user?.placeholder||'User Id',},
        password:{placeholder: config?.login?.password?.placeholder||'Password'},
        homeServer:{placeholder: config?.login?.homeServer?.placeholder||'Home Server'}
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(2.6rad , #39dcae, #083a87);
}
.loginBox{
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  height: min-content;
  width: max-content;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--grey600);
  box-shadow: var(--shadow300);
}
.notice{
  position: absolute;
  bottom: -1.5rem;
  right: .5rem;
  a{
    color: #fff;
  }
}

@media (max-width: 35rem) {
  input {
    width: calc(100% - 4rem);
  }
  .loginBox{
    width: calc(100% - 6rem);
  }
}
</style>