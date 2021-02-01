import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    this._updateElement();
  }

  _restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  _updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }
}
