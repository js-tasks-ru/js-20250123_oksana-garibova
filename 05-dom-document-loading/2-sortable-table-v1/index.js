export default class SortableTable {
  element;
  subElements = {};
  constructor(
    headerConfig = [], data = []
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createElementTemplate());
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  sort(fieldValue, orderValue) {
    const tempValue = this.headerConfig.find(obj => obj.id === fieldValue);
    const direction = orderValue === "asc" ? 1 : -1;

    this.data = [...this.data].sort((a, b) => {
      if (tempValue.sortType === 'number') {
        return direction * (a[fieldValue] - b[fieldValue]);
      } 
      return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], { caseFirst: 'upper' });
    });
    
    this.subElements.body.innerHTML = this.createBodyElementTemplate(this.data);
  }
  
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;	
    return element.firstElementChild;
  }
  
  createHeaderElementTemplate(header) {
    return header.map(item => {
      return `
	  <div class="sortable-table__cell" data-id="${item['id']}" data-sortable="${item['sortable']}">
			<span>${item['title']}</span>
			</div>
	`;
    }).join('');
  }

  createBodyElementTemplate(body) {
    return body.map(itemBody => {
      return `
        <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${this.headerConfig.map((itemHeader) => {
    if (itemHeader.template) {
      return itemHeader.template([itemBody]);
    }
    else {
      return `<div class="sortable-table__cell">${itemBody[itemHeader.id]}</div>`;
    }
  }).join('')}	
			</a>
	`;
    }).join('');
  }

  createElementTemplate() {
    return `
	 	<div class="sortable-table">

			<div data-element="header" class="sortable-table__header sortable-table__row">
				${this.createHeaderElementTemplate(this.headerConfig)}
			</div>

			<div data-element="body" class="sortable-table__body">
				${this.createBodyElementTemplate(this.data)}
			</div>
		</div>
	`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

