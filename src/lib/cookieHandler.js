export class cookieHandler {
  constructor(expires) {
    this.expires = expires;
    this.reload();
  }
  getCookie(key){
    if (!this.cookies) return undefined;
    let cookie = this.cookies.find(cookie => cookie.split('=')[0] === key);
    return cookie ? cookie.split('=')[1] : false;
  }
  setCookie(object){
    object.forEach((value, key) => {
      this.cookies[key] = value;
    })
  }
  parseCookie(string){
    let cookies;
    string.replace(/ /g, '').split(';').forEach(cookie => {
      let arr = cookie.split('=');
      cookies[arr[0]] = arr[1];
    })
    return cookies;
  }
  reload(){
    if (document.cookie) this.cookies = this.parseCookie(document.cookie);
  }
  store(){
    document.cookie = this.toString();
  }
  toString(cookies = this.cookies){
    let string = '';
    cookies.forEach((value, key) => {
      string += `${key}=${value}; `;
    })
    return string;
  }
}
