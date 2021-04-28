const taskToFilterMap = {
  All: (films) => films.length,
  Watchlist: (films) => films.filter((item) => item.isInWatchlist).length,
  History: (films) => films.filter((item) => item.isWatched).length,
  Favorites: (films) => films.filter((item) => item.isFavourite).length,
};

export const generateFilterData = (films) => {
  return Object.entries(taskToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
