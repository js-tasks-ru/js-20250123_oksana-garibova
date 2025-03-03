export default class DoubleSlider {
  element;
  subElements = {};
  min;
  max;
	
  constructor({
    min = 100,
    max = 200,
    formatValue = (value) => value,
    selected = {}
  } = {}) {
    this.min = min ?? 100;
    this.max = max ?? 200;
    this.formatValue = formatValue;
    this.from = selected.from || min;
    this.to = selected.to || max;
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createEventListeners();
  }
  
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    const leftProgress = this.getLeftPercent();
    const rightProgress = this.getRightPercent();
    return `
    <div class="range-slider">
    <span data-element="from">${this.formatValue(this.from)}</span>
    <div data-element="container" class="range-slider__inner">
      <span data-element="thumbProgress" class="range-slider__progress" style="left: ${leftProgress}%; ${rightProgress}: 0%"></span>
      <span data-element="thumbLeft" class="range-slider__thumb-left" style="${leftProgress}: 0%"></span>
      <span data-element="thumbRight" class="range-slider__thumb-right" style="${rightProgress}: 0%"></span>
    </div>
    <span data-element="to">${this.formatValue(this.to)}</span>
  </div> 
	`;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }
  
  getLeftPercent() {
    const total = this.max - this.min;
    const value = this.from - this.min;
    return Math.round(value / total * 100) ;
  }

  getRightPercent() {
    const total = this.max - this.min;
    const value = this.max - this.to;
    return Math.round(value / total * 100) ;
  }

  processPointerMove = (e) => {
    const {left, width} = this.subElements.container.getBoundingClientRect();
    const containerLeftX = left;
    const containerRightX = left + width;
    const pointerX = e.clientX;
    const normalizedPointerX = Math.min(containerRightX, Math.max(containerLeftX, pointerX));
    const percentPointerX = Math.round((normalizedPointerX - containerLeftX) / (containerRightX - containerLeftX) * 100);
    return this.min + ((this.max - this.min) * percentPointerX) / 100;
  }

  createEventListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.handlePointerDown);
    this.subElements.thumbRight.addEventListener('pointerdown', this.handlePointerDown);
  }

  handlePointerDown = (e) => {
    this.activeThumb = e.target.dataset.element;
    document.addEventListener('pointermove', this.handleDocumentPointerMove);
    document.addEventListener('pointerup', this.handleDocumentPointerUp);
  }
  
  handleDocumentPointerMove = (e) => {
    if (this.activeThumb === "thumbLeft") {
      this.from = Math.min(this.to, this.processPointerMove(e));
      this.subElements.from.textContent = this.formatValue(this.from);
      this.subElements.thumbLeft.style.left = this.getLeftPercent() + '%';
      this.subElements.thumbProgress.style.left = this.getLeftPercent() + '%';
    }
    if (this.activeThumb === "thumbRight") {
      this.to = Math.max(this.from, this.processPointerMove(e));
      this.subElements.to.textContent = this.formatValue(this.to);
      this.subElements.thumbRight.style.right = this.getRightPercent() + '%';
      this.subElements.thumbProgress.style.right = this.getRightPercent() + '%';
    }
  }

 handleDocumentPointerUp = (e) => {
   this.activeThumb = null;
   this.dispatchCustomEvent();
   document.removeEventListener('pointermove', this.handleDocumentPointerMove);
   document.removeEventListener('pointerup', this.handleDocumentPointerUp);
 }

 dispatchCustomEvent() {
   const event = new CustomEvent('range-select', {
     detail: {
       from: this.from,
       to: this.to,
     },
   });
   this.element.dispatchEvent(event);
 }

 destroyEventListener() {
   this.subElements.thumbLeft.removeEventListener('pointerdown', this.handlePointerDown);
   this.subElements.thumbRight.removeEventListener('pointerdown', this.handlePointerDown);
 }

 remove() {
   this.element.remove();
 }

 destroy() {
   this.remove();
   this.destroyEventListener();
 }

}
