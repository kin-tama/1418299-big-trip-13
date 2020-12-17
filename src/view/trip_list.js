import AbstractView from "./abstract.js";

const createListTemplate = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class ListView extends AbstractView {
  getTemplate() {
    return createListTemplate();
  }
}
