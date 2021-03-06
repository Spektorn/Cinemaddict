import dayjs from 'dayjs';

export const sortFilmsByReleaseDate = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const sortFilmsByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortFilmsByComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};
