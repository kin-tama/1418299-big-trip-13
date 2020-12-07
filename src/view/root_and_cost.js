import {createElement} from "../util.js";

const createRootAndCostTemplate = (points) => {

  const describeRoute = (allPoints) => {
    return allPoints.length > 3
      ? `${allPoints[0].pointName} — ... — ${allPoints[allPoints.length - 1].pointName}`
      : `${allPoints[0].pointName} — ${allPoints[1].pointName} — ${allPoints[allPoints.length - 1].pointName}`;
  };

  const getAdditionalCost = (point) => {
    let calculatedAddCost = 0;
    point.options.forEach((element) => {
      calculatedAddCost = calculatedAddCost + element.addCost;
    });
    return calculatedAddCost;
  };

  const calculateTotalCost = (allPoints) => {
    let mainCost = 0;
    let additionalCost = 0;
    for (let i = 0; i < allPoints.length; i++) {
      mainCost = mainCost + allPoints[i].cost;
      additionalCost = additionalCost + getAdditionalCost(points[i]);
    }
    return mainCost + additionalCost;
  };

  return `<section class="trip-main__trip-info trip-info">
  <div class="trip-info__main">
  <h1 class="trip-info__title">${describeRoute(points)} </h1>

  <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value"> ${calculateTotalCost(points)} </span>
  </p>
  </section>`;
};

export default class RootAndCostTemplateView {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createRootAndCostTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
