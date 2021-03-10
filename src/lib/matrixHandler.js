import matrix from 'matrix-js-sdk';
import {cookieHandler} from '@/lib/cookieHandler.js';

export class MatrixHandler {
  constructor(clientDisplayName = 'matrix-chat') {
    this.clientDisplayName = clientDisplayName;
    this.accessToken;
    let cookie = new cookieHandler().getCookie();
    this.client = undefined;
    if (cookie.baseUrl && cookie.accessToken && cookie.userId)
      this.tokenLogin(cookie.baseUrl, cookie.accessToken, cookie.userId);
  }
  login(user, password, baseUrl, onError){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({
      baseUrl: baseUrl
    });
    this.client.login('m.login.password', {
      user: user,
      password: password,
      initial_device_display_name: this.clientDisplayName,
    }).then((response) => {
      console.log(`access token => ${response.access_token}`);
      if (response.error) {
        console.log(`login error => ${response.error}`);
        onError(response.error);
      }
    })
  }
  tokenLogin(baseUrl, accessToken, userId){
    if (this.client){ console.log('there is already an active session'); return; }
    this.client = new matrix.createClient({baseUrl, accessToken, userId});
    this.client.startClient();
    this.client.once('sync', (state) => {
      console.log(state);
    });
  }
}