import FilmView from '../view/card.js';
import DetailedFilmView from '../view/detailed-card.js';

import {KeyCode, FilmState, FilterType, UserAction, UpdateType} from '../constants.js';
import {renderElement, replaceElement, operateWithChildElement, removeComponent} from '../utilities/render.js';

const Mode = {
  BRIEF: 'BRIEF',
  DETAILED: 'DETAILED',
};

export default class Film {
  constructor(filmsListContainer, changeData, changeMode, filmsModel, filterModel) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._filmBriefComponent = null;
    this._filmDetailedComponent = null;
    this._mode = Mode.BRIEF;

    this._handleToDetailedClick = this._handleToDetailedClick.bind(this);
    this._handleToBriefClick = this._handleToBriefClick.bind(this);
    this._handleAddToWatchlist = this._handleAddToWatchlist.bind(this);
    this._handleAddToWatched = this._handleAddToWatched.bind(this);
    this._handleAddToFavorite = this._handleAddToFavorite.bind(this);
    this._handleCommentAdd = this._handleCommentAdd.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._ctrlEnterKeyDownHandler = this._ctrlEnterKeyDownHandler.bind(this);
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
    this._filmDetailedComponent.setToWatchlistCheckHandler(this._handleAddToWatchlist);
    this._filmDetailedComponent.setToWatchedCheckHandler(this._handleAddToWatched);
    this._filmDetailedComponent.setToFavoriteCheckHandler(this._handleAddToFavorite);
    this._filmDetailedComponent.setСommentDeleteHandler(this._handleCommentDelete);

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

  _defineUpdateType(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return UpdateType.MINOR;
    }

    return UpdateType.PATCH;
  }

  _invertFilmState(stateName) {
    let invertedState = {};

    switch(stateName) {
      case FilmState.WATCHLIST:
        invertedState = {isInWatchlist: !this._film.isInWatchlist};
        break;
      case FilmState.HISTORY:
        invertedState = {isWatched: !this._film.isWatched};
        break;
      case FilmState.FAVORITE:
        invertedState = {isFavorite: !this._film.isFavorite};
        break;
    }

    return new Map([
      [
        Object.assign(
          {},
          this._film,
          invertedState,
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

    this._filmDetailedComponent.updateState({
      newCommentText: null,
      newCommentEmotion: null,
    });

    operateWithChildElement(document.body, this._filmDetailedComponent, 'remove');
  }

  _handleToDetailedClick() {
    this._openDetailedCard();
    document.addEventListener('keydown', this._ctrlEnterKeyDownHandler);
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  }

  _handleToBriefClick() {
    this._closeDetailedCard();
    document.removeEventListener('keydown', this._ctrlEnterKeyDownHandler);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.remove('hide-overflow');
  }

  _handleAddToWatchlist() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._defineUpdateType(FilterType.WATCHLIST),
      this._invertFilmState(FilmState.WATCHLIST),
    );
  }

  _handleAddToWatched() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._defineUpdateType(FilterType.HISTORY),
      this._invertFilmState(FilmState.HISTORY),
    );
  }

  _handleAddToFavorite() {
    this._changeData(
      UserAction.UPDATE_FILM,
      this._defineUpdateType(FilterType.FAVORITES),
      this._invertFilmState(FilmState.FAVORITE),
    );
  }

  _handleCommentAdd(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UserAction.PATCH,
      film,
    );

    this._filmDetailedComponent.updateState({
      comments: film.values().next().value,
      newCommentText: null,
      newCommentEmotion: null,
    });

    this._film = film.keys().next().value;
    this._comments = film.values().next().value;

    this.init(this._film, this._comments);
  }

  _handleCommentDelete(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UserAction.PATCH,
      film,
    );

    this._filmDetailedComponent.updateState({
      comments: film.values().next().value,
    });

    this._film = film.keys().next().value;
    this._comments = film.values().next().value;

    this.init(this._film, this._comments);
  }

  _ctrlEnterKeyDownHandler(evt) {
    if (evt.ctrlKey && (evt.keyCode === KeyCode.ENTER)) {
      evt.preventDefault();
      this._filmDetailedComponent.initСommentAddHandler(this._handleCommentAdd);
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === KeyCode.ESCAPE) {
      evt.preventDefault();
      this._closeDetailedCard();
      document.removeEventListener('keydown', this._ctrlEnterKeyDownHandler);
      document.removeEventListener('keydown', this._escKeyDownHandler);
      document.body.classList.remove('hide-overflow');
    }
  }
}
