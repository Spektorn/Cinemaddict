import AbstractView from './abstract.js';

import {FilterType} from '../utilities/constants.js';

const renderFilters = (filters, activeFilter) => {
  let filtersList = '';

  for (const filter of filters) {
    filtersList += `<a href="#${filter.id}" class="main-navigation__item ${filter.id === activeFilter ? 'main-navigation__item--active' : ''}"
    data-filter-type="${filter.id}">${filter.title} ${filter.id !== 'all' ? `<span class="main-navigation__item-count">${filter.quantity}</span>` : ''}</a>`;
  }

  return filtersList;
};

const createFilterTemplate = (filters, activeFilter) => {
  return `<nav class="main-navigation">
            <div class="main-navigation__items">

              ${renderFilters(filters, activeFilter)}

            </div>
            <a href="#stats" class="main-navigation__additional ${FilterType.STATISTICS === activeFilter ? 'main-navigation__additional--active' : ''}" data-filter-type="stats">Stats</a>
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
    evt.preventDefault();

    const newFilter = evt.target.closest('A');

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
