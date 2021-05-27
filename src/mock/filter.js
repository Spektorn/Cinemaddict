const taskToFilterMap = {
  All: (films) => films.length,
  Watchlist: (films) => films.filter((item) => item.isInWatchlist).length,
  History: (films) => films.filter((item) => item.isWatched).length,
  Favorites: (films) => films.filter((item) => item.isFavorite).length,
};

export const generateFilters = (films) => {
  const filters = new Object;

  for (const [filterName, countFilms] of Object.entries(taskToFilterMap)) {
    filters[filterName] = countFilms(films);
  }

  return filters;
};
