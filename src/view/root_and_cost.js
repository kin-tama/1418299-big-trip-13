import AbstractView from "./abstract.js";

const createRootAndCostTemplate = (points) => {

  const describeRoute = (allPoints) => {
    if (allPoints.length > 3) {
      return `${allPoints[0].pointName} — ... — ${allPoints[allPoints.length - 1].pointName}`;
    } else if (allPoints.length === 3) {
      return `${allPoints[0].pointName} — ${allPoints[1].pointName} — ${allPoints[allPoints.length - 1].pointName}`;
    } else if (allPoints.length === 2) {
      return `${allPoints[0].pointName} — ${allPoints[1].pointName}`;
    } else if (allPoints.length === 1) {
      return `${allPoints[0].pointName}`;
    } else {
      return ``;
    }
  };

  const calculateTotalCost = () => {
    let mainCost = 0;
    // let optionsCost = 0;
    // for (let i = 0; i < allPoints.length; i++) {
    //   optionsCost = Object.values(allPoints[i].options).reduce((a, b) => a + b);
    //   mainCost = mainCost + optionsCost + allPoints[i].cost;
    // }
    return mainCost;
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

export default class RootAndCostView extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRootAndCostTemplate(this._points);
  }
}
