import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import ListView from './view/list.js';
import EmptyListView from './view/empty-list.js';
import StatisticsView from './view/statistics.js';
import ShowMoreButtonView from './view/show-more-button.js';
import CardView from './view/card.js';
import DetailedCardView from './view/detailed-card.js';

import {getSlicedDataFromMap, renderElement} from './utilities.js';

import {generateFilmsData} from './mock/film.js';
import {generateFilterData} from './mock/filter.js';

const FILM_QUANTITY = 20;
const EXTRA_FILM_QUANTITY = 2;
const FILM_QUANTITY_PER_STEP = 5;

const renderFilm = (listElement, film, comments) => {
  const cardComponent = new CardView(film, comments);
  const detailedCardComponent = new DetailedCardView(film, comments);

  const replaceBriefToDetailed = () => {
    listElement.removeChild(cardComponent.getElement());
    document.body.appendChild(detailedCardComponent.getElement());
  };

  const replaceDetailedToBrief = () => {
    listElement.appendChild(cardComponent.getElement());
    document.body.removeChild(detailedCardComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceDetailedToBrief();
      document.removeEventListener('keydown', onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }
  };

  const onOpenClick = (evt) => {
    evt.preventDefault();
    replaceBriefToDetailed();
    document.addEventListener('keydown', onEscKeyDown);
    document.body.classList.add('hide-overflow');
  };

  const onCloseClick = (evt) => {
    evt.preventDefault();
    replaceDetailedToBrief();
    document.removeEventListener('keydown', onEscKeyDown);
    document.body.classList.remove('hide-overflow');
  };

  cardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', onOpenClick);
  cardComponent.getElement().querySelector('.film-card__title').addEventListener('click', onOpenClick);
  cardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', onOpenClick);

  detailedCardComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', onCloseClick);

  renderElement(listElement, cardComponent.getElement(), 'beforeend');
};

//* Генерация mock-данных
const filmsData = generateFilmsData(FILM_QUANTITY);
const extraFilmsData = generateFilmsData(EXTRA_FILM_QUANTITY);
const filterData = generateFilterData(Array.from(filmsData.keys()));

//* Отрисовка
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new ProfileView(filterData.History).getElement(), 'beforeend');
renderElement(siteMainElement, new NavigationView(filterData).getElement(), 'beforeend');
renderElement(siteMainElement, new SortView().getElement(), 'beforeend');
renderElement(footerStatisticsElement, new StatisticsView(filterData.All).getElement(), 'beforeend');

if(filmsData.size === 0) {
  renderElement(siteMainElement, new EmptyListView().getElement(), 'beforeend');
} else {
  renderElement(siteMainElement, new ListView().getElement(), 'beforeend');

  const mainFilmsListElement = siteMainElement.querySelector('.films-list');
  const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');
  const extraFilmsListContainerElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

  for (const [key, value] of getSlicedDataFromMap(filmsData, 0, FILM_QUANTITY_PER_STEP).entries()) {
    renderFilm(mainFilmsListContainerElement, key, value);
  }

  extraFilmsListContainerElements.forEach((parentElement) => {
    for (const [key, value] of extraFilmsData.entries()) {
      renderFilm(parentElement, key, value);
    }
  });

  if (filmsData.size > FILM_QUANTITY_PER_STEP) {
    let renderedFilmCount = FILM_QUANTITY_PER_STEP;

    renderElement(mainFilmsListElement, new ShowMoreButtonView().getElement(), 'beforeend');

    const loadMoreButton = mainFilmsListElement.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      for (const [key, value] of getSlicedDataFromMap(filmsData, renderedFilmCount, renderedFilmCount + FILM_QUANTITY_PER_STEP).entries()) {
        renderFilm(mainFilmsListContainerElement, key, value);
      }

      renderedFilmCount += FILM_QUANTITY_PER_STEP;

      if (renderedFilmCount >= filmsData.size) {
        loadMoreButton.remove();
      }
    });
  }
}
