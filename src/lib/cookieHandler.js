export class cookieHandler {
  constructor() {
    this.cookies = {};
    this.reload();
  }
  getCookies(){
    return this.cookies;
  }
  setCookie(cookies){
    Object.keys(cookies).forEach(key => {
      this.cookies[key] = cookies[key];
    })
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
    console.log(this.cookies);
  }
  store(){
    Object.keys(this.cookies).forEach(key => {
      document.cookie = `${key}=${this.cookies[key]};`;
    });
    console.log('cookie stored');
    console.log(this.cookies);
  }
  toString(cookies = this.cookies){
    let string = '';
    Object.keys(cookies).forEach(key => {
      string += `${key}=${cookies[key]}; `;
    })
    return string;
  }
  expires(days){
    this.setCookie({
      expires: new Date(Date.now() + 86400 * 10000 * days)
    });
  }
}
