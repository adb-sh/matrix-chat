let contextMenu = {
  event: false,
  options: {}
}
export function setContextMenu({options, event}){
  contextMenu.options = options;
  contextMenu.event = event;
}
export function getContextMenu(){
  return contextMenu;
}