import matrix from 'matrix-js-sdk';

export let client = undefined;

export class MatrixHandler {
  constructor(clientDisplayName = 'matrix-chat') {
    this.clientDisplayName = clientDisplayName;
    this.accessToken;
    this.client = undefined;
    this.rooms = undefined;
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
        console.log(this.client.getRooms());
        callback(response.access_token);
      }
    }).catch(error => {
      this.logout();
      console.log(error);
      onError(error.toString());
    })
  }
  tokenLogin(baseUrl, accessToken, userId){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({baseUrl, accessToken, userId}).then(response => {
      console.log(response);
    });
    this.client.startClient();
    this.client.once('sync', (state) => {
      console.log(state);
    });
  }
  logout(){
    this.client.stopClient();
    this.client = undefined;
  }
}