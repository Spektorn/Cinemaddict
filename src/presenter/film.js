import FilmView from '../view/card.js';
import DetailedFilmView from '../view/detailed-card.js';

import {renderElement, replaceElement, operateWithChildElement, removeComponent} from '../utilities/render.js';

const Mode = {
  BRIEF: 'BRIEF',
  DETAILED: 'DETAILED',
};

export default class Film {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmBriefComponent = null;
    this._filmDetailedComponent = null;
    this._mode = Mode.BRIEF;

    this._handleToDetailedClick = this._handleToDetailedClick.bind(this);
    this._handleToBriefClick = this._handleToBriefClick.bind(this);
    this._handleAddToWatchlist = this._handleAddToWatchlist.bind(this);
    this._handleAddToWatched = this._handleAddToWatched.bind(this);
    this._handleAddToFavorite = this._handleAddToFavorite.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevFilmBriefComponent = this._filmBriefComponent;
    const prevFilmDetailedComponent = this._filmDetailedComponent;

    this._filmBriefComponent = new FilmView(this._film, this._comments);
    this._filmDetailedComponent = new DetailedFilmView(this._film, this._comments);

    this._filmBriefComponent.setToDetailedClickHandler(this._handleToDetailedClick);
    this._filmBriefComponent.setToWatchlistClickHandler(this._handleAddToWatchlist);
    this._filmBriefComponent.setToWatchedClickHandler(this._handleAddToWatched);
    this._filmBriefComponent.setToFavoriteClickHandler(this._handleAddToFavorite);

    this._filmDetailedComponent.setToBriefClickHandler(this._handleToBriefClick);
    this._filmDetailedComponent.setToWatchlistClickHandler(this._handleAddToWatchlist);
    this._filmDetailedComponent.setToWatchedClickHandler(this._handleAddToWatched);
    this._filmDetailedComponent.setToFavoriteClickHandler(this._handleAddToFavorite);

    if (prevFilmBriefComponent === null || prevFilmDetailedComponent === null) {
      renderElement(this._filmsListContainer, this._filmBriefComponent, 'beforeend');
      return;
    }

    replaceElement(this._filmBriefComponent, prevFilmBriefComponent);

    if (this._mode === Mode.DETAILED) {
      replaceElement(this._filmDetailedComponent, prevFilmDetailedComponent);
    }

    removeComponent(prevFilmBriefComponent);
    removeComponent(prevFilmDetailedComponent);
  }

  destroyInstance() {
    removeComponent(this._filmBriefComponent);
    removeComponent(this._filmDetailedComponent);
  }

  resetView() {
    if (this._mode !== Mode.BRIEF) {
      this._closeDetailedCard();
    }
  }

  _invertFilmFlag(flagName) {
    let invertedFlag = {};

    switch(flagName) {
      case 'isInWatchlist':
        invertedFlag = {isInWatchlist: !this._film.isInWatchlist};
        break;
      case 'isWatched':
        invertedFlag = {isWatched: !this._film.isWatched};
        break;
      case 'isFavorite':
        invertedFlag = {isFavorite: !this._film.isFavorite};
        break;
    }

    return new Map([
      [
        Object.assign(
          {},
          this._film,
          invertedFlag,
        ),
        this._comments,
      ],
    ]);
  }

  _openDetailedCard() {
    this._changeMode();

    this._mode = Mode.DETAILED;
    operateWithChildElement(document.body, this._filmDetailedComponent, 'append');
  }

  _closeDetailedCard() {
    this._mode = Mode.BRIEF;
    operateWithChildElement(document.body, this._filmDetailedComponent, 'remove');
  }

  _handleToDetailedClick() {
    this._openDetailedCard();
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  }

  _handleToBriefClick() {
    this._closeDetailedCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.remove('hide-overflow');
  }

  _handleAddToWatchlist() {
    this._changeData(this._invertFilmFlag('isInWatchlist'));
  }

  _handleAddToWatched() {
    this._changeData(this._invertFilmFlag('isWatched'));
  }

  _handleAddToFavorite() {
    this._changeData(this._invertFilmFlag('isFavorite'));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeDetailedCard();
      document.removeEventListener('keydown', this._escKeyDownHandler);
      document.body.classList.remove('hide-overflow');
    }
  }
}
