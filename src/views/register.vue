<template>
  <loginView :loading="loading">
    <form @submit.prevent="register()">
      <div class="inputCombo">
        <input v-model="user" class="input user" name="user" type="text" :placeholder="config.user.placeholder" required>
        <input v-model="homeServer" class="input server" name="homeserver" :placeholder="config.homeServer.placeholder" required>
      </div><br>
      <input v-model="password1" class="input" name="password" type="password" :placeholder="config.password.placeholder" required><br>
      <input v-model="password2" class="input" name="password" type="password" placeholder="Confirm Password" required><br>
      <p v-if="loginError" class="error">{{loginError}}</p>
      <textbtn type="submit" text="register" class="rounded"/>
      <p class="bottomtext">Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </loginView>
</template>

<script>
import loginView from '@/components/layout/loginView';
import textbtn from '@/components/layout/textbtn';
import {matrix} from '@/main';
import {config} from '@/lib/getConfig';
import {DataStore} from '@/lib/DataStore';
const store = new DataStore();

export default {
  name: 'register',
  components:{
    loginView,
    textbtn
  },
  methods: {
    register(){
      this.loginError = this.getInputErrors()
      if (this.loginError) return false;
      this.loading = 'register';
      this.userId = `@${this.user}:${this.homeServer}`;
      this.homeServerUrl = `https://${this.homeServer}`;
      matrix.register(this.user, this.password1, this.homeServerUrl).then(reg=>{
        this.loading = 'logging in';
        matrix.tokenLogin(this.homeServerUrl, reg.access_token, reg.user_id).then(()=>{
          this.store.set('login', {
            baseUrl: this.homeServerUrl,
            userId: this.userId,
            accessToken: reg.access_token
          });
        }).catch(error=>{
          this.loginError = `login failed: ${error}`;
          this.loading = false;
        });
        this.loading = false;
        this.$router.push('/rooms/');
      }).catch(error=>{
        this.loginError = `registration failed: ${error}`;
        this.loading = false;
      });
    },
    getInputErrors(){
      if (matrix.client !== undefined) return 'you are already logged in';
      if (this.user === '') return 'username is empty';
      if (this.password1 === '') return 'password is empty';
      if (this.password2 === '') return 'retype your password';
      if (!this.user.match(/^[a-zA-Z0-9=/_.+-]+$/)) return 'allowed special characters for the username are: =/_.+-';
      if (this.password1 !== this.password2) return 'your passwords don\'t match';
      return false;
    }
  },
  data(){
    return {
      user: '',
      userId: '',
      password1: '',
      password2: '',
      homeServer: config?.register?.homeServer?.default||'matrix.org',
      homeServerUrl: '',
      email: '',
      loginError: '',
      store,
      loading: false,
      matrix,
      config:{
        user:{placeholder: config?.register?.user?.placeholder||'Username',},
        password:{placeholder: config?.register?.password?.placeholder||'Password'},
        homeServer:{placeholder: config?.register?.homeServer?.placeholder||'Home Server'}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user{
  width: calc(60% - 1.5rem);
  margin-right: 0;
  border-radius: 0.7rem 0 0 0.7rem;
}
.server{
  width: calc(40% - 1.5rem);
  margin-left: 0;
  border-radius: 0 0.7rem 0.7rem 0;
  background-color: #282828;
}
.inputCombo{
  display: inline-block;
  width: 18rem;
}
@media (max-width: 30rem) {
  .inputCombo{
    width: 100%;
  }
}
</style>