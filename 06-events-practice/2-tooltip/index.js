class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize () {
    this.createElement();
    this.createListeners();
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('tooltip');
    this.element = element;
  }

  createListeners() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
  }

  handlePointerOver = (e) => {
    const targetElement = e.target.closest('[data-tooltip]');

    if (!targetElement) {return;}
    
    this.render(targetElement.dataset.tooltip);
  }

 handlePointerOut = () => {
   this.remove();
 }

 render(text = '') {
   this.element.textContent = text;
   document.body.append(this.element);
 }

 remove() {
   this.element.remove();
 }

 destroy() {
   this.remove();
   this.destroyListeners();
 }


}

export default Tooltip;
