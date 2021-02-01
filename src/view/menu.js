import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active ${MenuItem.TABLE}" href="#">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn ${MenuItem.STATISTICS}" href="#">${MenuItem.STATISTICS}</a>
  </nav>`;
};


export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._tableClickHandler = this._tableClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
    this._addClickHandler = this._addClickHandler.bind(this);

    this._tableButton = this.getElement().querySelector(`.Table`);
    this._statsButton = this.getElement().querySelector(`.Stats`);
    this._newPointButton = document.querySelector(`.trip-main__event-add-btn`);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelector(`.Table`).addEventListener(`click`, this._tableClickHandler);
    this.getElement().querySelector(`.Stats`).addEventListener(`click`, this._statsClickHandler);
    this._newPointButton.addEventListener(`click`, this._addClickHandler);

  }

  setMenuItem(menuItem) {
    if (menuItem === MenuItem.TABLE) {
      this._tableButton.classList.add(`trip-tabs__btn--active`);
      this._statsButton.classList.remove(`trip-tabs__btn--active`);
    } else {
      this._statsButton.classList.add(`trip-tabs__btn--active`);
      this._tableButton.classList.remove(`trip-tabs__btn--active`);
    }
  }

  blockAddButton() {
    this._newPointButton.disabled = true;
  }

  unBlockAddButton() {
    this._newPointButton.disabled = false;
  }

  _tableClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.TABLE);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATISTICS);
  }

  _addClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.NEW_POINT);
  }
}
