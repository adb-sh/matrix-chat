let config = undefined;
let getUrl = async url => await fetch(url).then(res=>res.json()).catch(()=>false);

export function fetchConfig(){
  // eslint-disable-next-line no-async-promise-executor
  return new Promise( async resolve => {
    config = await getUrl('./config.json') || await getUrl('./default.config.json');
    resolve(config);
  });
}

export function getConfig(){
  return config;
}

export {config};