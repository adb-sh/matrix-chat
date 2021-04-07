import sdk from 'matrix-js-sdk'
import {matrix} from '@/main';
import parseMXC from '@modular-matrix/parse-mxc';

export function getMxcFromUser(user){
  return user.avatarUrl;
}

export function getMxcFromUserId(userId){
  return matrix.client.getUser(userId).avatarUrl;
}

export function getMxcFromRoom(room){
  let avatarState = room.getLiveTimeline().getState(sdk.EventTimeline.FORWARDS).getStateEvents('m.room.avatar');
  return avatarState.length>0?avatarState[avatarState.length-1].getContent().url:undefined;
}

export function getMxcFromRoomId(roomId){
  return getMxcFromRoom(matrix.client.getRoom(roomId));
}

export function getAvatarUrl(mxcUrl, size = 64, resizeMethod = 'crop'){
  let mxc = parseMXC.parse(mxcUrl);
  return `${matrix.baseUrl}/_matrix/media/v1/thumbnail/${
    mxc.homeserver}/${mxc.id}?width=${size}&height=${size}&method=${resizeMethod}`;
}