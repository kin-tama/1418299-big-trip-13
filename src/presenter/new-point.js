import {blankPoint} from "../utils/pointUtil.js";
import {menuViewComponent} from "../main.js";

import {
  UpdateType,
  UserAction
} from "../const.js";
import {
  render,
  remove,
  RenderTypes
} from "../utils/render.js";

import NewPointView from "../view/edit_new_point.js";

export default class NewPointPreseter {

  constructor(changePoint, offers, destinations) {
    this._changePoint = changePoint;
    this._offers = offers;
    this._destinations = destinations;

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
    this._addingPointComponent = new NewPointView(blankPoint(), this._destinations, this._offers);
    this._addingPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._addingPointComponent.setClickDeleteHandler(this._handleDeleteClick);

    render(RenderTypes.PREPEND, this._addingPointComponent, this._container);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  setAborting() {
    const resetFormState = () => {
      this._addingPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._addingPointComponent.shake(resetFormState);
  }

  setSaving() {
    this._addingPointComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  destroy() {
    if (this._addingPointComponent === null) {
      return;
    }

    remove(this._addingPointComponent);
    this._addingPointComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleFormSubmit(newPoint) {
    menuViewComponent.unBlockAddButton();
    this._changePoint(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        newPoint);
  }

  _handleDeleteClick() {
    this.destroy();
    menuViewComponent.unBlockAddButton();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      menuViewComponent.unBlockAddButton();
      this.destroy();
    }
  }
}
