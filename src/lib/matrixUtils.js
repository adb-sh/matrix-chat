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
export async function createRoom({name = '', users = [], description = undefined, access = 'private'}){
  if (users.length === 0) return;
  return matrix.client.createRoom({name}).then(async room => {
    await Promise.all(users.map(async user => await matrix.client.invite(room.room_id, user.userId)));
    if (description) await matrix.client.setRoomTopic(room.room_id, description);
    await matrix.client.setGuestAccess(room.room_id, access === 'public'
      ?{allowJoin: true, allowRead: true}
      :{allowJoin: false, allowRead: false}
    );
    return matrix.client.getRoom(room.room_id);
  });
}