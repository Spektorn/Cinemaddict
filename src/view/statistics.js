import {createElement} from '../utilities.js';

const createStatisticsTemplate = (filmsQuantity) => {
  return `<p>${filmsQuantity} movies inside</p>`;
};

export default class Statistics {
  constructor(filmsQuantity) {
    this._filmsQuantity = filmsQuantity;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsQuantity);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
