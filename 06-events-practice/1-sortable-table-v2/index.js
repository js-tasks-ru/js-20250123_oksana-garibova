import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTable {
	
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: '',
      order: ''}
  } = {}) {
    super(headersConfig, data);
    this.isSortLocally = true;
    this.sorted = sorted;
    this.arrowElement = this.createArrowElement(this.createArrowTemplate());
    this.createListeners();
    this.defaultSorting();
  }

  createArrowElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createArrowTemplate() {
    return `
		<span data-element="arrow" class="sortable-table__sort-arrow">
			<span class="sort-arrow"></span>
		 </span>
 `;
  }

  defaultSorting() {
    const defaultHeader = this.subElements.header.querySelector(`[data-id="${this.sorted.id}"]`);
    if (defaultHeader) {
      defaultHeader.dataset.order = this.sorted.order;
      defaultHeader.append(this.arrowElement);
    }
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    if (cellElement.dataset.sortable === 'false') {
      return;
    }
	
    const sortField = cellElement.dataset.id;
    const sortOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    cellElement.dataset.order = sortOrder;
    cellElement.append(this.arrowElement); 
    this.sort(sortField, sortOrder);
  }

  sort (sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sortOnServer() {
    
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }

}
