import AbstractView from "../view/abstract.js";

export const RenderTypes = {
  INSERTBEFORE: `insertBefore`,
  PREPEND: `prepend`,
  APPEND: `append`,
};

export const render = (type, child, container, referenceElement) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (type) {
    case RenderTypes.INSERTBEFORE:
      container.insertBefore(child, referenceElement);
      break;

    case RenderTypes.PREPEND:
      container.prepend(child);
      break;

    case RenderTypes.APPEND:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  let newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};
