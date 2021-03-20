export default class {
  constructor(element) {
    this.element = element
  }
  scrollToBottom(){
    this.setScrollBottom(0);
  }
  getScrollBottom(){
    return this.element.scrollHeight - this.element.scrollTop - this.element.offsetHeight;
  }
  setScrollBottom(height){
    this.element.scrollTop = this.element.scrollHeight - this.element.offsetHeight - height;
  }
}