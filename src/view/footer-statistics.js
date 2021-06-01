import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (filmsQuantity) => {
  return `<p>${filmsQuantity} movies inside</p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(filmsQuantity) {
    super();

    this._filmsQuantity = filmsQuantity;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsQuantity);
  }
}
