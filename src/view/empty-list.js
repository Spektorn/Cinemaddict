import AbstractView from './abstract.js';

const createEmptyListTemplate = () => {
  return `<section class="films">
            <h2 class="films-list__title">There are no movies in our database</h2>
          </section>`;
};

export default class EmptyList extends AbstractView {
  getTemplate() {
    return createEmptyListTemplate();
  }
}
