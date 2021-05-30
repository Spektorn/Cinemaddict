import FilmsListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';

import FilmPresenter from './film.js';

import {SortType, UpdateType, UserAction} from '../constants.js';
import {getSlicedDataFromMap} from '../utilities/common.js';
import {renderElement, removeComponent} from '../utilities/render.js';
import {filterMap} from '../utilities/filter.js';
import {sortFilmsByReleaseDate, sortFilmsByRating} from '../utilities/sort.js';

export const FILMS_QUANTITY_PER_STEP = 5;

export default class FilmsList {
  constructor(generalContainer, filmsModel, filterModel) {
    this._generalContainer = generalContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmsPresenters = {};

    this._filmsListComponent = new FilmsListView();
    this._emptyListComponent = new EmptyListView();
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._mainListElement = this._filmsListComponent.getElement().querySelector('.films-list');
    this._mainListContainerElement = this._mainListElement.querySelector('.films-list__container');

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsList();
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
        this._filmsPresenters[data.keys().next().value.id].init(
          data.keys().next().value,
          data.values().next().value,
        );
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmsQuantity: true, resetSortType: true});
        this._renderFilmsList();
        break;
    }
  }

  _handleModeChange() {
    Object.values(this._filmsPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsList({resetRenderedFilmsQuantity: true});
    this._renderFilmsList();
  }

  _handleShowMoreButtonClick() {
    const filmsQuantity = this._getFilms().size;
    const newRenderedFilmsQuantity = Math.min(filmsQuantity, this._renderedFilmsQuantity + FILMS_QUANTITY_PER_STEP);
    const currentFilms = getSlicedDataFromMap(this._getFilms(), this._renderedFilmsQuantity, newRenderedFilmsQuantity);

    this._renderFilms(currentFilms, this._mainListContainerElement);
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

    renderElement(this._mainListElement, this._showMoreButtonComponent, 'beforeend');
  }

  _renderFilm(film, comments, container) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._filmsModel, this._filterModel);

    filmPresenter.init(film, comments);
    this._filmsPresenters[film.id] = filmPresenter;
  }

  _renderFilms(currentFilms, container) {
    for (const [film, comments] of currentFilms.entries()) {
      this._renderFilm(film, comments, container);
    }
  }

  _renderListContent() {
    renderElement(this._generalContainer, this._filmsListComponent, 'beforeend');

    const filmsQuantity = this._getFilms().size;
    const currentFilms = getSlicedDataFromMap(this._getFilms(), 0, Math.min(filmsQuantity, this._renderedFilmsQuantity));

    this._renderFilms(currentFilms, this._mainListContainerElement);

    if (filmsQuantity > this._renderedFilmsQuantity) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsList() {
    const films = this._getFilms();
    const filmsQuantity = films.size;

    if (!filmsQuantity) {
      this._renderEmptyList();
      return;
    }

    this._renderSort();
    this._renderListContent();
  }

  _clearFilmsList({resetRenderedFilmsQuantity = false, resetSortType = false} = {}) {
    const filmsQuantity = this._getFilms().size;

    Object.values(this._filmsPresenters).forEach((presenter) => presenter.destroyInstance());
    this._filmsPresenters = {};

    removeComponent(this._emptyListComponent);
    removeComponent(this._sortComponent);
    removeComponent(this._showMoreButtonComponent);

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
