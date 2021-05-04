import {matrix} from '@/main';

export function getUser(userId) {
  return matrix.client.getUser(userId);
}
export function calcUserName(userId){
  if (matrix.user === userId) return 'you';
  return matrix.client.getUser(userId).displayName || userId;
}
export function getRoom(roomId){
  return matrix.client.getRoom(roomId);
}
export function isValidUserId(id){
  return id.match(/^@[a-zA-Z0-9_.+-]+:[a-z0-9.-]+\.[a-z]+$/);
}
export function isValidRoomId(id){
  return id.match(/^(#|!)[a-zA-Z0-9_.+-]+:[a-z0-9.-]+\.[a-z]+$/);
}