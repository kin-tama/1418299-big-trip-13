import {render, remove, RenderTypes} from "../utils/render.js";
import {SortType, UpdateType, UserAction, FilterType} from "../utils/common.js";
import {filterUtil} from "../utils/filterUtil.js";
import {sortDate, sortCost} from "../utils/sort.js";
import SortView from "../view/trip_sort.js";
import ListView from "../view/trip_list.js";
import EmptyView from "../view/empty.js";
import PointPresenter from "./point.js";
import NewPointPreseter from "./new-point.js";


export default class Board {

  constructor(pointsContainer, pointsModel, filterModel) {
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._pointsContainer = pointsContainer;
    // объявляем свойство _pointPresenter - объект, в который будут записываться все точки маршрута по ключу (ID точки).
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._sortComponent = null;
    // this._sortComponent = new SortView();
    this._listComponent = new ListView();
    this._emptyComponent = new EmptyView();

    this._tripEvents = document.querySelector(`.trip-events`);
    this._tripEventsHeader = this._tripEvents.querySelector(`.trip-events h2`);
    this._tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
    this._tripMainTripControlsHeader = this._tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._newPointPreseter = new NewPointPreseter(this._handleViewAction);
  }

  init() {
    this._renderAll();
  }

  createPoint() {
    this._firstPoint = this._tripList.querySelector(`.trip-events__item`);

    this._oldPoint = document.querySelector(`.event`);
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._newPointPreseter.init();
  }

  _getPoints() {
    // filterType - возвращает текущий установленный фильтр
    const filterType = this._filterModel.getFilter();
    // points - все текущие точки
    const points = this._pointsModel.getPoints();
    // filtredPoints - все текущие точки, пропущенные через import {filter} from "../utils/filterUtil.js"
    const filtredPoints = filterUtil[filterType](points);

    // возвращает данные из модели, пропущенные через фильтр и сортируем их

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortDate);

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
    this._clearBoard();
    this._renderAll();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setChangeSortTypeHandler(this._handleSortTypeChange);
    render(RenderTypes.INSERTBEFORE, this._sortComponent.getElement(), this._tripEvents, this._tripEventsHeader.nextSibling);
    this._tripSort = this._tripEvents.querySelector(`.trip-sort`);
  }

  _renderList() {
    // рендеринг списка
    render(RenderTypes.INSERTBEFORE, this._listComponent.getElement(), this._tripEvents, this._tripSort.nextSibling);
    this._tripList = this._tripEvents.querySelector(`.trip-events__list`);
  }

  _renderEmptyMessage() {
    // рендеирнг пустого окна
    render(RenderTypes.APPEND, this._emptyComponent.getElement(), this._tripList);
  }

  _renderPoints() {
    // рендеринг всех точек: если длина масива точек > 1, отрендерить все точки, иначе - пустую страницу
    const points = this._getPoints().slice();
    if (points.length >= 1) {
      points.forEach((point) => this._renderPoint(point));
      return;
    } else {
      this._renderEmptyMessage();
    }
  }

  _renderPoint(point) {
    // рендеринг одной точки:
    const pointPresenter = new PointPresenter(this._tripList, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
    // после инициализации в _pointPresenter записаны все точки
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.CHANGE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderAll();
        // - обновить список
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderAll();
        // - обновить всю доску
        break;
    }
  }

  _handleModeChange() {
    this._newPointPreseter.destroy();
    // не понял, как это работает
    Object.values(this._pointPresenter)
    .forEach((presenter) => {
      presenter.resetView();
    });
  }

  _clearBoard({resetSortType = false} = {}) {
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

  _renderAll() {
    this._renderSort();
    this._renderList();
    this._renderPoints();
  }
}
