import {cookieHandler} from '@/lib/cookieHandler';
import {Capacitor, Plugins} from '@capacitor/core';
const {Storage} = Plugins;

export class DataStore{
  constructor(){
    this.cookie = new cookieHandler();
    this.cookie.setExpire(15);
    this.store = localStorage;
  }
  async set(key, value){
    if (Capacitor.isNative) return await Storage.set({key, value: JSON.stringify(value)});
    this.store.setItem(key, JSON.stringify(value));
    this.cookie.set(key, JSON.stringify(value));
    this.cookie.store();
  }
  async get(key){
    if (Capacitor.isNative) return JSON.parse((await Storage.get({key})).value||'null');
    return JSON.parse(this.store.getItem(key) || this.cookie.get(key) || 'null');
  }
}