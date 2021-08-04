<template>
  <div class="sideMenu">
    <div class="top">
      <icon class="backIcon" ic="./sym/ic_arrow_back_white.svg" @click.native="close()"/>
      <div class="banner">
        <avatar
          class="avatar"
          :mxcURL="getMxcFromUserId(matrix.user)"
          :fallback="matrix.user"
          :size="5"
        />
        <div class="info">
          <div class="name">{{getUser(matrix.user).displayName||matrix.user}}</div>
          <div class="id">{{matrix.user}}</div>
        </div>
      </div>
    </div>
    <div class="items">
      <div class="menuItem">
        <icon class="itemIcon" ic="./sym/ic_create_white.svg"/><div class="title">Edit User</div>
      </div>
      <div class="menuItem" @click="()=>{options.setShowCreateRoom({}); close();}">
        <icon class="itemIcon" ic="./sym/ic_add_white.svg"/><div class="title">New Room</div>
      </div>
      <div class="menuItem" @click="()=>$router.push('/login')">
        <icon class="itemIcon" ic="./sym/ic_logout_white.svg"/><div class="title">Logout</div>
      </div>
    </div>
  </div>
</template>

<script>
import {matrix} from '@/main';
import {getUser} from '@/lib/matrixUtils';
import avatar from '@/components/matrix/avatar';
import {getMxcFromUserId} from '@/lib/getMxc';
import icon from '@/components/layout/icon';

export default {
  name: 'sideMenu',
  props:{
    close: Function,
    options: Object
  },
  components:{
    avatar,
    icon
  },
  data(){
    return{
      matrix
    }
  },
  methods:{
    getUser,
    getMxcFromUserId
  }
}
</script>

<style scoped lang="scss">
.sideMenu{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 18rem;
  max-width: calc(100% - 2rem);
  background-color: var(--grey600);
  text-align: center;
  box-shadow: var(--shadow300);
  .top{
    position: relative;
    height: 10rem;
    width: 100%;
    background-color: var(--grey700);
    .backIcon{
      position: absolute;
      top: 0.25rem;
      left: 0.5rem;
      background-color: unset;
    }
    .banner{
      position: absolute;
      bottom: 0;
      height: 6rem;
      width: 100%;
      .avatar{
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        height: 5rem;
        width: 5rem;
      }
      .info{
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        width: calc(100% - 7rem);
        padding-top: 1rem;
        height: 4rem;
        text-align: left;
        white-space: nowrap;
        .name{
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1.6rem;
          font-weight: bold;
        }
        .id{
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1rem;
        }
      }
    }
  }
  .items{
    position: absolute;
    height: calc(100% - 10rem);
    width: 100%;
    overflow-y: auto;
    .menuItem{
      position: relative;
      height: 3rem;
      width: 100%;
      margin: 0.8rem 0;
      text-align: left;
      cursor: pointer;
      .itemIcon{
        position: absolute;
        left: 1.5rem;
        top: 0;
        background-color: var(--grey400);
      }
      .title{
        position: absolute;
        font-weight: bold;
        left: 5.5rem;
        top: 1rem;
      }
    }
  }
  .menuItem:hover{
    background-color: var(--grey500);
  }
}
</style>