import {cookieHandler} from '@/lib/cookieHandler';
import {Capacitor, Plugins} from '@capacitor/core';
const {Storage} = Plugins;

export class DataStore{
  constructor(){
    this.store = window.localStorage || new cookieHandler({expires: 15});

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(persistent => {
        console.log('persistent storage', persistent);
      });
    }
  }
  async set(key, value){
    if (Capacitor.isNative) return await Storage.set({key, value: JSON.stringify(value)});
    this.store.setItem(key, JSON.stringify(value));
  }
  async get(key){
    if (Capacitor.isNative) return JSON.parse((await Storage.get({key})).value||'null');
    return JSON.parse(this.store.getItem(key) || 'null');
  }
}
