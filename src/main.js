import {createProfileTemplate} from './view/profile.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCardTemplate} from './view/card.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createDetailedCardTemplate} from './view/detailed-card.js';

import {generateFilmsData} from './mock/film.js';
import {generateFilterData} from './mock/filter.js';

const FILM_QUANTITY = 20;
const EXTRA_FILM_QUANTITY = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const countFilmsProperties = (currentFilm) => {
  propertiesQuantity[currentFilm] += 1;
}

//* Генерация mock-данных
const filmsData = generateFilmsData(FILM_QUANTITY);
const filterData = generateFilterData(Array.from(filmsData.keys()));

console.log(filmsData);
console.log(filterData);

//* Отрисовка
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createListTemplate(), 'beforeend');
render(footerStatisticsElement, createStatisticsTemplate(filmsData.size), 'beforeend');

const mainFilmsListElement = siteMainElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');
const extraFilmsListContainerElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

render(mainFilmsListElement, createShowMoreButtonTemplate(), 'beforeend');


for (const [key, value] of filmsData.entries()) {
  render(mainFilmsListContainerElement, createCardTemplate(key, value), 'beforeend');
}

//render(siteFooterElement, createDetailedCardTemplate(...data[0].entries().next().value), 'afterend');




/*
extraFilmsListContainerElements.forEach((element) => {
  for (let i = 0; i < EXTRA_FILM_QUANTITY; i++) {
    render(element, createCardTemplate(), 'beforeend');
  }
});
*/
