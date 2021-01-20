import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";
import {render, RenderTypes} from "./utils/render.js";
import MenuView from "./view/menu.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

const NUMBER_OF_POINTS = 5;

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);

let points = [];
let startDate = getStartDate();

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  points.push(createNewRoutePoint(startDate, i));
  startDate = points[i].finishTime;
}

const menuViewComponent = new MenuView();
render(RenderTypes.INSERTBEFORE, menuViewComponent.getElement(), tripMainTripControls, tripMainTripControlsHeader.nextSibling);

const tripPresenterComponent = new TripPresenter(tripMain);
tripPresenterComponent.init(points);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const boardComponent = new BoardPresenter(tripMain, pointsModel, filterModel);
boardComponent.init();

const filterPresenter = new FilterPresenter(tripMainTripControls, tripEventsSecondHeader, filterModel);
filterPresenter.init();

newPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardComponent.createPoint();
});
