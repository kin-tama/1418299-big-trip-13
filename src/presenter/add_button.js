import {
  render,
  RenderTypes
} from "../utils/render.js";

import ButtonView from "../view/button.js";

export default class AddButtonPresenter {
  constructor(container, callback) {
    this._container = container;
    this._callback = callback;
    this._buttonComponent = new ButtonView();
  }

  init() {
    render(RenderTypes.APPEND, this._buttonComponent, this._container);
    // this._buttonComponent.setButtonHandler(this._callback);
  }
}
