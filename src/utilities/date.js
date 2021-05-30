import dayjs from 'dayjs';

import {getRandomInteger} from './common.js';

export const dateFormatReleaseBrief = (date) => {
  return dayjs(date).format('YYYY');
};
export const dateFormatReleaseDetailed = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};
export const dateFormatComment = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:MM');
};

export const generateDate = (type) => {
  const PAST_YEAR_GAP = 45;

  const dateType = {
    'releaseDate': {
      'isInPast': true,
      'maxDaysGap': 7300,
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

export const getTodayDate = () => {
  return dayjs();
};
