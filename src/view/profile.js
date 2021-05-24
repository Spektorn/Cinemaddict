import AbstractView from './abstract.js';

const rankToQuantityBarrier = {
  'Novice': 1,
  'Fan': 11,
  'Movie Buff': 21,
};

const renderRank = (watchedFilmsQuantity) => {
  if(!watchedFilmsQuantity) {
    return;
  }

  let currentRank;

  for (const [rankName, quantityBarrier] of Object.entries(rankToQuantityBarrier)) {
    if(watchedFilmsQuantity >= quantityBarrier) {
      currentRank = rankName;
    }
  }

  return `<p class="profile__rating">${currentRank}</p>`;
};

const createProfileTemplate = (watchedFilmsQuantity) => {
  return `<section class="header__profile profile">
            ${renderRank(watchedFilmsQuantity)}
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

export default class Profile extends AbstractView {
  constructor(watchedFilmsQuantity) {
    super();

    this._watchedFilmsQuantity = watchedFilmsQuantity;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedFilmsQuantity);
  }
}
