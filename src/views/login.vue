<template>
  <div id="login">
    <h1 class="title">[chat]</h1>
    <form @submit.prevent="login()">
      <input v-model="session.login.user" class="input" name="user" type="text" maxlength="30" placeholder="@user:adb.sh"><br>
      <input v-model="session.login.password" class="input" name="password" type="password" maxlength="30" placeholder="password"><br>
      <textbtn type="submit" text="login" />
    </form>
  </div>
</template>

<script>
import textbtn from '@/components/textbtn';
import matrix from '@/matrix.js';

export default {
  name: "login.vue",
  components: {
    textbtn
  },
  methods: {
    login(){
      matrix.methods.login()
    }
  },
  data(){
    return {
      session: matrix.data().session
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
  margin-top: 1rem;
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