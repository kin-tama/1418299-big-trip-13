import {createNewRoutePoint} from "./data.js";
import {getStartDate} from "./data.js";
import {render, RenderTypes, remove} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./utils/common.js";
import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
// import AddButtonPresenter from "./presenter/add_button.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

const NUMBER_OF_POINTS = 2;

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);
// const statsContainer = document.querySelector(`.page-body__container`);

let points = [];
let startDate = getStartDate();

for (let i = 0; i < NUMBER_OF_POINTS; i++) {
  points.push(createNewRoutePoint(startDate, i));
  startDate = points[i].finishTime;
}

const menuViewComponent = new MenuView();
render(RenderTypes.INSERTBEFORE, menuViewComponent, tripMainTripControls, tripMainTripControlsHeader.nextSibling);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripPresenterComponent = new TripPresenter(tripMain, pointsModel);
tripPresenterComponent.init();

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel);
boardPresenter.init();

const filterPresenter = new FilterPresenter(tripMainTripControls, tripEventsSecondHeader, filterModel);
filterPresenter.init();

// const buttonComponent = new AddButtonPresenter(tripMain, boardPresenter.createPoint);
// buttonComponent.init();

// const newPointButton = document.querySelector(`.trip-main__event-add-btn`);

// newPointButton.addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   boardPresenter.createPoint();
// });

const handlePointNewFormOpen = () => {
  menuViewComponent.setMenuItem(MenuItem.TABLE);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_POINT:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      boardPresenter.init();
      boardPresenter.createPoint(handlePointNewFormOpen);
      break;
    case MenuItem.TABLE:
      remove(statisticsComponent);
      boardPresenter.destroy();
      boardPresenter.init();
      menuViewComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      menuViewComponent.setMenuItem(MenuItem.STATISTICS);
      statisticsComponent = new StatsView(pointsModel.getPoints());
      render(RenderTypes.APPEND, statisticsComponent, document.querySelector(`.page-main .page-body__container`));
      break;
  }
};

menuViewComponent.setMenuClickHandler(handleSiteMenuClick);
