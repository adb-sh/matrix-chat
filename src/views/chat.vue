<template>
  <div>
    <div ref="msgContainer" id="messagesContainer" class="messagesContainer">
      <div id="messages" class="messages">
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
      </div>
    </div>
    <newMessage />
    <topBanner />
    <chatInformation />
  </div>
</template>

<script>
import message from '@/components/message.vue';
import messageReceive from '@/components/messageReceive.vue';
import newMessage from '@/components/newMessage.vue';
import topBanner from "@/components/topBanner.vue";
import chatInformation from "@/components/chatInformation.vue";

export default {
  name: 'chat',
  components: {
    message,
    messageReceive,
    newMessage,
    topBanner,
    chatInformation
  }
}
</script>

<style scoped>
.messagesContainer{
  position: absolute;
  margin: 0;
  left: 0;
  top: 3rem;
  height: calc(100% - 7rem);
  width: 100%;
  overflow-y: auto;
}
.messages{
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
