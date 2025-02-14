export default class NotificationMessage {
  element;
  constructor(
    message = '', {
      duration = 1000,
      type = '',
    } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createElementTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createClassElement() {
    return `${this.type}`;
  }

  createElementTemplate() {
    return `
	 <div class="notification ${this.createClassElement()}" style="--value:20s">
		<div class="timer"></div>
		<div class="inner-wrapper">
			<div class="notification-header">${this.type}</div>
			<div class="notification-body">
			  ${this.message}
			</div>
		</div>
	</div>
	 `;
  }

  show(container = document.body) {
    if (container) {
      container.append(this.element);
    } else {
      document.body.append(this.element); 
    }
    this.timerId = setTimeout(()=> {this.remove();}, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timerId);
  }
}
