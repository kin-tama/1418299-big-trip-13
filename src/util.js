export const getRandomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

export const RenderTypes = {
  INSERTBEFORE: `insertBefore`,
  PREPEND: `prepend`,
  APPEND: `append`,
};

export const render = (type, element, container, referenceElement) => {
  switch (type) {
    case RenderTypes.INSERTBEFORE:
      container.insertBefore(element, referenceElement);
      break;

    case RenderTypes.PREPEND:
      container.prepend(element);
      break;

    case RenderTypes.APPEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  let newElement = document.createElement(`div`);
  // newElement.innerHTML = template;
  // в учебном проекте использовался newElement.innerHTML. Можно ли использовать insertAdjacentHTML?
  newElement.insertAdjacentHTML(`afterbegin`, template);
  return newElement.firstChild;
};
