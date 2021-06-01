import FilterView from '../view/filter.js';

import {UpdateType, FilterType} from '../utilities/constants.js';
import {renderElement, replaceElement, removeComponent} from '../utilities/render.js';
import {filterMap} from '../utilities/filter.js';


export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterClickHandler(this._handleViewAction);

    if (prevFilterComponent === null) {
      renderElement(this._filterContainer, this._filterComponent, 'beforeend');
      return;
    }

    replaceElement(this._filterComponent, prevFilterComponent);
    removeComponent(prevFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        id: FilterType.ALL,
        title: 'All movies',
        quantity: filterMap[FilterType.ALL](films).length,
      },
      {
        id: FilterType.WATCHLIST,
        title: 'Watchlist',
        quantity: filterMap[FilterType.WATCHLIST](films).length,
      },
      {
        id: FilterType.HISTORY,
        title: 'History',
        quantity: filterMap[FilterType.HISTORY](films).length,
      },
      {
        id:  FilterType.FAVORITES,
        title: 'Favorites',
        quantity: filterMap[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleViewAction(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
