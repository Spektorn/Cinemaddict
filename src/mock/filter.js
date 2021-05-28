const taskToFilterMap = {
  All: (films) => films.length,
  Watchlist: (films) => films.filter((item) => item.isInWatchlist).length,
  History: (films) => films.filter((item) => item.isWatched).length,
  Favorites: (films) => films.filter((item) => item.isFavorite).length,
};

export const generateFilter = (films) => {
  const filter = new Object;

  for (const [filterName, countFilms] of Object.entries(taskToFilterMap)) {
    filter[filterName] = countFilms(films);
  }

  return filter;
};
