import {cookieHandler} from '@/lib/cookieHandler';

export class DataStore{
  constructor(){
    this.cookie = new cookieHandler();
    this.cookie.setExpire(15);
    this.store = localStorage;
  }
  set(key, value){
    this.cookie.set(key, value);
    this.cookie.store();
    this.store.setItem(key, value);
  }
  get(key){
    return this.store.getItem(key) || this.cookie.get(key);
  }
  setObj(obj){
    this.cookie.setCookies(obj);
    this.cookie.store();
    Object.keys(obj).forEach(key => this.store.setItem(key, obj[key]));
  }
}