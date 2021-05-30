import BoardView from '../view/board.js';
import ListView from '../view/list';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';

import FilmPresenter from './film.js';

import {SortType, ListType, UpdateType, UserAction} from '../constants.js';
import {getSlicedDataFromMap} from '../utilities/common.js';
import {renderElement, removeComponent} from '../utilities/render.js';
import {filterMap} from '../utilities/filter.js';
import {sortFilmsByReleaseDate, sortFilmsByRating} from '../utilities/sort.js';

export const FILMS_QUANTITY_PER_STEP = 5;
export const EXTRA_FILMS_QUANTITY = 2;

export default class FilmsBoard {
  constructor(generalContainer, filmsModel, filterModel) {
    this._generalContainer = generalContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmPresenters = {};
    this._filmPresentersTopRated = {};
    this._filmPresentersMostCommented = {};

    this._boardComponent = new BoardView();
    this._mainListComponent = new ListView(ListType.ALL);
    this._emptyListComponent = new ListView(ListType.EMPTY);
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
    const currentFilter = this._filterModel.getFilter();

    let filtredFilms = filterMap[currentFilter](Array.from(films.keys())).reduce(
      (filtredMap, key) => filtredMap.set(key, films.get(key)), new Map);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        filtredFilms = Array.from(filtredFilms.keys()).sort(sortFilmsByReleaseDate).reduce(
          (sortedMap, key) => sortedMap.set(key, filtredFilms.get(key)), new Map);
        break;
      case SortType.BY_RATING:
        filtredFilms = Array.from(filtredFilms.keys()).sort(sortFilmsByRating).reduce(
          (sortedMap, key) => sortedMap.set(key, filtredFilms.get(key)), new Map);
        break;
    }

    return filtredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenters[data.keys().next().value.id].init(
          data.keys().next().value,
          data.values().next().value,
        );

        if (data.keys().next().value.id in this._filmPresentersTopRated) {
          this._filmPresentersTopRated[data.keys().next().value.id].init(
            data.keys().next().value,
            data.values().next().value,
          );
        }

        if (data.keys().next().value.id in this._filmPresentersMostCommented) {
          this._filmPresentersMostCommented[data.keys().next().value.id].init(
            data.keys().next().value,
            data.values().next().value,
          );
        }

        break;
      case UpdateType.MINOR:
        this._clearFilmsBoard();
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsBoard({resetRenderedFilmsQuantity: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
    }
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
    const filmsQuantity = this._getFilms().size;
    const newRenderedFilmsQuantity = Math.min(filmsQuantity, this._renderedFilmsQuantity + FILMS_QUANTITY_PER_STEP);
    const currentFilms = getSlicedDataFromMap(this._getFilms(), this._renderedFilmsQuantity, newRenderedFilmsQuantity);

    this._renderFilms(currentFilms, this._mainListContainerElement, this._filmPresenters);
    this._renderedFilmsQuantity = newRenderedFilmsQuantity;

    if (this._renderedFilmsQuantity >= filmsQuantity) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _renderEmptyList() {
    renderElement(this._generalContainer, this._emptyListComponent, 'beforeend');
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

  _renderFilm(film, comments, container, presentersContainer) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._filmsModel, this._filterModel);

    filmPresenter.init(film, comments);
    presentersContainer[film.id] = filmPresenter;
  }

  _renderFilms(currentFilms, container, presentersContainer) {
    for (const [film, comments] of currentFilms.entries()) {
      this._renderFilm(film, comments, container, presentersContainer);
    }
  }

  _renderMainList() {
    const filmsQuantity = this._getFilms().size;
    const currentFilms = getSlicedDataFromMap(this._getFilms(), 0, Math.min(filmsQuantity, this._renderedFilmsQuantity));

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

    const currentFilms = getSlicedDataFromMap(
      Array.from(this._getFilms().keys()).sort(sortFilmsByRating).reduce(
        (sortedMap, key) => sortedMap.set(key, this._getFilms().get(key)), new Map),
      0,
      EXTRA_FILMS_QUANTITY,
    );

    this._renderFilms(currentFilms, this._topRatedListContainerElement, this._filmPresentersTopRated);
    renderElement(this._boardComponent, this._topRatedListComponent, 'beforeend');
  }

  _renderMostCommentedList() {
    if (this._mostCommentedListComponent !== null) {
      this._mostCommentedListComponent = null;
    }

    this._mostCommentedListComponent = new ListView(ListType.MOST_COMMENTED);
    this._mostCommentedListContainerElement = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');

    const currentFilms = getSlicedDataFromMap(
      Array.from(this._getFilms().keys()).sort(
        (filmA, filmB) => {
          return this._getFilms().get(filmB).length - this._getFilms().get(filmA).length;
        }).reduce(
        (sortedMap, key) => sortedMap.set(key, this._getFilms().get(key)), new Map),
      0,
      EXTRA_FILMS_QUANTITY,
    );

    this._renderFilms(currentFilms, this._mostCommentedListContainerElement, this._filmPresentersMostCommented);
    renderElement(this._boardComponent, this._mostCommentedListComponent, 'beforeend');
  }

  _renderFilmsBoard() {
    const films = this._getFilms();
    const filmsQuantity = films.size;

    if (!filmsQuantity) {
      this._renderEmptyList();
      return;
    }

    this._renderSort();
    this._renderMainList();
    this._renderTopRatedList();
    this._renderMostCommentedList();

    renderElement(this._generalContainer, this._boardComponent, 'beforeend');
  }

  _resetPresenters(presentersContainer) {
    Object.values(presentersContainer).forEach((presenter) => presenter.resetView());
  }

  _deletePresenters(presentersContainer) {
    Object.values(presentersContainer).forEach((presenter) => presenter.destroyInstance());
    presentersContainer = {};
  }

  _clearFilmsBoard({resetRenderedFilmsQuantity = false, resetSortType = false} = {}) {
    const filmsQuantity = this._getFilms().size;

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
