import AbstractView from './abstract.js';

const renderFilters = (filters, activeFilter) => {
  return filters.map(({id, title, quantity} = {}) =>
    `<a href="#${id}" class="main-navigation__item ${id === activeFilter ? 'main-navigation__item--active' : ''}"
    data-filter-type="${id}">${title} ${id !== 'all' ? `<span class="main-navigation__item-count">${quantity}</span>` : ''}</a>`)
    .join('');
}

const createFilterTemplate = (filters, activeFilter) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">

              ${renderFilters(filters, activeFilter)}

            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, activeFilter) {
    super();

    this._filters = filters;
    this._activeFilter = activeFilter;

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  _filterClickHandler(evt) {
    const newFilter = evt.target.closest('.main-navigation__item');

    evt.preventDefault();

    if (newFilter) {
      this._callback.filterClick(newFilter.dataset.filterType);
    }
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;

    this.getElement().addEventListener('click', this._filterClickHandler);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._activeFilter);
  }
}
