import Abstract from '../view/abstract.js';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case 'afterbegin':
      container.prepend(element);
      break;
    case 'beforeend':
      container.append(element);
      break;
  }
};
