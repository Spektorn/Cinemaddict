export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (min = 0, max = 10, decimials = 1) => {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimials));
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInteger());
};

export const getRandomArrayValue = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

export const getSeveralRandomArrayValues = function (array, minLength = 1, maxLength = array.length) {
  return new Array(getRandomInteger(minLength, maxLength)).fill().map(() => getRandomArrayValue(array));
};
