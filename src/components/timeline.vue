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
          <userThumbnail
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
          {{getUser(group[0].sender).displayName || group[0].sender}}
        </div>
        <div
          :class="groupTimeline?'indent event':'event'"
           v-for="event in group"
          :key="event.origin_server_ts"
          :title="`${group[0].sender} at ${getTime(event.origin_server_ts)}`"
        >
          <message
            v-if="event.content.msgtype==='m.text'"
            :type="event.sender === user?'send':'receive'"
            :msg=event.content.body :time=getTime(event.origin_server_ts)
            :content="event.content"
            :roomId="roomId"
          />
          <div v-else-if="event.type==='m.room.member'" class="info">
            {{membershipEvents[event.content.membership]}}
            <span class="time">{{getTime(event.origin_server_ts)}}</span>
          </div>
          <div v-else class="info">unknown event
            <span class="time">{{getTime(event.origin_server_ts)}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import message from "@/components/message";
import userThumbnail from "@/components/userThumbnail";
import {matrix} from "@/main";
import splitArray from "@/lib/splitArray";
import {getDate, getTime} from "@/lib/getTimeStrings";
import sdk from "matrix-js-sdk"

export default {
  name: 'eventGroup',
  components: {
    message,
    userThumbnail
  },
  props: {
    timeline: Array,
    user: String,
    groupTimeline: Boolean,
    roomId: String
  },
  methods: {
    getUser(userId) {
      return matrix.client.getUser(userId);
    },
    getReplyId(event){
      if(!event.content['m.relates_to']) return undefined;
      if(!event.content['m.relates_to']['m.in_reply_to']) return undefined;
      return event.content['m.relates_to']['m.in_reply_to'].event_id || undefined;
    },
    async getReplyEvent(event, callback){
      let replyId = this.getReplyId(event);
      if (replyId === undefined) return undefined;
      await matrix.client.fetchRoomEvent(this.roomId, replyId).then((res) => {
        callback(new sdk.MatrixEvent(res));
      });
    },
    splitArray,
    getDate,
    getTime
  },
  data(){
    return {
      membershipEvents:{
        invite: 'was invented',
        join: 'joined the room',
        leave: 'left the room',
        ban: 'was banned'
      }
    }
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
      .event{
        .info{
          font-style: italic;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          margin-left: 0.5rem;
          .time{
            font-size: 0.7rem;
          }
        }
      }
      .indent{
        margin-left: 2.5rem;
      }
    }
  }
}
</style>