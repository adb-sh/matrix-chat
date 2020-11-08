<template>
  <div id="login">
    <h1 class="title">open chat</h1>
    <div class="input-field" id="longurl">
      <label for="longurl-input"></label>
      <input v-model="session.content.user" class="input" id="longurl-input" type="text" autocomplete="off" maxlength="20" placeholder="chose nickname">
    </div>
    <textbtn v-on:click.native="login()" text="login" />
  </div>
</template>

<script>
import textbtn from '@/components/textbtn';
import main from "@/main";

export default {
  name: "login.vue",
  components: {
    textbtn
  },
  methods: {
    login() {
      if (this.session.content.user !== "") {
        this.session.time = Date.now()
        main.methods.sendWebSocket(this.session)
      }
    }
  },
  data(){
    return {
      session: {
        type: "login",
        time: Date.now(),
        content: {
          user: ""
        }
      }
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