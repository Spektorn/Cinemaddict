import FilmsModel from './model/films.js';

import FilmsListPresenter from './presenter/films-list.js';

import ProfileView from './view/profile.js';
import StatisticsView from './view/statistics.js';

import {renderElement} from './utilities/render.js';

import {generateFilmsCollection} from './mock/film.js';
import {generateFilter} from './mock/filter.js';

const FILM_QUANTITY = 20;

//* Генерация mock-данных
const filmsCollection = generateFilmsCollection(FILM_QUANTITY);
const filter = generateFilter(Array.from(filmsCollection.keys()));

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCollection);

//* Отрисовка
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new ProfileView(filter.History), 'beforeend');
renderElement(footerStatisticsElement, new StatisticsView(filter.All), 'beforeend');

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel);

filmsListPresenter.init(filter);
