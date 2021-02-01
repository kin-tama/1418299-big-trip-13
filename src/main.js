import {render, RenderTypes, remove} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import MenuView from "./view/menu.js";
import StatsView from "./view/stats.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic svkjbsdkvbsduybjwe3234tw`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;

const api = new Api(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
export const menuViewComponent = new MenuView();
const pointsModel = new PointsModel();

const tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
const tripMainTripControlsHeader = tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
const tripEvents = document.querySelector(`.trip-events`);
const tripEventsSecondHeader = tripEvents.querySelector(`.trip-events:last-child`);

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
      menuViewComponent.blockAddButton();
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

render(RenderTypes.INSERTBEFORE, menuViewComponent, tripMainTripControls, tripMainTripControlsHeader.nextSibling);
menuViewComponent.setMenuClickHandler(handleSiteMenuClick);

Promise.all([api.getDestinations(), api.getOffers(), api.getPoints()])
.then(([destinations, offers, points]) => {
  boardPresenter.setDestinations(destinations);
  boardPresenter.setOffers(offers);
  pointsModel.setPoints(UpdateType.INIT, points);
})
.catch((error) => {
  window.console.error(error);
  pointsModel.setPoints(UpdateType.INIT, []);
});
