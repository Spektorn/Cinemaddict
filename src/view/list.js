import AbstractView from './abstract.js';

import {ListType} from '../utilities/constants.js';

const createListTemplate = (listType) => {
  switch (listType) {
    case ListType.ALL:
      return `<section id="all" class="films-list">
                <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
                <div class="films-list__container">
                </div>
              </section>`;
    case ListType.TOP_RATED:
      return `<section id="${listType}" class="films-list films-list--extra">
                <h2 class="films-list__title">Top rated</h2>
                <div class="films-list__container">
                </div>
              </section>`;
    case ListType.MOST_COMMENTED:
      return `<section id="${listType}" class="films-list films-list--extra">
                <h2 class="films-list__title">Most commented</h2>
                <div class="films-list__container">
                </div>
              </section>`;
    case ListType.EMPTY:
      return '<h2 class="films-list__title">There are no movies in our database</h2>';
    case ListType.LOADING:
      return '<h2 class="films-list__title">Loading...</h2>';
  }
};

export default class List extends AbstractView {
  constructor(listType) {
    super();

    this._listType = listType;
  }

  getTemplate() {
    return createListTemplate(this._listType);
  }
}
