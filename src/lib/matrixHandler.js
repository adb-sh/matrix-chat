import matrix from 'matrix-js-sdk';

export class MatrixHandler {
  constructor(clientDisplayName = 'matrix-chat') {
    this.clientDisplayName = clientDisplayName;
    this.accessToken;
    this.client = undefined;
    this.rooms = [];
    this.loading = undefined;
    this.user = undefined;
  }
  login(user, password, baseUrl, onError, callback = ()=>{}){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      baseUrl: baseUrl
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
    this.client = new matrix.createClient({baseUrl, accessToken, userId});
    this.user = userId;
    this.startSync();
  }
  logout(){
    this.client.stopClient();
    this.client = undefined;
  }
  startSync(callback = ()=>{}){
    this.loading = true;
    this.client.startClient();
    this.client.once('sync', (state) => {
      console.log(state);
      this.rooms = this.client.getRooms();
      console.log(this.rooms)
      this.loading = false;
      callback();
    });
    this.client.on('event', (event) => {
      if (event.getType() === 'm.room.create') {
        console.log(event)
      }
    })
  }
}