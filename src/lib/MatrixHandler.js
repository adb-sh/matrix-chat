import matrix from 'matrix-js-sdk';
import {NotificationHandler} from '@/lib/NotificationHandler';
import {sortRoomsByTimestamp} from '@/lib/matrixUtils';

export class MatrixHandler {
  constructor(clientDisplayName = 'matrix-chat') {
    this.clientDisplayName = clientDisplayName;
    this.accessToken;
    this.client = undefined;
    this.rooms = [];
    this.loading = undefined;
    this.user = undefined;
    this.baseUrl = undefined;
    this.notify = new NotificationHandler();
    this.indexedDBStore = window.indexedDB ? new matrix.IndexedDBStore({
      indexedDB: window.indexedDB,
      localStorage: window.localStorage,
      dbName: 'matrix-chat-sync'
    }):null;
    this.indexedDBStore.startup();
  }
  login(user, password, baseUrl, onError, callback = ()=>{}){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      baseUrl: baseUrl,
      store: this.indexedDBStore,
      useAuthorizationHeader: true,
      sessionStore: new matrix.WebStorageSessionStore(window.localStorage)
    });
    this.client.login('m.login.password', {
      user: user,
      password: password,
      initial_device_display_name: this.clientDisplayName,
    }).then(res => {
      if (res.error) {
        this.logout();
        console.log(`login error => ${res.error}`);
        onError(res.error);
      }
      if (res.access_token){
        console.log(`access token => ${res.access_token}`);
        callback(res.access_token);
        this.user = user;
        this.baseUrl = baseUrl;
        this.accessToken = res.access_token;
        this.startSync()
      }
    }).catch(error => {
      this.logout();
      console.log(error);
      onError(error.toString());
    })
  }
  tokenLogin(baseUrl, accessToken, userId, onError=()=>{}){
    this.loading = true;
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      userId: userId,
      accessToken,
      baseUrl,
      store: this.indexedDBStore,
      useAuthorizationHeader: true,
      sessionStore: new matrix.WebStorageSessionStore(window.localStorage)
    });
    this.client.getAccountDataFromServer('verification').then(() => {
      this.user = userId;
      this.baseUrl = baseUrl;
      this.accessToken = accessToken;
      this.startSync();
    }).catch((err)=>{
      this.loading = false;
      console.error(err);
      this.logout().then(()=>onError());
    });
  }
  async logout(){
    await this.client.stopClient();
    this.client = undefined;
  }
  async startSync(callback = ()=>{}){
    this.loading = true;
    await this.client.startClient();
    await new Promise(resolve => this.client.on('sync', state => {
      if (state === 'PREPARED') resolve();
    }));
    this.rooms = sortRoomsByTimestamp(this.client.getRooms());
    this.loading = false;
    callback();
    this.listenToRoomChanges();
    this.listenToPushEvents();
  }
  listenToPushEvents(){
    this.client.on('event', event => {
      if (this.client.getPushActionsForEvent(event).notify){
        this.notify.showNotification(event.event);
      }
    });
  }
  listenToRoomChanges(){
    this.client.on('event', event => {
      if (event.getType().includes('m.room')){
        this.rooms = sortRoomsByTimestamp(this.client.getRooms());
      }
    });
  }
  async sendEvent({content, type}, roomId){
    return await this.client.sendEvent(roomId, type, content)
      .then(() => console.log('message sent successfully'))
      .catch((err) => console.log(`error while sending message => ${err}`));
  }
}
