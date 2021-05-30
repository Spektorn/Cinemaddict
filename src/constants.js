export const FilmState = {
  WATCHLIST: 'isInWatchlist',
  HISTORY: 'isWatched',
  FAVORITE: 'isFavorite',
};

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

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
