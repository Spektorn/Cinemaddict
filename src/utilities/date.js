import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getTodayDate = () => {
  return dayjs();
};

export const dateFormatReleaseBrief = (date) => {
  return dayjs(date).format('YYYY');
};
export const dateFormatReleaseDetailed = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};
export const dateFormatComment = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:MM');
};

export const runtimeAdapter = (minutes) => {
  return dayjs.duration(minutes, 'm').hours() + 'h ' + dayjs.duration(minutes, 'm').minutes() + 'm';
}

export const statisticsRuntimeAdapter = (minutes) => {
  return {
    hours: dayjs.duration(minutes, 'm').hours(),
    minutes: dayjs.duration(minutes, 'm').minutes(),
  }
}
