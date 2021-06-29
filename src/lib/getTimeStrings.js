export function getTime(time) {
  let date = new Date(time);
  return `${date.getHours()}:${(date.getMinutes() < 10) ? '0' : ''}${date.getMinutes()}`;
}

export function getDate(time) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let date = new Date(time);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getTimeThenDate(time){
  return time > Date.now() - 1000*60*60*12?getTime(time):getDate(time);
}