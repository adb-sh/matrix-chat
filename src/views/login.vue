<template>
  <loginView :loading="loading">
    <form @submit.prevent="login()">
      <div v-if="extendedView">
        <input v-model="userId" class="input" name="user" type="text" :placeholder="config.userId.placeholder" required><br>
        <input v-model="homeServerUrl" class="input serverExtend" name="homeserver" :placeholder="config.homeServerUrl.placeholder" required>
        <button @click.prevent="toggleView()" class="toggle" title="Fold In">⤴</button><br>
        <input v-model="password" class="input" name="password" type="password" :placeholder="config.password.placeholder" required><br>
      </div>
      <div v-else>
        <div class="inputCombo">
          <input v-model="user" class="input user" name="user" type="text" :placeholder="config.user.placeholder" required>
          <input v-model="homeServer" class="input server" name="homeserver" :placeholder="config.homeServer.placeholder" required>
          <button @click.prevent="toggleView()" class="toggle" title="Extend">⤦</button>
        </div><br>
        <input v-model="password" class="input" name="password" type="password" :placeholder="config.password.placeholder" required><br>
      </div>
      <p v-if="loginError" class="error">{{loginError}}</p>
      <textbtn type="submit" text="login" class="rounded"/>
      <p class="">Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </loginView>
</template>

<script>
import textbtn from '@/components/layout/textbtn';
import {matrix} from '@/main.js';
import {isValidUserId} from '@/lib/matrixUtils';
import {DataStore} from '@/lib/DataStore';
const store = new DataStore();
import {config} from '@/lib/getConfig';
import loginView from '@/components/layout/loginView';

export default {
  name: 'login.vue',
  components: {
    textbtn,
    loginView
  },
  methods: {
    login(){
      this.loginError = this.getInputErrors()
      if (this.loginError) return false;
      this.loading = 'logging in';
      if (!this.extendedView){
        this.userId = `@${this.user}:${this.homeServer}`;
        this.homeServerUrl = `https://${this.homeServer}`;
      }
      matrix.login(this.userId, this.password, this.homeServerUrl).then(token=>{
        this.store.set('login', {
          baseUrl: this.homeServerUrl,
          userId: this.userId,
          accessToken: token
        });
        this.loading = false;
        this.$router.push('/rooms/');
      }).catch(error=>{
        this.loginError = `login failed: ${error}`;
        this.loading = false;
      });
    },
    getInputErrors(){
      if (matrix.client !== undefined) return 'you are already logged in';
      if (this.extendedView){
        if (this.userId === '') return 'user id is empty';
        if (!isValidUserId(this.userId)) return 'user id is in wrong style';
        if (this.homeServerUrl === '') return 'server is undefined';
      } else {
        if (this.user === '') return 'username is empty';
        if (!this.user.match(/^[a-zA-Z0-9=/_.+-]+$/)) return 'allowed special characters for the username are: =/_.+-';
      }
      if (this.password === '') return 'password is empty';
      return false;
    },
    toggleView(){
      this.extendedView = !this.extendedView;
    }
  },
  data(){
    return {
      user: '',
      userId: '',
      password: '',
      homeServer: config?.login?.homeServer?.default||'',
      homeServerUrl: config?.login?.homeServerUrl?.default||'',
      loginError: '',
      store,
      loading: false,
      matrix,
      config:{
        user:{placeholder: config?.login?.user?.placeholder||'Username'},
        userId:{placeholder: config?.login?.userId?.placeholder||'User Id'},
        password:{placeholder: config?.login?.password?.placeholder||'Password'},
        homeServer:{placeholder: config?.login?.homeServer?.placeholder||'Server'},
        homeServerUrl:{placeholder: config?.login?.homeServerUrl?.placeholder||'Home Server'}
      },
      extendedView: config?.login?.extendedView||false
    }
  }
}
</script>

<style scoped lang="scss">
.user{
  width: calc(60% - 2rem);
  margin-right: 0;
  border-radius: 0.7rem 0 0 0.7rem;
}
.server{
  width: calc(40% - 2rem);
  margin-left: 0;
  border-radius: 0 0.7rem 0.7rem 0;
  background-color: #282828;
}
.serverExtend{
  width: 15rem;
}
.toggle{
  background-color: unset;
  border: unset;
  height: 2.2rem;
  width: 1rem;
  color: #fff;
  margin: 0;
  font-size: 1rem;
  cursor: pointer;
}
.inputCombo{
  display: inline-block;
  width: 18rem;
}
@media (max-width: 30rem) {
  .inputCombo{
    width: 100%;
  }
  .serverExtend{
    width: calc(100% - 3rem);
  }
}
</style>