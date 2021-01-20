import {UpdateType, UserAction} from "../utils/common.js";
import NewPointView from "../view/edit_new_point.js";
import PointsModel from "../model/points.js";
import {render, remove, RenderTypes} from "../utils/render.js";

export default class NewPointPreseter {
  constructor(changePoint) {
    this._changePoint = changePoint;

    this._addingPointComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(container) {
    this._container = container;

    if (this._addingPointComponent !== null) {
      return;
    }
    const points = new PointsModel();
    points.setPoints();

    this._point = points.getPoints()[0];

    this._addingPointComponent = new NewPointView(this._point);
    this._addingPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._addingPointComponent.setClickDeleteHandler(this._handleDeleteClick);

    render(RenderTypes.INSERTBEFORE, this._addingPointComponent, this._container);

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

  _onEscKeyDown(evt) {
    // готово
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleDeleteClick() {
    // готово
    this.destroy();
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
