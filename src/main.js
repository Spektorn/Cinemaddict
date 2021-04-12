import {createProfileTemplate} from './view/profile.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createCardTemplate} from './view/card.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {createPopupTemplate} from './view/popup.js';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createNavigationTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteMainElement, createListTemplate(), 'beforeend');
render(siteFooterElement, createPopupTemplate(), 'afterend');
render(footerStatisticsElement, createStatisticsTemplate(), 'beforeend');

const mainFilmsListElement = siteMainElement.querySelector('.films-list');
const mainFilmsListContainerElement = mainFilmsListElement.querySelector('.films-list__container');
const extraFilmsListContainerElements = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

render(mainFilmsListElement, createShowMoreButtonTemplate(), 'beforeend');

for (let i = 0; i < FILM_COUNT; i++) {
  render(mainFilmsListContainerElement, createCardTemplate(), 'beforeend');
}

extraFilmsListContainerElements.forEach((element) => {
  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(element, createCardTemplate(), 'beforeend');
  }
});
