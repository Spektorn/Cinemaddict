import {nanoid} from 'nanoid';
import he from 'he';

import SmartView from './smart.js';

import {getRandomArrayValue} from '../utilities/common.js';
import {getTodayDate, dateFormatReleaseDetailed, dateFormatComment} from '../utilities/date.js';

const renderGenres = (genres) => {
  const genresTitle = genres.length > 1 ? 'Genres' : 'Genre';
  let genresTable = '';

  genres.forEach((element) => {
    genresTable += `<span class="film-details__genre">${element}</span>`;
  });

  return `<tr class="film-details__row">
            <td class="film-details__term">${genresTitle}</td>
            <td class="film-details__cell">
              ${genresTable}
            </td>
          </tr>`;
};

const renderCheckedState = (flag) => {
  return flag ? 'checked' : '';
};

const renderComments = (comments) => {
  if (!comments) {
    return;
  }

  let renderedComments = '';

  comments.forEach((element) => {
    renderedComments += `<li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
                  </span>
                  <div>
                    <p class="film-details__comment-text">${he.encode(element.text)}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${element.author}</span>
                      <span class="film-details__comment-day">${dateFormatComment(element.date)}</span>
                      <button class="film-details__comment-delete" data-comment-id="${element.id}">Delete</button>
                    </p>
                  </div>
                </li>`;
  });

  return `<ul class="film-details__comments-list">
            ${renderedComments}
          </ul>`;
};

const renderNewCommentText = (text) => {
  if (!text) {
    return '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';
  }

  return `<textarea class="film-details__comment-input" name="comment">${text}</textarea>`;
};

const renderNewCommentEmotion = (emotion) => {
  if (!emotion) {
    return '<div class="film-details__add-emoji-label"></div>';
  }

  return `<div class="film-details__add-emoji-label">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
          </div>`;
};

const renderEmotionsList = (currentEmotion) => {
  const availableEmotions = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  return availableEmotions.map((emotion) => {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}"
    value="${emotion}" ${currentEmotion === emotion ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join('');
};

const createDetailedCardTemplate = (film) => {
  const {poster, title, originalTitle, description, rating, ageRating, country,
    releaseDate, runningTime, genres, director, scriptwriters, actors,
    isInWatchlist, isWatched, isFavorite, comments, newCommentText, newCommentEmotion} = film;

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${title}">

                    <p class="film-details__age">${ageRating} +</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${originalTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${scriptwriters.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dateFormatReleaseDetailed(releaseDate)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${runningTime}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      ${renderGenres(genres)}
                    </table>

                    <p class="film-details__film-description">${description}</p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${renderCheckedState(isInWatchlist)}>
                  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${renderCheckedState(isWatched)}>
                  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

                  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${renderCheckedState(isFavorite)}>
                  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
                  ${renderComments(comments)}
                  <div class="film-details__new-comment">
                    ${renderNewCommentEmotion(newCommentEmotion)}
                    <label class="film-details__comment-label">
                      ${renderNewCommentText(newCommentText)}
                    </label>

                    <div class="film-details__emoji-list">
                      ${renderEmotionsList(newCommentEmotion)}
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class DetailedCard extends SmartView {
  constructor(film, comments) {
    super();

    this._state = DetailedCard.parseDataToState(
      new Map([
        [film, comments],
      ]),
    );

    this._prevNewCommentText = null;
    this._prevNewCommentEmotion = null;

    this._toBriefClickHandler = this._toBriefClickHandler.bind(this);
    this._toWatchlistCheckHandler = this._toWatchlistCheckHandler.bind(this);
    this._toWatchedCheckHandler = this._toWatchedCheckHandler.bind(this);
    this._toFavoriteCheckHandler =  this._toFavoriteCheckHandler.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentTextChangeHandler = this._commentTextChangeHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  _toBriefClickHandler(evt) {
    evt.preventDefault();
    this._callback.toBriefClick();
  }

  _toWatchlistCheckHandler(evt) {
    evt.preventDefault();
    this._callback.toWatchlistCheck();
  }

  _toWatchedCheckHandler(evt) {
    evt.preventDefault();
    this._callback.toWatchedCheck();
  }

  _toFavoriteCheckHandler(evt) {
    evt.preventDefault();
    this._callback.toFavoriteCheck();
  }

  _commentAddHandler() {
    if (this._state.newCommentText && this._state.newCommentEmotion) {
      this._callback.addCommentKeyDown(
        DetailedCard.parseStateToData(this._state, {isNewCommentSaving: false, isNewCommentAdding: true}),
      );
    }
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();

    const deleteButton = evt.target.closest('.film-details__comment-delete');

    if (deleteButton) {
      this._state.comments.splice(this._state.comments.findIndex((comment) => comment.id === deleteButton.dataset.commentId), 1);
      this._callback.deleteCommentClick(
        DetailedCard.parseStateToData(this._state, {isNewCommentSaving: true, isNewCommentAdding: false}),
      );
    }
  }

  _commentTextChangeHandler(evt) {
    evt.preventDefault();
    this.updateState({
      newCommentText: evt.target.value,
    },
    false,
    );
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    this.updateState({
      newCommentEmotion: evt.target.value,
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._emotionChangeHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('change', this._commentTextChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setToBriefClickHandler(this._callback.toBriefClick);
    this.setToWatchlistCheckHandler(this._callback.toWatchlistCheck);
    this.setToWatchedCheckHandler(this._callback.toWatchedCheck);
    this.setToFavoriteCheckHandler(this._callback.toFavoriteCheck);
    this.setСommentDeleteHandler(this._callback.deleteCommentClick);
  }

  setToBriefClickHandler(callback) {
    this._callback.toBriefClick = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._toBriefClickHandler);
  }

  setFilmStatusCheckHandler(callback) {
    this._callback.filmStatusCheck = callback;

    this.getElement().querySelector('input#watchlist').addEventListener('change', this._filmStatusCheckHandler);
    this.getElement().querySelector('input#watched').addEventListener('change', this._filmStatusCheckHandler);
    this.getElement().querySelector('input#favorite').addEventListener('change', this._filmStatusCheckHandler);
  }

  setToWatchlistCheckHandler(callback) {
    this._callback.toWatchlistCheck = callback;

    this.getElement().querySelector('input#watchlist').addEventListener('change', this._toWatchlistCheckHandler);
  }

  setToWatchedCheckHandler(callback) {
    this._callback.toWatchedCheck = callback;

    this.getElement().querySelector('input#watched').addEventListener('change', this._toWatchedCheckHandler);
  }

  setToFavoriteCheckHandler(callback) {
    this._callback.toFavoriteCheck = callback;

    this.getElement().querySelector('input#favorite').addEventListener('change', this._toFavoriteCheckHandler);
  }

  setСommentDeleteHandler(callback) {
    this._callback.deleteCommentClick = callback;

    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._commentDeleteHandler);
  }

  initСommentAddHandler(callback) {
    this._callback.addCommentKeyDown = callback;

    this._commentAddHandler();
  }

  getTemplate() {
    return createDetailedCardTemplate(this._state);
  }

  static parseDataToState(data) {
    return Object.assign(
      {},
      data.keys().next().value,
      {
        comments: data.values().next().value,
        newCommentText: this._prevNewCommentText,
        newCommentEmotion: this._prevNewCommentEmotion,
      },
    );
  }

  static parseStateToData(state, {isNewCommentSaving, isNewCommentAdding} = {}) {
    //* Временная генерация случайного автора для нового комментария до загрузки данных с сервера
    const people = [
      'Anthony Mann',
      'Anne Wigton',
      'Heinz Herald',
      'Richard Weil',
      'Erich von Stroheim',
      'Mary Beth Hughes',
      'Dan Duryea',
    ];

    state = Object.assign({}, state);
    const comments = state.comments;
    this._prevNewCommentText = isNewCommentSaving ? state.newCommentText : null;
    this._prevNewCommentEmotion = isNewCommentSaving ? state.newCommentEmotion : null;

    if(isNewCommentAdding) {
      comments.push({
        id: nanoid(),
        author: getRandomArrayValue(people),
        date: getTodayDate(),
        text: state.newCommentText,
        emotion: state.newCommentEmotion,
      });
    }

    delete state.comments;
    delete state.newCommentText;
    delete state.newCommentEmotion;

    return new Map([
      [
        state, comments,
      ],
    ]);
  }
}
