import {
  render,
  RenderTypes,
  remove
} from "../utils/render.js";

import {UpdateType} from "../utils/common.js";

import RootAndCostView from "../view/root_and_cost.js";

export default class TripPresenter {
  constructor(tripContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._renderRoot();
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  _renderRoot() {
    this._rootComponent = new RootAndCostView(this._getPoints());
    if (this._getPoints().length > 0) {
      render(RenderTypes.PREPEND, this._rootComponent.getElement(), this._tripContainer);
    }
  }

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        remove(this._rootComponent);
        this._renderRoot();
        break;
      case UpdateType.MINOR:
        remove(this._rootComponent);
        this._renderRoot();
        break;
      case UpdateType.MAJOR:
        remove(this._rootComponent);
        this._renderRoot();
        break;
    }
  }
}
