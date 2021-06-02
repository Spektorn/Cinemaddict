import ProfileView from '../view/profile.js';

import {FilterType} from '../utilities/constants.js';
import {getUserRank} from '../utilities/common.js';
import {renderElement, replaceElement, removeComponent} from '../utilities/render.js';
import {filterMap} from '../utilities/filter.js';

export default class Profile {
  constructor(profileContainer, filmsModel) {
    this._profileContainer = profileContainer;
    this._filmsModel = filmsModel;

    this._userRank = null;

    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevProfileComponent = this._profileComponent;

    const films = this._filmsModel.getFilms();
    const watchedFilmsQuantity = filterMap[FilterType.HISTORY](films).length;
    this._userRank = getUserRank(watchedFilmsQuantity);

    this._profileComponent = new ProfileView(this._userRank);

    if (prevProfileComponent === null) {
      renderElement(this._profileContainer, this._profileComponent, 'beforeend');
      return;
    }

    replaceElement(this._profileComponent, prevProfileComponent);
    removeComponent(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
