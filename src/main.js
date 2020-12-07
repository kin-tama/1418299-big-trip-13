import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";
import {render} from "./util.js";
import {RenderTypes} from "./util.js";
import MenuView from "./view/menu.js";
import SortTemplateView from "./view/trip_sort.js";
import ListTemplateView from "./view/trip_list.js";
import FiltersTemplateView from "./view/filers.js";
import EditPointTemplateView from "./view/edit_existing_point.js";
import ExistingPointTemplateView from "./view/existing_point.js";
import RootAndCostTemplateView from "./view/root_and_cost.js";

const NUMBER_OF_POINTS = 20;

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

const RootAndCostViewComponent = new RootAndCostTemplateView(points);
const menuViewComponent = new MenuView();
const FiltersTemplateViewComponent = new FiltersTemplateView();
const SortTemplateViewComponent = new SortTemplateView();
const ListTemplateViewComponent = new ListTemplateView();


render(RenderTypes.PREPEND, RootAndCostViewComponent.getElement(), tripMain);
render(RenderTypes.INSERTBEFORE, menuViewComponent.getElement(), tripMainTripControls, tripMainTripControlsHeader.nextSibling);
render(RenderTypes.INSERTBEFORE, FiltersTemplateViewComponent.getElement(), tripMainTripControls, tripEventsSecondHeader);
render(RenderTypes.INSERTBEFORE, SortTemplateViewComponent.getElement(), tripEvents, tripEventsHeader.nextSibling);
const tripSort = tripEvents.querySelector(`.trip-sort`);
render(RenderTypes.INSERTBEFORE, ListTemplateViewComponent.getElement(), tripEvents, tripSort.nextSibling);
const tripList = tripEvents.querySelector(`.trip-events__list`);


const renderPoint = (point) => {
  const existingPointComponent = new ExistingPointTemplateView(point);
  const editingPointComponent = new EditPointTemplateView(point);

  const rollupOldPoint = () => {
    tripList.replaceChild(editingPointComponent.getElement(), existingPointComponent.getElement());
  };

  const retrieveOldPoint = () => {
    tripList.replaceChild(existingPointComponent.getElement(), editingPointComponent.getElement());
  };

  existingPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    rollupOldPoint();
  });

  editingPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    retrieveOldPoint();
  });

  editingPointComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, () => {
    retrieveOldPoint();
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

