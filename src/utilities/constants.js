export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const ListType = {
  ALL: 'all',
  TOP_RATED: 'top-rated',
  MOST_COMMENTED: 'most-commented',
  EMPTY: 'empty',
  LOADING: 'loading',
};

export const FilmState = {
  WATCHLIST: 'isInWatchlist',
  HISTORY: 'isWatched',
  FAVORITE: 'isFavorite',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const KeyCode = {
  ENTER: 13,
  ESCAPE: 27,
};
