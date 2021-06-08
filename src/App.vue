<template>
  <div id="app">
    <div id="appContent">
      <router-view />
      <error />
    </div>
  </div>
</template>

<script>
import error from '@/components/layout/error.vue';

export default {
  name: 'App',
  components:{
    error
  }
}
</script>

<style lang="scss">
@import "main.scss";

body{
  margin: 0;
}
a{
  color: #00BCD4;
}
*{
  scrollbar-width: thin;
  scrollbar-color: #42b983 #2220;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}
*::-webkit-scrollbar-track {
  background: none;
}
*::-webkit-scrollbar-thumb {
  background-color: #42b983;
  border-radius: 0.25rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  position: absolute;
  color: #ffffff;
  background-color: #1d1d1d;
  min-height: 100%;
  width: 100%;
}
#appContent{
  position: absolute;
  top: 0;
  left: calc(50% - 35rem);
  padding: 0;
  min-height: 100%;
  width: 70rem;
  min-width: 18rem;
  background-color: #313131;
  box-shadow: 3px 3px 10px #111;
}
@media (max-width: 75rem){
  #appContent{
    width: 100%;
    left: 0;
  }
}
</style>
