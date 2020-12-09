import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";
import {render} from "./util.js";
import {RenderTypes} from "./util.js";
import MenuView from "./view/menu.js";
import SortView from "./view/trip_sort.js";
import ListView from "./view/trip_list.js";
import FiltersView from "./view/filers.js";
import EditPointView from "./view/edit_existing_point.js";
import ExistingPointView from "./view/existing_point.js";
import RootAndCostView from "./view/root_and_cost.js";
import EmptyView from "./view/empty.js";

const NUMBER_OF_POINTS = 0;

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsHeader = tripEvents.querySelector(`.trip-events h2`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);

let points = [];
let startDate = getStartDate();

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  points.push(createNewRoutePoint(startDate, i));
  startDate = points[i].finishTime;
}

const rootAndCostViewComponent = new RootAndCostView(points);
const menuViewComponent = new MenuView();
const filtersViewComponent = new FiltersView();
const sortViewComponent = new SortView();
const listViewComponent = new ListView();
const emptyViewComponent = new EmptyView();

if (points.length > 0) {
  render(RenderTypes.PREPEND, rootAndCostViewComponent.getElement(), tripMain);
}

render(RenderTypes.INSERTBEFORE, menuViewComponent.getElement(), tripMainTripControls, tripMainTripControlsHeader.nextSibling);
render(RenderTypes.INSERTBEFORE, filtersViewComponent.getElement(), tripMainTripControls, tripEventsSecondHeader);
render(RenderTypes.INSERTBEFORE, sortViewComponent.getElement(), tripEvents, tripEventsHeader.nextSibling);
const tripSort = tripEvents.querySelector(`.trip-sort`);
render(RenderTypes.INSERTBEFORE, listViewComponent.getElement(), tripEvents, tripSort.nextSibling);
const tripList = tripEvents.querySelector(`.trip-events__list`);

const renderPoint = (point) => {
  const existingPointComponent = new ExistingPointView(point);
  const editingPointComponent = new EditPointView(point);

  const rollupOldPoint = () => {
    tripList.replaceChild(editingPointComponent.getElement(), existingPointComponent.getElement());
  };

  const retrieveOldPoint = () => {
    tripList.replaceChild(existingPointComponent.getElement(), editingPointComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      retrieveOldPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  existingPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    rollupOldPoint();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editingPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    retrieveOldPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editingPointComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
    retrieveOldPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editingPointComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    retrieveOldPoint();
  });

  render(RenderTypes.APPEND, existingPointComponent.getElement(), tripList);
};

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  renderPoint(points[i]);
}

if (points.length < 1) {
  render(RenderTypes.APPEND, emptyViewComponent.getElement(), tripList);
}
