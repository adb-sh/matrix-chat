import matrix from 'matrix-js-sdk';
import {NotificationHandler} from '@/lib/NotificationHandler';

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
  }
  login(user, password, baseUrl, onError, callback = ()=>{}){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      baseUrl: baseUrl,
      store: new matrix.MemoryStore(window.localStorage)
    });
    this.client.login('m.login.password', {
      user: user,
      password: password,
      initial_device_display_name: this.clientDisplayName,
    }).then((response) => {
      if (response.error) {
        this.logout();
        console.log(`login error => ${response.error}`);
        onError(response.error);
      }
      if (response.access_token){
        console.log(`access token => ${response.access_token}`);
        callback(response.access_token);
        this.user = user;
        this.baseUrl = baseUrl;
        this.accessToken = response.access_token;
        this.startSync()
      }
    }).catch(error => {
      this.logout();
      console.log(error);
      onError(error.toString());
    })
  }
  tokenLogin(baseUrl, accessToken, userId){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      baseUrl,
      accessToken,
      userId,
      store: new matrix.MemoryStore(window.localStorage)
    });
    this.user = userId;
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.startSync();
  }
  async logout(){
    await this.client.stopClient();
    this.client = undefined;
  }
  async startSync(callback = ()=>{}){
    this.loading = true;
    await this.client.startClient();
    this.client.once('sync', (state) => {
      console.log(state);
      this.rooms = this.client.getRooms();
      this.loading = false;
      callback();
      this.listenToPushEvents();
    });
  }
  listenToPushEvents(){
    this.client.on('event', event => {
      if (this.client.getPushActionsForEvent(event).notify){
        this.notify.showNotification(event.event);
      }
    });
  }
  async sendEvent({content, type}, roomId){
    return await this.client.sendEvent(roomId, type, content)
      .then(() => console.log('message sent successfully'))
      .catch((err) => console.log(`error while sending message => ${err}`));
  }
}