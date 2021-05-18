import {createElement} from '../utilities.js';

const MAX_DESCRIPTION_LENGTH = 140;

const renderDescription = (description) => {
  const changedDescription = description.slice().join(' ');

  if (changedDescription.length > MAX_DESCRIPTION_LENGTH) {
    return `${changedDescription.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`;
  }

  return changedDescription;
};

const renderActiveClass = (flag) => {
  return flag ? 'film-card__controls-item--active' : '';
};

const createCardTemplate = (filmData, commentsData) => {
  const {poster, title, description, rating, releaseDate, runningTime, genres, isInWatchlist, isWatched, isFavorite} = filmData;

  return `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${releaseDate.format('YYYY')}</span>
              <span class="film-card__duration">${runningTime}</span>
              <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${renderDescription(description)}</p>
            <a class="film-card__comments">${commentsData.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${renderActiveClass(isInWatchlist)}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${renderActiveClass(isWatched)}" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite ${renderActiveClass(isFavorite)}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};
export default class Card {
  constructor(film, comments) {
    this._film = film;
    this._comments = comments;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._film, this._comments);
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
