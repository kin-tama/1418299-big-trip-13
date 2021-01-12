import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};

  }

  _restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
    // конкретизировать метод в наследнике (edit_new_point). Его задача — восстанавливать обработчики событий после перерисовки;
  }

  _updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
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

    // будет обновлять данные и, если нужно, вызывать метод updateElement
    this._updateElement();
  }

  // добавить обработчики для опций в наследнике
}
