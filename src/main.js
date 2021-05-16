import {createProfileTemplate} from './view/profile.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCardTemplate} from './view/card.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createDetailedCardTemplate} from './view/detailed-card.js';

import {getSlicedDataFromMap} from './utilities.js';
import {generateFilmsData} from './mock/film.js';
import {generateFilterData} from './mock/filter.js';

const FILM_QUANTITY = 20;
const EXTRA_FILM_QUANTITY = 2;
const FILM_QUANTITY_PER_STEP = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
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

render(siteHeaderElement, createProfileTemplate(filterData.History), 'beforeend');
render(siteMainElement, createNavigationTemplate(filterData), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createListTemplate(), 'beforeend');
render(footerStatisticsElement, createStatisticsTemplate(filterData.All), 'beforeend');

const mainFilmsListElement = siteMainElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');
const extraFilmsListContainerElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const [key, value] of getSlicedDataFromMap(filmsData, 0, FILM_QUANTITY_PER_STEP).entries()) {
  render(mainFilmsListContainerElement, createCardTemplate(key, value), 'beforeend');
}

extraFilmsListContainerElements.forEach((element) => {
  for (const [key, value] of extraFilmsData.entries()) {
    render(element, createCardTemplate(key, value), 'beforeend');
  }
});

render(siteFooterElement, createDetailedCardTemplate(...filmsData.entries().next().value), 'afterend');

if (filmsData.size > FILM_QUANTITY_PER_STEP) {
  let renderedFilmCount = FILM_QUANTITY_PER_STEP;

  render(mainFilmsListElement, createShowMoreButtonTemplate(), 'beforeend');

  const loadMoreButton = mainFilmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    for (const [key, value] of getSlicedDataFromMap(filmsData, renderedFilmCount, renderedFilmCount + FILM_QUANTITY_PER_STEP).entries()) {
      render(mainFilmsListContainerElement, createCardTemplate(key, value), 'beforeend');
    }

    renderedFilmCount += FILM_QUANTITY_PER_STEP;

    if (renderedFilmCount >= filmsData.size) {
      loadMoreButton.remove();
    }
  });
}
