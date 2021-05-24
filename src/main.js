import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import SortView from './view/sort.js';
import ListView from './view/list.js';
import EmptyListView from './view/empty-list.js';
import StatisticsView from './view/statistics.js';
import ShowMoreButtonView from './view/show-more-button.js';
import CardView from './view/card.js';
import DetailedCardView from './view/detailed-card.js';

import {getSlicedDataFromMap} from './utilities/common.js';
import {renderElement} from './utilities/render.js';

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

  cardComponent.setToDetailedClickHandler(() => {
    replaceBriefToDetailed();
    document.addEventListener('keydown', onEscKeyDown);
    document.body.classList.add('hide-overflow');
  });

  detailedCardComponent.setToBriefClickHandler(() => {
    replaceDetailedToBrief();
    document.removeEventListener('keydown', onEscKeyDown);
    document.body.classList.remove('hide-overflow');
  });

  renderElement(listElement, cardComponent, 'beforeend');
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

renderElement(siteHeaderElement, new ProfileView(filterData.History), 'beforeend');
renderElement(siteMainElement, new NavigationView(filterData), 'beforeend');
renderElement(siteMainElement, new SortView(), 'beforeend');
renderElement(footerStatisticsElement, new StatisticsView(filterData.All), 'beforeend');

const filmsListComponent = filmsData.size ? new ListView() : new EmptyListView();

renderElement(siteMainElement, filmsListComponent, 'beforeend');

if(filmsListComponent instanceof ListView) {
  const mainFilmsListElement = filmsListComponent.getElement().querySelector('.films-list');
  const mainFilmsListContainerElement = filmsListComponent.getElement().querySelector('.films-list__container');
  const extraFilmsListContainerElements = filmsListComponent.getElement().querySelectorAll('.films-list--extra .films-list__container');

  for (const [key, value] of getSlicedDataFromMap(filmsData, 0, FILM_QUANTITY_PER_STEP).entries()) {
    renderFilm(mainFilmsListContainerElement, key, value);
  }

  extraFilmsListContainerElements.forEach((parentElement) => {
    for (const [key, value] of extraFilmsData.entries()) {
      renderFilm(parentElement, key, value);
    }
  });

  if (filmsData.size > FILM_QUANTITY_PER_STEP) {
    const showMoreButtonComponent = new ShowMoreButtonView();
    let renderedFilmCount = FILM_QUANTITY_PER_STEP;

    renderElement(mainFilmsListElement, showMoreButtonComponent, 'beforeend');

    showMoreButtonComponent.setClickHandler(() => {
      for (const [key, value] of getSlicedDataFromMap(filmsData, renderedFilmCount, renderedFilmCount + FILM_QUANTITY_PER_STEP).entries()) {
        renderFilm(mainFilmsListContainerElement, key, value);
      }

      renderedFilmCount += FILM_QUANTITY_PER_STEP;

      if (renderedFilmCount >= filmsData.size) {
        showMoreButtonComponent.getElement().remove();
      }
    });
  }
}
