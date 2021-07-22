<template>
  <div class="receipts">
    <div class="counter" v-if="receipts.length>5">{{`${receipts.length-5}+`}}</div>
    <avatar
      v-for="read in receipts.slice(0,5)"
      :key="read[0]+read[1].eventId"
      :fallback="read[0]"
      class="avatar"
      :mxcURL="getUser(read[0]).avatarUrl"
      :size="1"
      :title="'seen by '+calcUserName(read[0])"
    />
  </div>
</template>

<script>
import {calcUserName, getUser} from '@/lib/matrixUtils';
import avatar from '@/components/matrix/avatar';

export default {
  name: 'receipts',
  components: {
    avatar
  },
  props: {
    receipts: Array
  },
  methods: {
    calcUserName,
    getUser
  }
}
</script>

<style scoped lang="scss">
.receipts{
  text-align: right;
  margin: 0.2rem 0;
  font-size: 0.8rem;
  .counter{
    position: relative;
    display: inline-block;
    margin: 0 0.2rem;
    bottom: 0.2rem;
  }
  .avatar{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin: 0 0.1rem;
  }
}
</style>