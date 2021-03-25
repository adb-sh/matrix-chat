import rest from 'superagent';

export class AdminAPI{
  constructor(baseUrl, accessToken){
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }
  
  async sendRequest({path, obj={}, method=rest=>rest.get}){
    return await method(rest)(`${this.baseUrl}${path}?access_token=${this.accessToken}`)
      .send(obj).set('accept', 'json').then(res => {
        return JSON.parse(res.text);
      }).catch(err => {
        console.log(err);
        return false;
      });
  }

  async getUsers(){
    return await this.sendRequest({path: 'v2/users'});
  }
  async resetPassword({userId, password}){
    return await this.sendRequest({
      path: `v1/reset_password/${userId}`,
      method: rest=>rest.post,
      obj: {
        new_password: password,
        logout_devices: true
      }
    });
  }
  async updateUser({userId, password, displayname, avatar_url=undefined}){
    return await this.sendRequest({
      path: `v2/users/${userId}`,
      method: rest=>rest.put,
      obj: {
        password,
        displayname,
        avatar_url,
        admin: false,
        deactivated: false
      }
    });
  }
}