import AbstractView from "./abstract.js";

const createFiltersTemplate = (filter) => {
  const type = filter;

  return `<form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-everything"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="everything" ${type === `everything` ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-future"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="future"
    ${type === `future` ? `checked` : ``}
    >
    <label class="trip-filters__filter-label" for="filter-future">Future</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-past"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="past"
    ${type === `past` ? `checked` : ``}
    >
    <label class="trip-filters__filter-label" for="filter-past">Past</label>
  </div>

  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filter);
  }


  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
