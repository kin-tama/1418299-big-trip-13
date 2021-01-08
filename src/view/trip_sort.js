import AbstractView from "./abstract.js";
import {SortType} from "../utils/common.js";

const createSortTemplate = () => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden"  data-sort-type="${SortType.DEFAULT}" type="radio" name="trip-sort" value="sort-day" checked>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME}" type="radio" name="trip-sort" value="sort-time">
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE}" type="radio" name="trip-sort" value="sort-price">
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn"  for="sort-offer">Offers</label>
  </div>
  </form>`;
};

export default class SortView extends AbstractView {
  constructor() {
    // я забыл, что такое "super()" - нужно пересмотреть лекцию
    super();
    this._changeSortTypeHandler = this._changeSortTypeHandler.bind(this);
  }

  // когда мы делаем сортировку, зачем нам такой каскад методов? нельзя это всё сделать как-то компактнее?
  // 1) в board js мы описываем приватный метод, который отвечает за сортировку (_handleSortTypeChange)
  // 2) через _renderSort() передаем его в качестве коллбэка в setChangeSortTypeHandler, который, в свою очередь,
  // присваивает свойству this._callback.changeSortType этот колбэк,  навешивает eventListener на форму сортировки.
  // 3) далее eventListener вызывает метод _changeSortTypeHandler, который проверяет туда ли мы кликнули,
  // делает evt.preventDefault(); и вызывает this._callback.changeSortType, который мы объявили в предыдущем методе
  // это ад какой-то...

  _changeSortTypeHandler(evt) {
    if (evt.target.checked !== true) {
      return;
    }

    // evt.preventDefault();
    this._callback.changeSortType(evt.target.dataset.sortType);
    // console.log(evt.target.dataset.sortType);
    }

  setChangeSortTypeHandler(callback) {
    this._callback.changeSortType = callback;
    // this.getElement() - это вся форма
    this.getElement().addEventListener(`click`, this._changeSortTypeHandler);
  }

  getTemplate() {
    return createSortTemplate();
  }
}
