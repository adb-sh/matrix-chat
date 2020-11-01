<template>
  <div id="app">
    <div class="content">
      <div class="messages">
        <div class="spacer" style="height: 1rem;"></div>
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
        <messageReceive msg="Du hast Pizza!" />
        <message msg="und Kuchen :P" />
        <message msg="und Kuchen :P" />
        <message msg="und Kuchen :P" />
        <message msg="und Kuchen :P" />
        <message msg="und Kuchen :P" />
        <div class="spacer" style="height: 1rem;"></div>
      </div>
      <newMessage />
    </div>
  </div>
</template>

<script>
import message from './components/message.vue';
import messageReceive from './components/messageReceive.vue';
import newMessage from './components/newMessage.vue';

export default {
  name: 'App',
  components: {
    message,
    messageReceive,
    newMessage
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  position: absolute;
  color: #ffffff;
  background-color: #1d1d1d;
  min-height: 100%;
  width: 100%;
}
.content{
  position: absolute;
  top: 0;
  left: calc(50% - 25rem);
  padding: 0;
  min-height: calc(100%);
  width: 50rem;
  min-width: 15rem;
  background-color: #313131;
  box-shadow: 3px 3px 10px #111;
}
.messages{
  position: absolute;
  margin: 0;
  left: 0;
  top: 0;
  height: calc(100% - 4rem);
  width: 100%;
  overflow-y: auto;
}

@media (max-width: 55rem){
  .content{
    width: calc(100%);
    left: 0;
  }
}
</style>
