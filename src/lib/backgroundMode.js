import {BackgroundMode} from '@ionic-native/background-mode/ngx';

export function enableBackgroundMode(){
  BackgroundMode.prototype.enable();
  BackgroundMode.prototype.setDefaults({
    title: '[chat]',
    text: 'sync is running in background ...',
    icon: 'status_icon',
    color: '#222',
    resume: true,
    hidden: true,
    bigText: false
  });
  console.log('backgroundMode enabled');
}