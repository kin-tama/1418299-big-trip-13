import AbstractView from "./abstract.js";

const createEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyView extends AbstractView {
  getTemplate() {
    return createEmptyTemplate();
  }
}
