import AbstractView from './abstract.js';

const createListTemplate = () => {
  return `<section class="films">
            <section class="films-list">
              <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

              <div class="films-list__container">

              </div>
            </section>

            <section id="top-rated" class="films-list films-list--extra">
              <h2 class="films-list__title">Top rated</h2>

              <div class="films-list__container">

              </div>
            </section>

            <section id="most-commented" class="films-list films-list--extra">
              <h2 class="films-list__title">Most commented</h2>

              <div class="films-list__container">

              </div>
            </section>
          </section>`;
};

export default class List extends AbstractView {
  getTemplate() {
    return createListTemplate();
  }
}
