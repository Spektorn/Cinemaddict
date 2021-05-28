import FilmsListPresenter from './presenter/films-list.js';

import ProfileView from './view/profile.js';
import StatisticsView from './view/statistics.js';

import {renderElement} from './utilities/render.js';

import {generateFilmsCollection} from './mock/film.js';
import {generateFilters} from './mock/filter.js';

const FILM_QUANTITY = 20;

//* Генерация mock-данных
const filmsCollection = generateFilmsCollection(FILM_QUANTITY);
const filters = generateFilters(Array.from(filmsCollection.keys()));

//* Отрисовка
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new ProfileView(filters.History), 'beforeend');
renderElement(footerStatisticsElement, new StatisticsView(filters.All), 'beforeend');

const filmsListPresenter = new FilmsListPresenter(siteMainElement);

filmsListPresenter.init(filmsCollection, filters);
