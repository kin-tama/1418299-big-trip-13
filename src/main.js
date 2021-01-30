import {render, RenderTypes, remove} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./utils/common.js";
import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";


const AUTHORIZATION = `Basic svkjbsdkvbsduybjwe3234tw`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;

const api = new Api(END_POINT, AUTHORIZATION);

const tripMain = document.querySelector(`.trip-main`);
const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);

const menuViewComponent = new MenuView();

const pointsModel = new PointsModel();

const tripPresenterComponent = new TripPresenter(tripMain, pointsModel);

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(tripEvents, pointsModel, filterModel, api);
boardPresenter.init();

const filterPresenter = new FilterPresenter(tripMainTripControls, tripEventsSecondHeader, filterModel);
filterPresenter.init();

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


api.getDestinations()
.then((dest) => {
  boardPresenter.setDestinations(dest);
});
api.getOffers()
.then((offers) => {
  boardPresenter.setOffers(offers);
});


api.getPoints()
.then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
  render(RenderTypes.INSERTBEFORE, menuViewComponent, tripMainTripControls, tripMainTripControlsHeader.nextSibling);
  tripPresenterComponent.init();
  menuViewComponent.setMenuClickHandler(handleSiteMenuClick);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(RenderTypes.INSERTBEFORE, menuViewComponent, tripMainTripControls, tripMainTripControlsHeader.nextSibling);
  tripPresenterComponent.init();
  menuViewComponent.setMenuClickHandler(handleSiteMenuClick);
});

