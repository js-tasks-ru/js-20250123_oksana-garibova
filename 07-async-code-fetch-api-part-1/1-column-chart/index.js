import fetchJson from './utils/fetch-json.js';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
url;
subElements = {};
constructor({
  url = '',
  range = {},
  label = '',
  link = '',
  formatHeading = value => value,
} = {}) {
  super({label, link, formatHeading});
  this.selectSubElements();
  this.url = url;
  const { from, to } = range;
  this.fetchData(from, to);
}

selectSubElements() {
  this.element.querySelectorAll('[data-element]').forEach(element => {
    this.subElements[element.dataset.element] = element;
  });
}

createUrl(from, to) {
  const url = new URL(this.url, BACKEND_URL);
  url.searchParams.set('from', from);
  url.searchParams.set('to', to);
  return url.toString();
}

fetchData (from, to) {
  fetch(this.createUrl(from, to))
.then(response => response.json)
.then(data => {
  this.value = this.data.reduce((sum, current)=>sum + current, 0);
  super.update(Object.values(data));
})
.catch(err => console.log(err));
}

async update (from, to) {
  try {
    const url = this.createUrl(from, to);
    const response = await fetchJson(url);
    this.data = Object.values(response);
    super.update(this.data);
    return response;
  }
  catch (err) {
    throw err;
  }
}

}
