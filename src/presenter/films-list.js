import FilmsListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import NavigationView from '../view/navigation.js';
import SortView from '../view/sort.js';
import ShowMoreButtonView from '../view/show-more-button.js';

import FilmPresenter from './film.js';

import {SortType} from '../constants.js';
import {getSlicedDataFromMap, updateCollection} from '../utilities/common.js';
import {renderElement, removeComponent} from '../utilities/render.js';
import {sortFilmsByReleaseDate, sortFilmsByRating} from '../utilities/sort.js';

export const FILMS_QUANTITY_PER_STEP = 5;

export default class FilmsList {
  constructor(generalContainer) {
    this._generalContainer = generalContainer;

    this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._filmsPresenters = {};

    this._filmsListComponent = new FilmsListView();
    this._emptyListComponent = new EmptyListView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._mainListElement = this._filmsListComponent.getElement().querySelector('.films-list');
    this._mainListContainerElement = this._mainListElement.querySelector('.films-list__container');

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
  }

  init(filmsCollection, filters) {
    this._filmsCollection = new Map(filmsCollection);
    this._sourcedfilmsCollection = new Map(filmsCollection);
    this._filters = Object.assign({}, filters);

    this._navigationComponent = new NavigationView(this._filters);

    this._renderFilmsList();
  }

  _handleFilmChange(updatedFilmCollection) {
    this._filmsCollection = updateCollection(this._filmsCollection, updatedFilmCollection);
    this._sourcedfilmsCollection = updateCollection(this._sourcedfilmsCollection, updatedFilmCollection);
    this._filmsPresenters[updatedFilmCollection.keys().next().value.id].init(
      updatedFilmCollection.keys().next().value,
      updatedFilmCollection.values().next().value,
    );
  }

  _handleModeChange() {
    Object.values(this._filmsPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilmsList(sortType);
    this._clearFilmsList();
    this._renderFilmsList();
  }

  _showMoreButtonClickHandler() {
    this._renderFilms(this._renderedFilmsQuantity, this._renderedFilmsQuantity + FILMS_QUANTITY_PER_STEP, this._mainListContainerElement);
    this._renderedFilmsQuantity += FILMS_QUANTITY_PER_STEP;

    if (this._renderedFilmsQuantity >= this._filmsCollection.size) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _sortFilmsList(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._filmsCollection = Array.from(this._filmsCollection.keys()).sort(sortFilmsByReleaseDate).reduce(
          (sortedMap, key) => sortedMap.set(key, this._filmsCollection.get(key)), new Map);
        break;
      case SortType.BY_RATING:
        this._filmsCollection = Array.from(this._filmsCollection.keys()).sort(sortFilmsByRating).reduce(
          (sortedMap, key) => sortedMap.set(key, this._filmsCollection.get(key)), new Map);
        break;
      default:
        this._filmsCollection = new Map(this._sourcedfilmsCollection);
    }

    this._currentSortType = sortType;
  }

  _clearFilmsList() {
    Object.values(this._filmsPresenters).forEach((presenter) => presenter.destroyInstance());
    removeComponent(this._showMoreButtonComponent);

    this._filmsPresenters = {};
    this._renderedFilmsQuantity = FILMS_QUANTITY_PER_STEP;
  }

  _renderEmptyList() {
    renderElement(this._generalContainer, this._emptyListComponent, 'beforeend');
  }

  _renderNavigation() {
    renderElement(this._generalContainer, this._navigationComponent, 'beforeend');
  }

  _renderSort() {
    renderElement(this._generalContainer, this._sortComponent, 'beforeend');
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderShowMoreButton() {
    renderElement(this._mainListElement, this._showMoreButtonComponent, 'beforeend');
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _renderFilm(film, comments, container) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);

    filmPresenter.init(film, comments);
    this._filmsPresenters[film.id] = filmPresenter;
  }

  _renderFilms(from, to, container) {
    for (const [film, comments] of getSlicedDataFromMap(this._filmsCollection, from, to).entries()) {
      this._renderFilm(film, comments, container);
    }
  }

  _renderListContent() {
    renderElement(this._generalContainer, this._filmsListComponent, 'beforeend');

    this._renderFilms(0, Math.min(this._filmsCollection.size, FILMS_QUANTITY_PER_STEP), this._mainListContainerElement);

    if (this._filmsCollection.size > FILMS_QUANTITY_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsList() {
    if (!this._filmsCollection.size) {
      this._renderEmptyList();
      return;
    }

    this._renderNavigation();
    this._renderSort();
    this._renderListContent();
  }
}