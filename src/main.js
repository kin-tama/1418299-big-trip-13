import {createEditPointTemplate} from "./view/edit_existing_point.js";
import {createNewPointTemplate} from "./view/edit_new_point.js";
import {createListTemplate} from "./view/trip_list.js";
import {createExistingPointTemplate} from "./view/existing_point.js";
import {createFiltersTemplate} from "./view/filers.js";
import {createMenuTemplate} from "./view/menu.js";
import {createRootAndCostTemplate} from "./view/root_and_cost.js";
import {createSortTemplate} from "./view/trip_sort.js";

const NUMBER_OF_POINTS = 3;

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);

const renderElements = (element, content, position) => {
  element.insertAdjacentHTML(position, content);
};

renderElements(tripMain, createRootAndCostTemplate(), `afterbegin`);
renderElements(tripMainTripControlsHeader, createMenuTemplate(), `afterend`);
renderElements(tripMainTripControls, createFiltersTemplate(), `beforeend`);
renderElements(tripEvents, createSortTemplate(), `beforeend`);
renderElements(tripEvents, createListTemplate(), `beforeend`);


const tripsList = tripEvents.querySelector(`.trip-events__list`);
renderElements(tripsList, createNewPointTemplate(), `beforeend`);
renderElements(tripsList, createEditPointTemplate(), `beforeend`);

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  renderElements(tripsList, createExistingPointTemplate(), `beforeend`);
}
