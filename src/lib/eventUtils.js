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
  );
}
export function solveMarkdownLinks(text){
  return (text || '').replace(
    /\[([\w\s\d/\\._+-]+)]\(((?:\/|https?:\/\/)[\w\d/.?=#_+-]+)\)/gi,
    (match, text, url)=>{
      return `<a href="${url}" target="_blank">${text}</a>`;
    }
  );
}
export function fixHtml(text){
  return text.replace(/>.*\n/gm, '').trim()
    .replace(/</g, '&lt')
    .replace(/>/g, '&gt');
}
export function parseMessage(text){
  return solveMarkdownLinks(solveTextLinks(fixHtml(text)));
}