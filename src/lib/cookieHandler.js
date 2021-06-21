export class cookieHandler {
  constructor({expires}) {
    this.cookies = {};
    this.reload();
    this.expires = undefined;
    this.SameSite = 'Strict';
    this.setItem = this.set;
    this.getItem = this.get;
    this.setExpire(expires);
  }
  getCookies(){
    return this.cookies;
  }
  setCookies(cookies){
    Object.keys(cookies).forEach(key => {
      this.cookies[key] = cookies[key];
    })
  }
  set(key, value){
    this.cookies[key] = value;
  }
  get(key){
    return this.cookies[key];
  }
  parseCookie(string){
    let cookies = {};
    string.replace(/ /g, '').split(';').forEach(cookie => {
      let arr = cookie.split('=');
      cookies[arr[0]] = arr[1];
    })
    return cookies;
  }
  reload(){
    if (document.cookie) this.cookies = this.parseCookie(document.cookie);
    console.log('cookie loaded')
  }
  store(){
    Object.keys(this.cookies).forEach(key => {
      document.cookie = `${key}=${this.cookies[key]}; expires=${this.expires}; SameSite=${this.SameSite}; Secure;`;
    });
    console.log('cookie stored');
  }
  toString(cookies = this.cookies){
    let string = '';
    Object.keys(cookies).forEach(key => {
      string += `${key}=${cookies[key]}; `;
    })
    return string;
  }
  setExpire(days){
    this.expires = new Date(Date.now() + 86400 * 10000 * days);
  }
}
