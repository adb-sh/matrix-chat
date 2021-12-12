import matrix from 'matrix-js-sdk';
import {NotificationHandler} from '@/lib/NotificationHandler';
import {sortRoomsByTimestamp} from '@/lib/matrixUtils';
import {DataStore} from '@/lib/DataStore';
import olm from 'olm';
// eslint-disable-next-line no-undef
global.Olm = olm;

export class MatrixHandler {
  constructor(clientDisplayName = 'matrix-chat') {
    this.store = new DataStore();
    this.clientDisplayName = clientDisplayName;
    this.accessToken = undefined;
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
      let tempClient = new matrix.createClient({...this.params, baseUrl});
      tempClient.login('m.login.password', {
        user: user,
        password: password,
        initial_device_display_name: this.clientDisplayName,
      }).then(async res => {
        if (res.error) {
          console.error(`login error => ${res.error}`);
          reject(res.error);
        }
        if (res.access_token){
          console.log(`access token => ${res.access_token}`);
          this.user = user;
          this.baseUrl = baseUrl;
          this.accessToken = res.access_token;
          this.deviceId = res.device_id;
          await this.updateDataStore();
          resolve(this.tokenLogin({}));
        }
      }).catch(async error => {
        console.error(error);
        await tempClient.stopClient()
        tempClient = null;
        reject(error.toString());
      })
    });
  }
  tokenLogin({baseUrl = this.baseUrl, accessToken = this.accessToken, userId = this.user, deviceId = this.deviceId}){
    this.loading = true;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (this.client){
        console.log('there is already an active session');
        reject();
      }
      this.client = new matrix.createClient({
        ...this.params, userId, accessToken, baseUrl, deviceId
      });
      this.client.getAccountDataFromServer('verification').then(() => {
        this.user = userId;
        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
        this.deviceId = deviceId;
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
  updateDataStore(){
    return this.store.set('login', {
      baseUrl: this.baseUrl,
      userId: this.user,
      accessToken: this.accessToken,
      deviceId: this.deviceId
    });
  }
  loadFromDataStore(){
    return this.store.get('login').then(data => {
      this.baseUrl = data.baseUrl;
      this.user = data.userId;
      this.accessToken = data.accessToken;
      this.deviceId = data.deviceId;
      return data;
    });
  }
  async startSync(callback = ()=>{}){
    this.loading = true;
    await olm.init().then(console.log).catch(console.error);
    await this.client.initCrypto();
    await this.client.startClient({ initialSyncLimit: 1 });
    await new Promise(resolve => this.client.on('sync', state => {
      if (state === 'PREPARED') resolve();
    }));
    this.client.setGlobalErrorOnUnknownDevices(false);
    //this.client.requestVerification(this.user)
    this.reloadRooms();
    this.loading = false;
    callback();
    this.listenToRoomChanges();
    this.listenToPushEvents();
    this.client.on('Room.timeline', message => {
      if (message.event.type === 'm.room.encrypted') message = this.client._crypto.decryptEvent(message);
    });
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
      .catch((err) => console.log('error while sending message =>', err));
  }
}
