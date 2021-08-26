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
    this.sessionStore = new matrix.WebStorageSessionStore(window.localStorage);
    this.cryptoStore = new matrix.MemoryCryptoStore();
    this.params = {
      deviceId: 'matrix-chat',
      store: this.indexedDBStore,
      useAuthorizationHeader: true,
      sessionStore: this.sessionStore,
      cryptoStore: this.cryptoStore
    }
  }
  login(user, password, baseUrl){
    this.loading = true;
    return new Promise((resolve, reject) => {
      if (this.client){
        console.log('there is already an active session');
        reject();
      }
      this.client = new matrix.createClient(Object.assign({...this.params}, {
        baseUrl
      }));
      this.client.login('m.login.password', {
        user: user,
        password: password,
        initial_device_display_name: this.clientDisplayName,
      }).then(res => {
        if (res.error) {
          this.logout();
          console.error(`login error => ${res.error}`);
          reject(res.error);
        }
        if (res.access_token){
          console.log(`access token => ${res.access_token}`);
          this.user = user;
          this.baseUrl = baseUrl;
          this.accessToken = res.access_token;
          this.startSync()
          resolve(res.access_token);
        }
      }).catch(error => {
        console.error(error);
        this.logout().then(()=>reject(error.toString()));
      })
    });
  }
  tokenLogin(baseUrl, accessToken, userId){
    this.loading = true;
    return new Promise((resolve, reject) => {
      if (this.client){
        console.log('there is already an active session');
        reject();
      }
      this.client = new matrix.createClient(Object.assign({...this.params}, {
        userId: userId,
        accessToken,
        baseUrl
      }));
      this.client.getAccountDataFromServer('verification').then(() => {
        this.user = userId;
        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
        this.startSync();
        resolve(this.accessToken);
      }).catch(err=>{
        this.loading = false;
        console.error(err);
        this.logout().then(reject);
      });
    });
  }
  register(username, password, baseUrl){
    return matrix.createClient(baseUrl).register(username, password, null, { type: 'm.login.dummy' });
  }
  async logout(){
    await this.client.stopClient();
    this.client = undefined;
  }
  async deleteAllData(){
    await this.indexedDBStore?.deleteAllData();
    await this.sessionStore?.removeAllEndToEndSessions();
    await this.sessionStore?.removeEndToEndAccount();
    await this.sessionStore?.removeEndToEndDeviceData();
  }
  async startSync(callback = ()=>{}){
    this.loading = true;
    await this.client.startClient();
    await new Promise(resolve => this.client.on('sync', state => {
      if (state === 'PREPARED') resolve();
    }));
    this.reloadRooms();
    this.loading = false;
    callback();
    this.listenToRoomChanges();
    this.listenToPushEvents();
  }
  reloadRooms(){
    this.rooms = sortRoomsByTimestamp(this.client.getRooms());
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
      if (event.getType().includes('m.room')) this.reloadRooms();
    });
  }
  async sendEvent({content, type}, roomId){
    return await this.client.sendEvent(roomId, type, content)
      .then(() => console.log('message sent successfully'))
      .catch((err) => console.log(`error while sending message => ${err}`));
  }
}
