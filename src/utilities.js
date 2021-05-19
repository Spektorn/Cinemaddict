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

export const getSeveralRandomArrayValues = (array, minLength = 1, maxLength = array.length) => {
  return new Array(getRandomInteger(minLength, maxLength)).fill().map(() => getRandomArrayValue(array));
};

export const getSlicedDataFromMap = (map, startIndex, endIndex) => {
  return Array.from(map.keys()).slice(startIndex, endIndex)
    .reduce((slicedMap, key) => slicedMap.set(key, map.get(key)), new Map);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case 'afterbegin':
      container.prepend(element);
      break;
    case 'beforeend':
      container.append(element);
      break;
  }
};
