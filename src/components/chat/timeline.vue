<template>
  <lazy-renderer class="timeline">
    <div
      class="timeGroup"
      v-for="timeGroup in splitArray(timeline,obj => getDate(obj.event.origin_server_ts))"
      :key="timeGroup[0].event.origin_server_ts"
    >
      <div class="date">{{getDate(timeGroup[0].event.origin_server_ts)}}</div>
      <div v-for="group in splitArray(timeGroup, obj => obj.event.sender)" :key="group[0].event.origin_server_ts">
        <div class="eventGroup">
          <div class="thumbnailContainer">
            <div class="filler"></div>
            <avatar
              v-if="group[0].event.sender !== user && groupTimeline"
              :fallback="group[0].event.sender"
              class="avatar"
              :mxcURL="getUser(group[0].event.sender).avatarUrl"
              :size="2"
              :title="group[0].event.sender"
            />
          </div>
          <div
            :class="groupTimeline?'indent username':'username'"
            v-if="group[0].event.sender !== user && groupTimeline"
          >
            {{calcUserName(group[0].event.sender)}}
          </div>
          <div v-for="(event, i) in group" :key="event.event.event_id">
            <event
              :class="groupTimeline?'indent event':'event'"
              :title="`${event.event.sender} at ${getTime(event.event.origin_server_ts)}`"
              :type="event.event.sender === user?'send':'receive'"
              :event="event.event"
              :status="event.status"
              :on-update="onUpdate"
              :setReplyTo="setReplyTo"
            />
            <receipts v-if="i < group.length-1" :receipts="getReceipts(event)"/>
          </div>
        </div>
        <receipts :receipts="getReceipts(group[group.length-1])"/>
      </div>
    </div>
  </lazy-renderer>
</template>

<script>
import avatar from '@/components/matrix/avatar';
import splitArray from '@/lib/splitArray';
import {getDate, getTime} from '@/lib/getTimeStrings';
import {getUser, calcUserName} from '@/lib/matrixUtils';
import {matrix} from '@/main';

export default {
  name: 'eventGroup',
  components: {
    receipts:()=>import('@/components/chat/receipts'),
    event:()=>import('@/components/chat/event'),
    avatar
  },
  props: {
    timeline: Array,
    user: String,
    groupTimeline: Boolean,
    setReplyTo: Function,
    onUpdate: Function,
    receipts: Object
  },
  methods: {
    getReceipts(event){
      return Object.entries(this.receipts['m.read']).filter(ar =>
        ar[0]!==matrix.user && ar[1].eventId===event.event.event_id);
    },
    getUser,
    calcUserName,
    splitArray,
    getDate,
    getTime
  },
  updated() {
    this.onUpdate();
  }
}
</script>

<style scoped lang="scss">
.timeline{
  margin: 0.5rem;
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
      width: 100%;
      height: fit-content;
      margin-top: 0.75rem;
      .thumbnailContainer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        .filler {
          height: calc(100% - 2rem);
        }
        .avatar {
          position: sticky;
          bottom: 0.5rem;
          width: 2rem;
          height: 2rem;
        }
      }
      .username{
        position: relative;
        margin-left: 1rem;
        font-weight: bold;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .indent{
        margin-left: 2.5rem;
      }
    }
  }
}
</style>
