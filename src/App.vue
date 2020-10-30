<template>
  <div id="app">
    <div class="content">
      <div id="messages">
        <message msg="Hey :D" />
        <message msg="Du bist blööööd xD" />
        <messageReceive msg="Du auch" />
        <message msg="lol" />
        <messageReceive msg="Du bist voll blöd, ich hasse dich, warum tust du das?!" />
        <message msg="Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ut imperdiet vel risus tristique mollis. Proin aliquam felis non vehicula ornare.
                      Fusce scelerisque pellentesque erat quis sollicitudin.
                      Quisque aliquet, ligula ut volutpat vulputate, ligula lorem dictum velit, et aliquam sapien orci sed magna.
                      Nam suscipit ex eget urna accumsan pulvinar. Pellentesque fringilla placerat feugiat.
                      Aenean aliquam vestibulum metus. Nulla augue turpis, consectetur vitae quam ac, porttitor rhoncus nunc.
                      Nullam non turpis consequat, placerat lectus nec, ornare orci.
                      Fusce lorem tortor, viverra ac suscipit sit amet, scelerisque id eros.
                      Suspendisse et ultricies elit, vitae pretium ipsum. Suspendisse vel ex in turpis pulvinar feugiat. "
        />
      </div>
    </div>
  </div>
</template>

<script>
import message from './components/message.vue';
import messageReceive from './components/messageReceive.vue';

export default {
  name: 'App',
  components: {
    message,
    messageReceive
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: absolute;
  color: #ffffff;
  background-color: #1d1d1d;
  min-height: 100%;
  width: 100%;
}
.content{
  position: absolute;
  top: 0px;
  left: calc(50% - 26rem);
  padding: 1rem;
  min-height: calc(100% - 2rem);
  width: 50rem;
  min-width: 15rem;
  background-color: #313131;
}

@media (max-width: 55rem){
  .content{
    width: calc(100% - 2rem);
    left: 0;
  }
}
</style>
