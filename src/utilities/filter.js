import {FilterType} from './constants.js';

export const filterMap = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((item) => item.isInWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((item) => item.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((item) => item.isFavorite),
};
