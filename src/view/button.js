import AbstractView from "./abstract.js";

const createButtonTemplate = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class ButtonView extends AbstractView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createButtonTemplate();
  }

  setButtonHandler(callback) {
    this._callback = callback;
    this.getElement().addEventListener(`click`, this._buttonClickHandler);
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback();
  }

}
