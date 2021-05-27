import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

import {getRandomInteger, getRandomFloat, getRandomBoolean, getRandomArrayValue, getSeveralRandomArrayValues} from '../utilities/common.js';

//* Mock-данные
const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const titles = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sinbad the Sailor',
  'Sagebrush Trail',
  'Santa Claus Conquers the Martians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man with the Golden Arm',
];

const countries = [
  'USA',
  'Russia',
  'Brazil',
  'Germany',
  'France',
  'Sweden',
  'Denmark',
];

const genres = [
  'Musical',
  'Noir',
  'Horror',
  'Action',
  'Comedy',
  'Drama',
  'Western',
];

const ageRatings = [0, 6, 12, 16, 18];

const people = [
  'Anthony Mann',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
];

const sentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
];

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const generateDate = (type) => {
  const PAST_YEAR_GAP = 45;

  const dateType = {
    'releaseDate': {
      'isInPast': true,
      'maxDaysGap': 365,
    },
    'commentDate': {
      'isInPast': false,
      'maxDaysGap': 14,
    },
  };

  const date = dateType[type]['isInPast'] ? dayjs().add(-PAST_YEAR_GAP, 'year') : dayjs();

  const daysGap = getRandomInteger(-(dateType[type]['maxDaysGap']), dateType[type]['maxDaysGap']);

  return date.add(daysGap, 'day');
};

const generateRunningTime = () => {
  const hours = getRandomInteger(0, 3);
  const minutes = getRandomInteger(1, 59);

  const runningTime = hours ? (hours + ' h ' + minutes + ' m') : (minutes + ' m');

  return runningTime;
};

//* Генерация комментария
export const generateComment = () => {
  return {
    author: getRandomArrayValue(people),
    date: generateDate('commentDate'),
    text: getSeveralRandomArrayValues(sentences),
    emotion: getRandomArrayValue(emotions),
  };
};

//* Генерация фильма
export const generateFilm = () => {
  const currentTitle = getRandomArrayValue(titles);

  return {
    id: nanoid(),
    poster: getRandomArrayValue(posters),
    title: currentTitle,
    originalTitle: currentTitle,
    description: getSeveralRandomArrayValues(sentences),
    rating: getRandomFloat(),
    ageRating: getRandomArrayValue(ageRatings),
    country: getRandomArrayValue(countries),
    releaseDate: generateDate('releaseDate'),
    runningTime: generateRunningTime(),
    genres: getSeveralRandomArrayValues(genres),
    director: getRandomArrayValue(people),
    scriptwriters: getSeveralRandomArrayValues(people),
    actors: getSeveralRandomArrayValues(people),
    isInWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

//* Генерация фильма и комментариев к нему
export const generateFilmCollection = () => {
  const MIN_COMMENT_QUANTITY = 0;
  const MAX_COMMENT_QUANTITY = 5;

  return new Array(generateFilm(),
    new Array(getRandomInteger(MIN_COMMENT_QUANTITY, MAX_COMMENT_QUANTITY)).fill().map(() => generateComment()));
};

//* Генерация коллекции связанных фильмов и комментариев
export const generateFilmsCollection = (filmsQuantity) => {
  const filmsCollection = new Map;

  for (let i = 0; i < filmsQuantity; i++) {
    filmsCollection.set(...(generateFilmCollection()));
  }

  return filmsCollection;
};
