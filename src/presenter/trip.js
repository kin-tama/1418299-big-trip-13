import {render, RenderTypes} from "../utils/render.js";
import RootAndCostView from "../view/root_and_cost.js";

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
  }

  init(points) {
    this._points = points.slice();
    this._renderRoot(this._points);
  }

  _renderRoot(points) {
    this._rootComponent = new RootAndCostView(points);

    if (points.length > 0) {
      render(RenderTypes.PREPEND, this._rootComponent.getElement(), this._tripContainer);
    }
  }
}
