export default function splitArray(arr, key, get=obj=>obj){
  let payload = [[]];
  arr.forEach((obj, i) => {
    let nextObj = arr[i+1];
    payload[payload.length-1].push(get(obj));
    if (!nextObj) return payload;
    if (key(obj) !== key(nextObj)) payload.push([]);
  })
  return payload;
}