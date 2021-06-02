import BoardView from '../view/board.js';
import StatisticsView from '../view/statistics.js';
import ListView from '../view/list';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';

import FilmPresenter from './film.js';

import {FilterType, SortType, ListType, UserAction, UpdateType} from '../utilities/constants.js';
import {renderElement, removeComponent, showComponent, hideComponent} from '../utilities/render.js';
import {filterMap} from '../utilities/filter.js';
import {sortFilmsByReleaseDate, sortFilmsByRating, sortFilmsByComments} from '../utilities/sort.js';

export const FILMS_QUANTITY_PER_STEP = 5;
export const EXTRA_FILMS_QUANTITY = 2;

export default class FilmsBoard {
  constructor(generalContainer, filmsModel, commentsModel, filterModel, api) {
    this._generalContainer = generalContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._filmPresenters = {};
    this._filmPresentersTopRated = {};
    this._filmPresentersMostCommented = {};

    this._boardComponent = new BoardView();
    this._mainListComponent = new ListView(ListType.ALL);
    this._emptyListComponent = new ListView(ListType.EMPTY);
    this._loadingListComponent = new ListView(ListType.LOADING);
    this._statisticsComponent = null;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._mainListContainerElement = this._mainListComponent.getElement().querySelector('.films-list__container');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsBoard();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const currentFilterType = this._filterModel.getFilter() !== FilterType.STATISTICS ? this._filterModel.getFilter() : FilterType.ALL;
    const filtredFilms = filterMap[currentFilterType](films);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredFilms.slice().sort(sortFilmsByReleaseDate);
      case SortType.BY_RATING:
        return filtredFilms.slice().sort(sortFilmsByRating);
      case SortType.DEFAULT: {
        return filtredFilms;
      }
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (data.id in this._filmPresenters) {
          this._filmPresenters[data.id].init(data);
        }

        if (data.id in this._filmPresentersTopRated) {
          this._filmPresentersTopRated[data.id].init(data);
        }

        if (data.id in this._filmPresentersMostCommented) {
          this._filmPresentersMostCommented[data.id].init(data);
        }

        break;
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        if (data === FilterType.STATISTICS) {
          this._clearFilmsBoard({resetRenderedFilmsQuantity: true, resetSortType: true});
          hideComponent(this._boardComponent);
          this._renderStatistics();
          break;
        }

        if (this._statisticsComponent) {
          removeComponent(this._statisticsComponent);
        }

        showComponent(this._boardComponent);
        this._clearFilmsBoard({resetRenderedFilmsQuantity: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;

        removeComponent(this._loadingListComponent);

        this._renderFilmsBoard();
        break;
    }
  }

  _resetPresenters(presentersContainer) {
    Object.values(presentersContainer).forEach((presenter) => presenter.resetView());
  }

  _handleModeChange() {
    this._resetPresenters(this._filmPresenters);
    this._resetPresenters(this._filmPresentersTopRated);
    this._resetPresenters(this._filmPresentersMostCommented);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsBoard({resetRenderedFilmsQuantity: true});
    this._renderFilmsBoard();
  }

  _handleShowMoreButtonClick() {
    const filmsQuantity = this._getFilms().length;
    const newRenderedFilmsQuantity = Math.min(filmsQuantity, this._renderedFilmsQuantity + FILMS_QUANTITY_PER_STEP);
    const currentFilms = this._getFilms().slice(this._renderedFilmsQuantity, newRenderedFilmsQuantity);

    this._renderFilms(currentFilms, this._mainListContainerElement, this._filmPresenters);
    this._renderedFilmsQuantity = newRenderedFilmsQuantity;

    if (this._renderedFilmsQuantity >= filmsQuantity) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _renderStatistics() {
    if (this._statisticsComponent !== null) {
      this._statisticsComponent = null;
    }

    const films = this._filmsModel.getFilms();
    const watchedFilms = filterMap[FilterType.HISTORY](films);

    this._statisticsComponent = new StatisticsView(watchedFilms);

    renderElement(this._generalContainer, this._statisticsComponent, 'beforeend');
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    renderElement(this._generalContainer, this._sortComponent, 'beforeend');
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    renderElement(this._mainListComponent, this._showMoreButtonComponent, 'beforeend');
  }

  _renderFilm(film, container, presentersContainer) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._filmsModel, this._commentsModel, this._filterModel, this._api);

    filmPresenter.init(film);
    presentersContainer[film.id] = filmPresenter;
  }

  _renderFilms(currentFilms, container, presentersContainer) {
    for (const film of currentFilms) {
      this._renderFilm(film, container, presentersContainer);
    }
  }

  _renderEmptyList() {
    renderElement(this._boardComponent, this._emptyListComponent, 'beforeend');
  }

  _renderLoadingList() {
    renderElement(this._boardComponent, this._loadingListComponent, 'beforeend');
  }

  _renderMainList() {
    const filmsQuantity = this._getFilms().length;
    const currentFilms = this._getFilms().slice(0, Math.min(filmsQuantity, this._renderedFilmsQuantity));

    this._renderFilms(currentFilms, this._mainListContainerElement, this._filmPresenters);
    renderElement(this._boardComponent, this._mainListComponent, 'beforeend');

    if (filmsQuantity > this._renderedFilmsQuantity) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedList() {
    if (this._topRatedListComponent !== null) {
      this._topRatedListComponent = null;
    }

    this._topRatedListComponent = new ListView(ListType.TOP_RATED);
    this._topRatedListContainerElement = this._topRatedListComponent.getElement().querySelector('.films-list__container');

    const currentFilms = this._getFilms().slice().sort(sortFilmsByRating).slice(0, EXTRA_FILMS_QUANTITY);

    this._renderFilms(currentFilms, this._topRatedListContainerElement, this._filmPresentersTopRated);
    renderElement(this._boardComponent, this._topRatedListComponent, 'beforeend');
  }

  _renderMostCommentedList() {
    if (this._mostCommentedListComponent !== null) {
      this._mostCommentedListComponent = null;
    }

    this._mostCommentedListComponent = new ListView(ListType.MOST_COMMENTED);
    this._mostCommentedListContainerElement = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');

    const currentFilms = this._getFilms().slice().sort(sortFilmsByComments).slice(0, EXTRA_FILMS_QUANTITY);

    this._renderFilms(currentFilms, this._mostCommentedListContainerElement, this._filmPresentersMostCommented);
    renderElement(this._boardComponent, this._mostCommentedListComponent, 'beforeend');
  }

  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoadingList();
    } else {
      const films = this._getFilms();
      const filmsQuantity = films.length;

      if (filmsQuantity === 0) {
        this._renderEmptyList();
      } else {
        this._renderSort();
        this._renderMainList();
        this._renderTopRatedList();
        this._renderMostCommentedList();
      }
    }

    renderElement(this._generalContainer, this._boardComponent, 'beforeend');
  }

  _deletePresenters(presentersContainer) {
    Object.values(presentersContainer).forEach((presenter) => presenter.destroyInstance());
    presentersContainer = {};
  }

  _clearFilmsBoard({resetRenderedFilmsQuantity = false, resetSortType = false} = {}) {
    const filmsQuantity = this._getFilms().length;

    this._deletePresenters(this._filmPresenters);
    this._deletePresenters(this._filmPresentersTopRated);
    this._deletePresenters(this._filmPresentersMostCommented);

    removeComponent(this._sortComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._emptyListComponent);
    removeComponent(this._topRatedListComponent);
    removeComponent(this._mostCommentedListComponent);

    if (resetRenderedFilmsQuantity) {
      this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
    } else {
      this._renderedFilmsQuantity = Math.min(filmsQuantity, this._renderedFilmsQuantity);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
