import AbstractView from './abstract.js';

const createStatisticsTemplate = (filmsQuantity) => {
  return `<p>${filmsQuantity} movies inside</p>`;
};

export default class Statistics extends AbstractView {
  constructor(filmsQuantity) {
    super();

    this._filmsQuantity = filmsQuantity;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsQuantity);
  }
}
