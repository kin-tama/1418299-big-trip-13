import FiltersView from "../view/filers.js";
import {render, replace, remove, RenderTypes} from "../utils/render.js";
import {UpdateType} from "../utils/common.js";


export default class FilterPresenter {
  constructor(filterContainer, filterRefPoint, FilterModel) {
    this._filterContainer = filterContainer;
    this._filterRefPoint = filterRefPoint;
    this._filterModel = FilterModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    // добавляем Observer
    this._filterModel.addObserver(this._handleModelEvent);

  }

  init() {
    // this._filterModel.getFilter() возвращает выбранный активный фильтр
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(RenderTypes.INSERTBEFORE, this._filterComponent.getElement(), this._filterContainer, this._filterRefPoint);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

}
