import Observer from '../utilities/observer.js';

import {getSlicedDataFromMap} from '../utilities/common.js';

export default class Films extends Observer {
  constructor() {
    super();

    this._films = new Map();
  }

  setFilms(films) {
    this._films = new Map(films);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedItem) {
    const updatingItemIndex = Array.from(this._films.keys()).findIndex((item) => item.id === updatedItem.keys().next().value.id);

    if (updatingItemIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = new Map([
      ...getSlicedDataFromMap(this._films, 0, updatingItemIndex),
      ...updatedItem,
      ...getSlicedDataFromMap(this._films, updatingItemIndex + 1, this._films.size),
    ]);

    this._notify(updateType, updatedItem);
  }
}
