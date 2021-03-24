import rest from 'superagent';

export class AdminAPI{
  constructor(baseUrl, accessToken){
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }
  
  async sendRequest({path, obj={}, method=rest=>rest.get}){
    return await method(rest)(`${this.baseUrl}${path}?access_token=${this.accessToken}`)
      .send(JSON.stringify(obj)).set('accept', 'json').then(res => {
        return JSON.parse(res.text);
      });
  }

  async getUsers(){
    return await this.sendRequest({path: 'users'});
  }
  async resetPassword(userId, newPassword){
    return await this.sendRequest({
      path: `reset_password/${userId}`,
      obj: {
        new_password: newPassword,
        logout_devices: true
      }
    });
  }
  async createUser(userId, password, displayName, avatarUrl=undefined){
    return await this.sendRequest({
      path: `reset_password/${userId}`,
      method: rest=>rest.put,
      obj: {
        'password': password,
        'displayname': displayName,
        'avatar_url': avatarUrl,
        'admin': false,
        'deactivated': false
      }
    });
  }
}