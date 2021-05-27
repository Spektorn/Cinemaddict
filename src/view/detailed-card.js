import AbstractView from './abstract.js';

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
                    <p class="film-details__comment-text">${element.text.join(' ')}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${element.author}</span>
                      <span class="film-details__comment-day">${element.date.format('YYYY/MM/DD HH:mm')}</span>
                      <button class="film-details__comment-delete">Delete</button>
                    </p>
                  </div>
                </li>`;
  });

  return `<ul class="film-details__comments-list">
            ${renderedComments}
          </ul>`;
};

const createDetailedCardTemplate = (film, comments) => {
  const {poster, title, originalTitle, description, rating, ageRating, country,
    releaseDate, runningTime, genres, director, scriptwriters, actors, isInWatchlist, isWatched, isFavorite} = film;

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
                        <td class="film-details__cell">${releaseDate.format('DD MMMM YYYY')}</td>
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

                    <p class="film-details__film-description">${description.join(' ')}</p>
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
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class DetailedCard extends AbstractView {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;

    this._toBriefClickHandler = this._toBriefClickHandler.bind(this);
    this._toWatchlistClickHandler = this._toWatchlistClickHandler.bind(this);
    this._toWatchedClickHandler = this._toWatchedClickHandler.bind(this);
    this._toFavoriteClickHandler =  this._toFavoriteClickHandler.bind(this);
  }

  _toBriefClickHandler(evt) {
    evt.preventDefault();
    this._callback.toBriefClick();
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

  setToBriefClickHandler(callback) {
    this._callback.toBriefClick = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._toBriefClickHandler);
  }

  setToWatchlistClickHandler(callback) {
    this._callback.toWatchlistClick = callback;

    this.getElement().querySelector('input#watchlist').addEventListener('click', this._toWatchlistClickHandler);
  }

  setToWatchedClickHandler(callback) {
    this._callback.toWatchedClick = callback;

    this.getElement().querySelector('input#watched').addEventListener('click', this._toWatchedClickHandler);
  }

  setToFavoriteClickHandler(callback) {
    this._callback.toFavoriteClick = callback;

    this.getElement().querySelector('input#favorite').addEventListener('click', this._toFavoriteClickHandler);
  }

  getTemplate() {
    return createDetailedCardTemplate(this._film, this._comments);
  }
}
