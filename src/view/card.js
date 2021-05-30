import AbstractView from './abstract.js';

import {dateFormatReleaseBrief} from '../utilities/date.js';

const MAX_DESCRIPTION_LENGTH = 140;

const renderDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`;
  }

  return description;
};

const renderActiveClass = (flag) => {
  return flag ? 'film-card__controls-item--active' : '';
};

const createCardTemplate = (film, comments) => {
  const {poster, title, description, rating, releaseDate, runningTime, genres, isInWatchlist, isWatched, isFavorite} = film;

  return `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${dateFormatReleaseBrief(releaseDate)}</span>
              <span class="film-card__duration">${runningTime}</span>
              <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${renderDescription(description)}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${renderActiveClass(isInWatchlist)}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${renderActiveClass(isWatched)}" type="button">Mark as watched</button>
              <button class="film-card__controls-item button film-card__controls-item--favorite ${renderActiveClass(isFavorite)}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};
export default class Card extends AbstractView {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;

    this._toDetailedClickHandler = this._toDetailedClickHandler.bind(this);
    this._toWatchlistClickHandler = this._toWatchlistClickHandler.bind(this);
    this._toWatchedClickHandler = this._toWatchedClickHandler.bind(this);
    this._toFavoriteClickHandler =  this._toFavoriteClickHandler.bind(this);
  }

  _toDetailedClickHandler(evt) {
    evt.preventDefault();
    this._callback.toDetailedClick();
  }

  _toWatchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.toWatchlistClick();
  }

  _toWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.toWatchedClick();
  }

  _toFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.toFavoriteClick();
  }

  setToDetailedClickHandler(callback) {
    this._callback.toDetailedClick = callback;

    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._toDetailedClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._toDetailedClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._toDetailedClickHandler);
  }

  setToWatchlistClickHandler(callback) {
    this._callback.toWatchlistClick = callback;

    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._toWatchlistClickHandler);
  }

  setToWatchedClickHandler(callback) {
    this._callback.toWatchedClick = callback;

    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._toWatchedClickHandler);
  }

  setToFavoriteClickHandler(callback) {
    this._callback.toFavoriteClick = callback;

    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._toFavoriteClickHandler);
  }

  getTemplate() {
    return createCardTemplate(this._film, this._comments);
  }
}
