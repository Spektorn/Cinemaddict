import {createElement} from '../utilities.js';

const createEmptyListTemplate = () => {
  return `<section class="films">
            <h2 class="films-list__title">There are no movies in our database</h2>
          </section>`;
};

export default class EmptyList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListTemplate();
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
