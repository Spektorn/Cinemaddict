import Api from './api.js';

import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';

import ProfilePresenter from './presenter/profile.js';
import FilmsBoardPresenter from './presenter/films-board.js';
import FilterPresenter from './presenter/filter.js';

import FooterStatisticsView from './view/footer-statistics.js';

import {UpdateType} from './utilities/constants.js';
import {renderElement} from './utilities/render.js';

const AUTHORIZATION = 'Basic leviathan66';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const footerStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsBoardPresenter = new FilmsBoardPresenter(siteMainElement, filmsModel, commentsModel, filterModel, api);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    profilePresenter.init();
    filterPresenter.init();
    renderElement(footerStatisticsElement, new FooterStatisticsView(filmsModel.getFilms().length), 'beforeend');
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

filmsBoardPresenter.init();
