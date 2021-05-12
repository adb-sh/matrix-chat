export function readFileBlob(file){
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onerror = console.error;
    reader.onload = async event => resolve(await (await fetch(event.target.result)).blob());
    reader.readAsDataURL(file);
  });
}