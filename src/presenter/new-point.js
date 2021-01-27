import {blankPoint} from "../data.js";
import {
  UpdateType,
  UserAction
} from "../utils/common.js";
import {
  render,
  remove,
  RenderTypes
} from "../utils/render.js";

import NewPointView from "../view/edit_new_point.js";

export default class NewPointPreseter {

  constructor(changePoint) {
    this._changePoint = changePoint;

    this._addingPointComponent = null;
    this._swithchMenuToTasks = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }


  init(container, callback) {
    this._container = container;
    this._swithchMenuToTasks = callback;


    if (this._swithchMenuToTasks !== null) {
      this._swithchMenuToTasks();
    }

    if (this._addingPointComponent !== null) {
      return;
    }
    this._addingPointComponent = new NewPointView(blankPoint());
    this._addingPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._addingPointComponent.setClickDeleteHandler(this._handleDeleteClick);

    render(RenderTypes.PREPEND, this._addingPointComponent, this._container);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleFormSubmit(newPoint) {
  // готово
    this._changePoint(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        newPoint);
    this.destroy();
  }

  _handleDeleteClick() {
    // готово
    this.destroy();
  }

  _onEscKeyDown(evt) {
    // готово
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  destroy() {
    // готово
    if (this._addingPointComponent === null) {
      return;
    }

    remove(this._addingPointComponent);
    this._addingPointComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);

  }
}
