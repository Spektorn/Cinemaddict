export const createProfileTemplate = (watchedQuantity) => {
  const rankToQuantityBarrier = {
    'Novice': 1,
    'Fan': 11,
    'Movie Buff': 21,
  };

  const renderRank = () => {
    if(!watchedQuantity) {
      return;
    }

    let currentRank;

    for (const [rankName, quantityBarrier] of Object.entries(rankToQuantityBarrier)) {
      if(watchedQuantity >= quantityBarrier) {
        currentRank = rankName;
      }
    }

    return `<p class="profile__rating">${currentRank}</p>`;
  };

  return `<section class="header__profile profile">
            ${renderRank()}
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};
