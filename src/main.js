import {createEditPointTemplate} from "./view/edit_existing_point.js";
// import {createNewPointTemplate} from "./view/edit_new_point.js";
import {createListTemplate} from "./view/trip_list.js";
import {createExistingPointTemplate} from "./view/existing_point.js";
import {createFiltersTemplate} from "./view/filers.js";
import {createMenuTemplate} from "./view/menu.js";
import {createRootAndCostTemplate} from "./view/root_and_cost.js";
import {createSortTemplate} from "./view/trip_sort.js";
import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";

const NUMBER_OF_POINTS = 20;


const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

const renderElements = (element, content, position) => {
  element.insertAdjacentHTML(position, content);
};

let points = [];
let startDate = getStartDate();

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  points.push(createNewRoutePoint(startDate, i));
  startDate = points[i].finishTime;
}

renderElements(tripMain, createRootAndCostTemplate(points), `afterbegin`);
renderElements(tripMainTripControlsHeader, createMenuTemplate(), `afterend`);
renderElements(tripMainTripControls, createFiltersTemplate(), `beforeend`);
renderElements(tripEvents, createSortTemplate(), `beforeend`);
renderElements(tripEvents, createListTemplate(), `beforeend`);

const tripsList = tripEvents.querySelector(`.trip-events__list`);
// renderElements(tripsList, createNewPointTemplate(points[0]), `beforeend`);
renderElements(tripsList, createEditPointTemplate(points[0]), `beforeend`);

const renderExistingPoints = () => {
  for (let i = 1; i < NUMBER_OF_POINTS; i++) {
    renderElements(tripsList, createExistingPointTemplate(points[i]), `beforeend`);
  }
};

renderExistingPoints();

