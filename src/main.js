import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

import FilmsListPresenter from './presenter/films-list.js';
import FilterPresenter from './presenter/filter.js';

import ProfileView from './view/profile.js';
import StatisticsView from './view/statistics.js';

import {renderElement} from './utilities/render.js';

import {generateFilmsCollection} from './mock/film.js';

const FILM_QUANTITY = 20;

//* Генерация mock-данных
const filmsCollection = generateFilmsCollection(FILM_QUANTITY);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

filmsModel.setFilms(filmsCollection);

//* Отрисовка
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderElement(siteHeaderElement, new ProfileView(11), 'beforeend');
renderElement(footerStatisticsElement, new StatisticsView(filmsCollection.size), 'beforeend');

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
filterPresenter.init();

const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, filterModel);
filmsListPresenter.init();
