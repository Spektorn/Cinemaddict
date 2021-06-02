import FilmView from '../view/card.js';
import DetailedFilmView from '../view/detailed-card.js';

import {KeyCode, FilmState, FilterType, UserAction, UpdateType} from '../utilities/constants.js';
import {renderElement, replaceElement, operateWithChildElement, removeComponent} from '../utilities/render.js';

const Mode = {
  BRIEF: 'BRIEF',
  DETAILED: 'DETAILED',
};

const State = {
  DISABLED: 'DISABLED',
  DELETING: 'DELETING',
  ERROR: 'ERROR',
};

export default class Film {
  constructor(filmsListContainer, changeData, changeMode, filmsModel, commentsModel, filterModel, api) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;

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

  init(film) {
    this._film = film;

    const prevFilmBriefComponent = this._filmBriefComponent;

    this._filmBriefComponent = new FilmView(this._film);

    this._filmBriefComponent.setToDetailedClickHandler(this._handleToDetailedClick);
    this._filmBriefComponent.setToWatchlistClickHandler(this._handleAddToWatchlist);
    this._filmBriefComponent.setToWatchedClickHandler(this._handleAddToWatched);
    this._filmBriefComponent.setToFavoriteClickHandler(this._handleAddToFavorite);

    if (prevFilmBriefComponent === null) {
      renderElement(this._filmsListContainer, this._filmBriefComponent, 'beforeend');
      return;
    }

    replaceElement(this._filmBriefComponent, prevFilmBriefComponent);
    removeComponent(prevFilmBriefComponent);
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

    return Object.assign(
      {},
      this._film,
      invertedState,
    );
  }

  _renderDetailedFilm() {
    const prevFilmDetailedComponent = this._filmDetailedComponent;

    this._api.getComments(this._film.id).then((comments) => {
      this._commentsModel.setComments(comments);
      this._detailedComments = this._commentsModel.getComments();

      this._filmDetailedComponent = new DetailedFilmView(this._film, this._detailedComments);

      this._filmDetailedComponent.setToBriefClickHandler(this._handleToBriefClick);
      this._filmDetailedComponent.setToWatchlistCheckHandler(this._handleAddToWatchlist);
      this._filmDetailedComponent.setToWatchedCheckHandler(this._handleAddToWatched);
      this._filmDetailedComponent.setToFavoriteCheckHandler(this._handleAddToFavorite);
      this._filmDetailedComponent.setСommentDeleteHandler(this._handleCommentDelete);

      if (prevFilmDetailedComponent) {
        removeComponent(prevFilmDetailedComponent);
      }

      operateWithChildElement(document.body, this._filmDetailedComponent, 'append');
    });
  }

  _setViewState(state, commentID = null) {
    switch (state) {
      case State.DISABLED:
        this._filmDetailedComponent.updateState({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._filmDetailedComponent.updateState({
          deletingCommentID: commentID,
        });
        break;
      case State.ERROR:
        this._filmDetailedComponent.updateState({
          isDisabled: false,
        });
        this._filmDetailedComponent.setShakeAnimation();
        break;
    }
  }

  _openDetailedCard() {
    this._changeMode();

    this._mode = Mode.DETAILED;
    this._renderDetailedFilm();
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
    this._setViewState(State.DISABLED);

    this._api.addComment(
      film.id,
      film.newComment,
    )
      .then((response) => {
        this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.COMMENT,
          response.comments,
        );

        this._filmDetailedComponent.updateState({
          comments: this._commentsModel.getCommentsIDs(),
          detailedComments: this._commentsModel.getComments(),
          newCommentText: null,
          newCommentEmotion: null,
          isDisabled: false,
        });

        this._film.comments = this._commentsModel.getCommentsIDs();

        this.init(this._film);
      })
      .catch(() => {
        this._setViewState(State.ERROR);
      });
  }

  _handleCommentDelete(commentID) {
    this._setViewState(State.DELETING, commentID);

    this._api.deleteComment(commentID)
      .then(() => {
        this._changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.COMMENT,
          commentID,
        );

        this._filmDetailedComponent.updateState({
          comments: this._commentsModel.getCommentsIDs(),
          detailedComments: this._commentsModel.getComments(),
          deletingCommentID: null,
        });

        this._film.comments = this._commentsModel.getCommentsIDs();
        this.init(this._film);
      })
      .catch(() => {
        this._setViewState(State.ERROR);
      });
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

  destroyInstance() {
    removeComponent(this._filmBriefComponent);
    removeComponent(this._filmDetailedComponent);
  }

  resetView() {
    if (this._mode !== Mode.BRIEF) {
      this._closeDetailedCard();
    }
  }
}
