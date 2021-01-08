import {render, RenderTypes} from "../utils/render.js";
import {updateItem, SortType} from "../utils/common.js";
import {sortDate, sortCost} from "../utils/sort.js";
import SortView from "../view/trip_sort.js";
import ListView from "../view/trip_list.js";
import EmptyView from "../view/empty.js";
import RootPointPresenter from "./point.js";

export default class Board {

  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    // объявляем свойство _pointPresenter - объект, в который будут записываться все точки маршрута по ключу (ID точки).
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._sortComponent = new SortView();
    this._listComponent = new ListView();
    this._emptyComponent = new EmptyView();

    this._tripEvents = document.querySelector(`.trip-events`);
    this._tripEventsHeader = this._tripEvents.querySelector(`.trip-events h2`);
    this._tripMainTripControls = document.querySelector(`.trip-main__trip-controls`);
    this._tripMainTripControlsHeader = this._tripMainTripControls.querySelector(`.trip-main__trip-controls h2`);
  }

  init(points) {
    this._points = points.slice();
    // сделали бэкап точек - скопировали ._points
    this._sourcedPoints = this._points.slice();

    this._renderAll();
  }

  _sortPoints(sortType) {
    // метод сортировки
    // с помощью switch-case выбираем метод сортировки и передаем .sort соответствующий callback (sortDate или sortCost)

    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortDate);
        break;

      case SortType.PRICE:
        this._points.sort(sortCost);
        break;

      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // сортируем задачи (описать функции сортировки в utils)
    // если переданный в _handleSortTypeChange метод сортировки соответствует текущему, ничего не делаем.
    if (this._currentSortType === sortType) {
      return;
    }

    // в противном случае - запускаем this._sortPoints и передаем ему тип сортировки

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPoints();
  }

  _renderSort() {
    // рендер сортировки
    render(RenderTypes.INSERTBEFORE, this._sortComponent.getElement(), this._tripEvents, this._tripEventsHeader.nextSibling);
    this._tripSort = this._tripEvents.querySelector(`.trip-sort`);
    this._sortComponent.setChangeSortTypeHandler(this._handleSortTypeChange);
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
    if (this._points.length >= 1) {
      for (let i = 0; i < this._points.length; i++) {
        this._renderPoint(this._points[i]);
      }
      return;
    } else {
      this._renderEmptyMessage();
    }
  }

  _renderPoint(point) {
    // рендеринг одной точки:
    // 1) создаем новый объект класса RootPointPresenter, передаем ему параметры: точка, контейнер(this._tripList), обработчик (this._handlePointChange)
    const rootPointPresenter = new RootPointPresenter(this._tripList, this._handlePointChange, this._handleModeChange);
    // 2) инициализируем точку - вызываем метод init(), объекта класса RootPointPresenter
    rootPointPresenter.init(point);
    // 3) записываем в свойство this._pointPresenter объект класса RootPointPresenter. В качестве ключа используем ID точки
    this._pointPresenter[point.id] = rootPointPresenter;
    // после инициализации в _pointPresenter записаны все точки
  }

  _handlePointChange(updatedPoint) {
    // в этом методе мы описываем обновление View точки.
    // 1) мы заменяем _points на _points с обновленной точкой с пом. функции updateItem, которую мы описали в common.js
    this._points = updateItem(this._points, updatedPoint);
    // 2) повторно инициализируем _pointPresenter
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    // не понял, как это работает
    Object.values(this._pointPresenter)
    .forEach((presenter) => {
      presenter.resetView();
    });
  }

  _clearPointsList() {
    // не понимаю, как  Object.values + forEach. По идее, в this._pointPresenter у нас находятся все точки как св-ва объекта. Почему нельзя перечислить их?

    Object.values(this._pointPresenter).forEach((pesenter) => {
      pesenter.destroy();
    });
    this._pointPresenter = {};
  }

  _renderAll() {
    this._renderSort();
    this._renderList();
    this._renderPoints();
  }
}
