export default class SortableTable {
  element;
  constructor(
    headerConfig = [id = '', title = '', sortable = true, sortType = ''], 
    data = [id = '', title = '', price = 0, sales = 0]
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createElementTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createHeaderElementTemplate(header) {
    return header.map(item => {
      return `
	  <div class="sortable-table__cell" data-id="${item['id']}" data-sortable="${item['sortable']}" data-order="${item['sortType']}">
			<span>${item['title']}</span>
			</div>
	`;
    }).join('');
  }

  createBodyElementTemplate(body) {
    return body.map(item => {
      return `
			<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
			${this.headerConfig.map((item) => {
				return `
				<div class="sortable-table__cell">
						${item['id']}
					</div>
				`;
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

