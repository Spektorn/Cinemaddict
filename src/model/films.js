import Observer from '../utilities/observer.js';

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedItem) {
    const updatingItemIndex = this._films.findIndex((item) => item.id === updatedItem.id);

    if (updatingItemIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, updatingItemIndex),
      updatedItem,
      ...this._films.slice(updatingItemIndex + 1),
    ];

    this._notify(updateType, updatedItem);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        poster: film.film_info.poster,
        title: film.film_info.title,
        originalTitle: film.film_info.alternative_title,
        description: film.film_info.description,
        rating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        country: film.film_info.release.release_country,
        releaseDate: film.film_info.release.date,
        runningTime: film.film_info.runtime,
        genres: film.film_info.genre,
        director: film.film_info.director,
        scriptwriters: film.film_info.writers,
        actors: film.film_info.actors,
        isInWatchlist: film.user_details.watchlist,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchedDate: film.user_details.watching_date,
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'poster': film.poster,
          'title': film.title,
          'alternative_title': film.originalTitle,
          'description': film.description,
          'total_rating': film.rating,
          'age_rating': film.ageRating,
          'release': {
            'date': film.releaseDate,
            'release_country': film.country,
          },
          'runtime': film.runningTime,
          'genre': film.genres,
          'director': film.director,
          'writers': film.scriptwriters,
          'actors': film.actors,
        },
        'user_details': {
          'watchlist': film.isInWatchlist,
          'already_watched': film.isWatched,
          'watching_date': film.watchedDate,
          'favorite': film.isFavorite,
        },
      },
    );

    delete adaptedFilm.poster;
    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.rating;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.runningTime;
    delete adaptedFilm.genres;
    delete adaptedFilm.director;
    delete adaptedFilm.scriptwriters;
    delete adaptedFilm.actors;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchedDate;

    return adaptedFilm;
  }
}
