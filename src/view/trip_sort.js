import AbstractView from "./abstract.js";
import {SortType} from "../utils/common.js";

const createSortTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input visually-hidden"  data-sort-type="${SortType.DEFAULT}" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DEFAULT ? `checked` : ``}  >
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input visually-hidden" data-sort-type="${SortType.TIME}" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME ? `checked` : ``}>
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input visually-hidden" data-sort-type="${SortType.PRICE}" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE ? `checked` : ``}>
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn"  for="sort-offer">Offers</label>
  </div>
  </form>`;
};

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  setChangeSortTypeHandler(callback) {
    this._callback.changeSortType = callback;
    this.getElement().addEventListener(`click`, this._changeSortTypeHandler);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _changeSortTypeHandler(evt) {
    if (evt.target.checked !== true) {
      return;
    }

    evt.preventDefault();
    this._callback.changeSortType(evt.target.dataset.sortType);
  }
}
