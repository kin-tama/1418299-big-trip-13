import {
  render,
  remove,
  RenderTypes
} from "../utils/render.js";
import {
  SortType,
  UpdateType,
  UserAction,
  FilterType
} from "../const.js";
import {filterUtil} from "../utils/filterUtil.js";
import {
  sortDuration,
  sortDate,
  sortCost
} from "../utils/sort.js";

import SortView from "../view/trip_sort.js";
import ListView from "../view/trip_list.js";
import EmptyView from "../view/empty.js";
import LoadingView from "../view/loading.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import NewPointPreseter from "./new-point.js";


export default class Board {

  constructor(pointsContainer, pointsModel, filterModel, api, menuViewComponent) {
    this._pointsContainer = pointsContainer;
    this._isLoading = true;
    this._api = api;

    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._menuView = menuViewComponent;
  }

  init() {
    this._sortComponent = null;
    this._loadingComponent = new LoadingView();
    this._listComponent = new ListView();
    this._emptyComponent = new EmptyView();

    this._pointsModel.add(this._handleModelEvent);
    this._filterModel.add(this._handleModelEvent);
    this._newPointPreseter = new NewPointPreseter(this._handleViewAction, this._offers, this._destinations, this._menuView);

    this._renderAll();
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._newPointPreseter.init(this._listComponent, callback);
  }

  destroy() {
    this._clearAll({resetSortType: true});

    remove(this._listComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = [...filterUtil[filterType](points)];

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filtredPoints.sort(sortDate);

      case SortType.TIME:
        return filtredPoints.sort(sortDuration);

      case SortType.PRICE:
        return filtredPoints.sort(sortCost);
    }
    return filtredPoints;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearAll();
    this._renderAll();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.CHANGE_POINT:
        if (update.beginningTime > update.finishTime) {
          throw new Error(`Incorrect date: the date of the beginning must be earlier than finish date`);
        }
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        if (update.beginningTime > update.finishTime) {
          this._newPointPreseter.setAborting();
          throw new Error(`Incorrect date: the date of the beginning must be earlier than finish date`);
        }
        this._newPointPreseter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._newPointPreseter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearAll();
        this._renderAll();
        break;
      case UpdateType.MAJOR:
        this._clearAll({resetSortType: true});
        this._renderAll();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPoints();
        break;
    }
  }

  _handleModeChange() {
    this._newPointPreseter.destroy();
    Object.values(this._pointPresenter)
    .forEach((presenter) => {
      presenter.resetView();
    });
  }

  _renderLoading() {
    render(RenderTypes.APPEND, this._loadingComponent, this._listComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setChangeSortTypeHandler(this._handleSortTypeChange);
    render(RenderTypes.PREPEND, this._sortComponent, this._pointsContainer);
  }

  _renderList() {
    render(RenderTypes.APPEND, this._listComponent, this._pointsContainer);
  }

  _renderEmptyMessage() {
    render(RenderTypes.APPEND, this._emptyComponent, this._listComponent);
  }

  _renderPoints() {
    const points = this._getPoints();
    if (points.length > 0) {
      points.forEach((point) => this._renderPoint(point));
      return;
    } else {
      this._renderEmptyMessage();
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._listComponent, this._handleViewAction, this._handleModeChange, this._destinations, this._offers);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderAll() {
    this._renderSort();
    this._renderList();
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    this._renderPoints();
  }

  _clearAll({resetSortType = false} = {}) {
    this._newPointPreseter.destroy();
    Object.values(this._pointPresenter).forEach((pesenter) => {
      pesenter.destroy();
    });
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._emptyComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
