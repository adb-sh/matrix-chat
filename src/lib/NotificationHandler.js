import {getMxcFromUserId, getAvatarUrl} from '@/lib/getMxc';
import {calcUserName} from '@/lib/matrixUtils';
import {getRoom} from '@/lib/matrixUtils';
import {router} from '@/router';

export class NotificationHandler{
  constructor() {
    this.activateNotification();
  }
  async activateNotification(){
    if (!window.Notification){
      console.log('notifications are unsupported')
      return false;
    }
    if (Notification.permission === 'granted') return true;
    return await Notification.requestPermission()
      .then(permission => {return permission === 'granted'});
  }
  showNotification(event){
    if (Notification.permission !== 'granted') return false;
    console.log(event);
    let mxc = getMxcFromUserId(event.sender);
    new Notification(`${calcUserName(event.sender)} in ${getRoom(event.room_id).name}`, {
      body: event.content.body,
      icon: mxc?getAvatarUrl(mxc):undefined
    }).onclick = ()=>router.push(`/rooms/${event.room_id}`);
  }
}