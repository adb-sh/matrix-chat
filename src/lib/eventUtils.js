export function solveTextLinks(text){
  return (text || '').replace(
    /([^\S]|^)(((https?:\/\/)|(www\.))(\S+))/gi,
    (match, space, url)=>{
      let hyperlink = url;
      if (!hyperlink.match('^https?://')) {
        hyperlink = 'http://' + hyperlink;
      }
      return `${space}<a href="${hyperlink}" target="_blank">${url}</a>`;
    }
  )
}
export function parseMessage(msg){
  return solveTextLinks(
    msg.replace(/>.*\n/gm, '').trim()
      .replace(/</g, '&lt')
      .replace(/>/g, '&gt')
  );
}