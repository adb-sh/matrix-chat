import sdk from 'matrix-js-sdk'
import {matrix} from '@/main';

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

export function getPreviewUrl(mxcUrl, size = 64, resizeMethod = 'crop'){
  return matrix.client.mxcUrlToHttp(mxcUrl, size, size, resizeMethod);
}

export function getMediaUrl(mxcUrl){
  return matrix.client.mxcUrlToHttp(mxcUrl);
}