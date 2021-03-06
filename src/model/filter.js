import Observer from '../utilities/observer.js';

import {FilterType} from '../utilities/constants.js';

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;

    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
