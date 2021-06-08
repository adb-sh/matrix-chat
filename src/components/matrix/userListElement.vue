<template>
  <div :class="compact?'userListElement compact':'userListElement'" :title="user.userId">
    <div :class="compact?'imageContainer compact':'imageContainer'">
      <avatar
        :class="compact?'userImage compact':'userImage'"
        :mxcURL="user.avatarUrl"
        :fallback="user.userId"
        :size="compact?1.5:3"
      />
      <div v-if="user.currentlyActive" class="online"></div>
    </div>
    <div :class="compact?'userListName compact':'userListName'">{{user.displayName || user.userId}}</div>
    <div v-if="!compact" class="status">{{user.presence}}</div>
  </div>
</template>

<script>
import avatar from '@/components/matrix/avatar';

export default {
  name: 'userListElement',
  components:{
    avatar
  },
  props:{
    user: Object,
    compact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.userListElement{
  position: relative;
  height: 3rem;
  width: 100%;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  .imageContainer{
    position: absolute;
    height: 3rem;
    width: 3rem;
    left: 0.5rem;
    .userImage {
      height: inherit;
      width: inherit;
    }
    .online {
      position: absolute;
      bottom: 0;
      right: 0;
      height: 0.5rem;
      width: 0.5rem;
      background-color: #42b983;
      border-radius: 50%;
      border: 2px solid #222;
    }
  }
  .userListName{
    position: absolute;
    left: 4rem;
    top: 0.25rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 5rem);
    text-align: left;
  }
  .status{
    position: absolute;
    top: 1.5rem;
    left: 4rem;
    font-size: 0.8rem;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 4.5rem);
  }
}
.userListElement:hover{
  background-color: #4444;
}
.userListElement.compact{
  height: 1.5rem;
}
.imageContainer.compact{
  height: 1.5rem;
  width: 1.5rem;
}
.userListName.compact{
  left: 2.5rem;
  font-size: 1rem;
}
</style>