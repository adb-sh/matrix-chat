import {getMxcFromUserId, getPreviewUrl} from '@/lib/getMxc';
import {calcUserName} from '@/lib/matrixUtils';
import {getRoom} from '@/lib/matrixUtils';
import {router} from '@/router';
import {Capacitor, Plugins} from '@capacitor/core';
const {LocalNotifications} = Plugins;

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
    if (Capacitor.isNative) return this.showNativeNotification(event);
    if (Notification.permission !== 'granted') return false;
    console.log(event);
    let mxc = getMxcFromUserId(event.sender);
    new Notification(`${calcUserName(event.sender)} in ${getRoom(event.room_id).name}`, {
      body: event.content.body,
      icon: mxc?getPreviewUrl(mxc):undefined
    }).onclick = ()=>router.push(`/rooms/${event.room_id}`);
  }
  showNativeNotification(event){
    LocalNotifications.schedule({
      notifications: [
        {
          title: `${calcUserName(event.sender)} in ${getRoom(event.room_id).name}`,
          body: event.content.body,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }
}