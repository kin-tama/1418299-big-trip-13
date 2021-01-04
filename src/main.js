import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";
import {render, RenderTypes} from "./utils/render.js";
import MenuView from "./view/menu.js";
import FiltersView from "./view/filers.js";
import Board from "./presenter/board.js";
import TripPresenter from "./presenter/trip.js";

const NUMBER_OF_POINTS = 5;

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);

let points = [];
let startDate = getStartDate();

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  points.push(createNewRoutePoint(startDate, i));
  startDate = points[i].finishTime;
}

const menuViewComponent = new MenuView();
const filtersViewComponent = new FiltersView();
render(RenderTypes.INSERTBEFORE, menuViewComponent.getElement(), tripMainTripControls, tripMainTripControlsHeader.nextSibling);
render(RenderTypes.INSERTBEFORE, filtersViewComponent.getElement(), tripMainTripControls, tripEventsSecondHeader);

const tripPresenterComponent = new TripPresenter(tripMain);
tripPresenterComponent.init(points);


const BoardComponent = new Board(tripMain);
BoardComponent.init(points);

