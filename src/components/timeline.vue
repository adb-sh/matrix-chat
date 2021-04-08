<template>
  <div class="timeline">
    <div
      class="timeGroup"
      v-for="timeGroup in splitArray(timeline,obj => getDate(obj.event.origin_server_ts),obj => obj.event)"
      :key="timeGroup[0].origin_server_ts"
    >
      <div class="date">{{getDate(timeGroup[0].origin_server_ts)}}</div>
      <div class="eventGroup" v-for="group in splitArray(timeGroup, obj => obj.sender)" :key="group[0].origin_server_ts">
        <div class="thumbnailContainer">
          <div class="filler"></div>
          <avatar
            v-if="group[0].sender !== user && groupTimeline"
            :fallback="group[0].sender"
            class="userThumbnail"
            :mxcURL="getUser(group[0].sender).avatarUrl"
            :size="2"
            :title="group[0].sender"
          />
        </div>
        <div
          :class="groupTimeline?'indent username':'username'"
          v-if="group[0].sender !== user && groupTimeline"
        >
          {{calcUserName(group[0].sender)}}
        </div>
        <event
          v-for="event in group"
          :key="event.origin_server_ts"
          :class="groupTimeline?'indent event':'event'"
          :title="`${group[0].sender} at ${getTime(event.origin_server_ts)}`"
          @contextmenu.prevent="setReplyTo(event)"
          :type="event.sender === user?'send':'receive'"
          :event="event"
          :on-update="()=>onUpdate()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import event from '@/components/event';
import avatar from '@/components/avatar';
import splitArray from '@/lib/splitArray';
import {getDate, getTime} from '@/lib/getTimeStrings';
import {getUser, calcUserName} from '@/lib/matrixUtils';

export default {
  name: 'eventGroup',
  components: {
    event,
    avatar
  },
  props: {
    timeline: Array,
    user: String,
    groupTimeline: Boolean,
    setReplyTo: Function,
    onUpdate: Function
  },
  methods: {
    getUser,
    calcUserName,
    splitArray,
    getDate,
    getTime
  }
}
</script>

<style scoped lang="scss">
.timeline{
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  .timeGroup {
    .date {
      top: 0.25rem;
      position: sticky;
      z-index: 10;
      background-color: #2d2d2d;
      padding: 0.5rem;
      border-radius: 0.5rem;
      width: fit-content;
      left: 50%;
      transform: translate(-50%, 0);
      margin-top: 0.5rem;
    }
    .eventGroup {
      position: relative;
      width: calc(100% - 1rem);
      height: fit-content;
      margin-top: 0.75rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      .thumbnailContainer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        .filler {
          height: calc(100% - 2rem);
        }
        .userThumbnail {
          position: sticky;
          bottom: 0.5rem;
          width: 2rem;
          height: 2rem;
        }
      }
      .username{
        margin-left: 1rem;
        font-weight: bold;
      }
      .indent{
        margin-left: 2.5rem;
      }
    }
  }
}
</style>