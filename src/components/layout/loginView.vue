<template>
  <div class="login">
    <div class="loginBox">
      <h1 class="title">[chat]</h1>
      <div v-if="!matrix.client">
       <slot/>
      </div>
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
import Overlay from '@/components/layout/overlay';
import Throbber from '@/components/layout/throbber';
import {matrix} from '@/main';

export default {
  name: 'login.vue',
  components: {
    Throbber,
    Overlay,
    textbtn
  },
  props:{
    loading:[String, Boolean]
  },
  data(){
    return{
      matrix
    }
  }
}
</script>

<style scoped lang="scss">
input{
  width: 16rem;
}
input:focus{
  color: #fff;
  background-color: var(--grey200);
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
  max-width: calc(100% - 6rem);
  padding: 2rem 2rem 1rem 2rem;
  border-radius: 1rem;
  background-color: var(--grey600);
  box-shadow: var(--shadow300);
  .bottom{
    position: absolute;
    margin: 0;
  }
}
.notice{
  position: absolute;
  bottom: -1.5rem;
  right: .5rem;
  a{
    color: #fff;
  }
}
.error{
  color: var(--red);
}

@media (max-width: 30rem) {
  input {
    width: calc(100% - 2rem);
  }
  .loginBox{
    width: calc(100% - 6rem);
  }
}
</style>