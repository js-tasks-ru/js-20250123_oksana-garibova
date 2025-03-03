import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
static pageSize = 10;
url;
offsetStart = 0;
offsetEnd = 30;
isFetching = false;
constructor(headersConfig, {
  data = [],
  isSortLocally,
  sorted = {
    id: 'title',
    order: 'asc'
  },
  url
} = {}) {
  super(headersConfig, { data, sorted });
  this.data = data;
  this.isSortLocally = isSortLocally;
  this.url = url;
  this.fetchData();
}

createUrl() {
  const url = new URL(this.url, BACKEND_URL);
  url.searchParams.set('_embed', 'subcategory.category');
  url.searchParams.set('_sort', this.sorted.id);
  url.searchParams.set('_order', this.sorted.order);
  url.searchParams.set('_start', this.offsetStart);
  url.searchParams.set('_end', this.offsetEnd);
  return url.toString();
}

fetchData() {
  if (this.isFetching) {
    return;
  }
  this.isFetching = true;
  //индикатор загрузки
  const loadingElement = this.element.querySelector('[data-element=loading]');
  loadingElement.style.display = 'block';

  return fetchJson(this.createUrl())
  .then((data) => {
    //пустой массив
    const emptyPlaceholderElement = this.element.querySelector('[data-element=emptyPlaceholder]');
    this.data = [...data];
    if (!this.data || !this.data.length) {
      emptyPlaceholderElement.style.display = 'block';
    }
    super.update(this.data);
  })
.catch(err => {/*console.warn('Fetch error', err)*/ console.log(err.response.status);
})
.finally(() => {
  //индикатор загрузки
  loadingElement.style.display = 'none';
  this.isFetching = false;
});
}

async render() {
  try {
    const url = this.createUrl();
    const response = await fetchJson(url);
    this.data = Object.values(response);
    super.update(this.data);
    return response;
  }
  catch (err) {
    throw err;
  }
}

sortOnServer(field, order) {
  super.sortOnServer(field, order);
  this.offsetStart = 0;
  this.offsetEnd = 30;
  this.fetchData();
}

sortOnClient(field, order) {
  super.sortOnClient(field, order);
}

handleWindowScroll() {
  const shouldFetch = (window.scrollY + window.innerHeight) >= (document.body.clientHeight - 200);
  if (shouldFetch) {
    this.offsetStart += SortableTableV3.pageSize;
    this.offsetEnd += SortableTableV3.pageSize;
    this.fetchData();
  }
}

createListeners() {
  super.createListeners();
  this.handleWindowScroll = this.handleWindowScroll.bind(this);
  window.addEventListener('scroll', this.handleWindowScroll);
}

destroyListeners() {
  super.destroyListeners();
  window.removeEventListener('scroll', this.handleWindowScroll);
}

destroy() {
  super.destroy();
  this.destroyListeners();
}
}
