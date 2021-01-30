import dayjs from "dayjs";
import flatpickr from "flatpickr";
import he from "he";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

import {routePointsTypes} from "../const.js";
import {getpointsVsOptions, getDataMap, getReverseMap, getOffersPrices} from '../utils/pointUtil.js';
import Smart from "./smart.js";

export const getpointNames = (allDestinations) => {
  let result = ``;
  allDestinations.forEach((element) => {
    result = result + `<option value="${element.name}"></option>`;
  });

  return result;
};

export const getOptions = (poinType, options, offers) => {
  if (!poinType || !options) {
    return ``;
  }

  let newacceptableOptions = getpointsVsOptions(offers)[poinType];
  let dataMap = getDataMap(offers);
  getOffersPrices(offers);

  for (let i = 0; i < offers.length; i++) {
    if (offers[i].type === poinType) {
      newacceptableOptions = offers[i].offers;
      break;
    }
  }

  let element = ``;

  if (newacceptableOptions.length < 1) {
    element = `<div class="event__available-offers"></div>`;
    return element;
  }

  for (let i = 0; i < newacceptableOptions.length; i++) {
    element = element + `<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" data-custom="${dataMap[newacceptableOptions[i].title]}" id="event-offer-${newacceptableOptions[i].title.split(` `)[newacceptableOptions[i].title.split(` `).length - 1]}-${i}" type="checkbox" name="event-offer-
      ${newacceptableOptions[i].title.split(` `)[newacceptableOptions[i].title.split(` `).length - 1]}" ${options[newacceptableOptions[i].title] ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${newacceptableOptions[i].title.split(` `)[newacceptableOptions[i].title.split(` `).length - 1]}-${i}">
        <span class="event__offer-title">${newacceptableOptions[i].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${newacceptableOptions[i].price}</span>
      </label>
    </div>`;
  }
  return element;
};

export const getRadio = (allNames) => {
  let element = ``;
  for (let i = 0; i < allNames.length; i++) {
    element = element + `<div class="event__type-item">
    <input id="event-type-${allNames[i].toLowerCase()}-${i}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="-${allNames[i].toLowerCase()}">
    <label class="event__type-label  event__type-label--${allNames[i].toLowerCase()}" for="event-type-${allNames[i].toLowerCase()}-${i}">${allNames[i]}</label>
  </div>`;
  }
  return element;
};


const createEditPointTemplate = (data, destinations, offers) => {

  const {
    pointType,
    pointName,
    beginningTime,
    finishTime,
    cost,
    description,
    options,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${getRadio(routePointsTypes)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${pointType}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" ${isDisabled ? `disabled` : ``} name="event-destination" value="${he.encode(pointName)}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${getpointNames(destinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" ${isDisabled ? `disabled` : ``} name="event-start-time" value="${dayjs(beginningTime).format(`DD/MM/YY hh:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" ${isDisabled ? `disabled` : ``} name="event-end-time" value="${dayjs(finishTime).format(`DD/MM/YY hh:mm`)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" ${isDisabled ? `disabled` : ``} name="event-price" value="${cost}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``} >${isSaving ? `Saving...` : `Save`}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${getOptions(pointType, options, offers)}
        </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
      </section>
    </section>
  </form>
  </li>`;
};

export default class EditPointView extends Smart {

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    let point = Object.assign({}, data);
    delete point.isDeleting;
    delete point.isSaving;
    delete point.isDisabled;
    return point;
  }

  constructor(point, destinations, offers) {
    super();
    this._data = EditPointView.parsePointToData(point);
    this._destinations = destinations;
    this._offers = offers;
    this._startDatepicker = null;
    this._finishDatepicker = null;

    this._changePointNameHandler = this._changePointNameHandler.bind(this);
    this._choosePointTypeHandler = this._choosePointTypeHandler.bind(this);
    this._choosePointOptionsHandler = this._choosePointOptionsHandler.bind(this);
    this._clickRollupHandler = this._clickRollupHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._finishDateChangeHandler = this._finishDateChangeHandler.bind(this);
    this._insertPriceHandler = this._insertPriceHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._finishDatepicker) {
      this._finishDatepicker.destroy();
      this._finishDatepicker = null;
    }
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._destinations, this._offers);
  }

  setClickRollupHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickRollupHandler);
  }

  setClickDeleteHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._clickDeleteHandler);
  }

  // метод, устанавливающий eventlistener. Принимает на вход callback (). Callback передается как значение для свойства this._callback.formSubmit
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    // по событию submit на форме вызывается this._formSubmitHandler
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  reset(data) {
    this.updateData(
        EditPointView.parseDataToPoint(data)
    );
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
    this.setClickRollupHandler(this._callback.click);
    this.setClickDeleteHandler(this._callback.delete);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._choosePointTypeHandler);
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._choosePointOptionsHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._changePointNameHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._insertPriceHandler);
  }

  _getPointDescription(pointName) {
    let descriprion;
    for (let i = 0; i < this._destinations.length; i++) {
      if (String(this._destinations[i].name) === String(pointName)) {
        descriprion = this._destinations[i].description;
        break;
      }
    }
    return descriprion;
  }

  _changePointNameHandler(evt) {
    this.updateData({
      pointName: evt.target.value,
      description: this._getPointDescription([evt.target.value])
    });
  }

  _insertPriceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      cost: Number(evt.target.value),
    });
  }

  _choosePointTypeHandler(evt) {
    if (evt.target.type !== `radio`) {
      return;
    }
    evt.preventDefault();

    if (evt.target.checked) {
      this.updateData({
        pointType: evt.target.value.slice(1),
        options: {}
      });
    }
  }

  _choosePointOptionsHandler(evt) {
    // изменения options
    if (evt.target.type !== `checkbox`) {
      return;
    }
    evt.preventDefault();

    let reverseMap = getReverseMap(this._offers);
    let prices = getOffersPrices(this._offers);

    let currentOptions = Object.assign({}, this._data.options);
    // всё работает, но вместо присвоения опции 0, её нужно удалять, а у меня чего-то не выходит. Как это лучше сделать?
    currentOptions[reverseMap[evt.target.dataset.custom]] = evt.target.checked ? prices[reverseMap[evt.target.dataset.custom]] : 0;

    this.updateData({
      options: currentOptions
    });
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          allowInput: true,
          altFormat: `d/m/y H:i`,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.beginningTime,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setFinishDatepicker() {
    if (this._finishDatepicker) {
      this._finishDatepicker.destroy();
      this._finishDatepicker = null;
    }

    this._finishDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          altFormat: `d/m/y H:i`,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.finishTime,
          onChange: this._finishDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([newStartDate]) {
    this.updateData({
      beginningTime: dayjs(newStartDate).toDate()
    });
  }

  _finishDateChangeHandler([newFinishDate]) {
    this.updateData({
      finishTime: dayjs(newFinishDate).toDate()
    });
  }

  _clickRollupHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _clickDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete(EditPointView.parseDataToPoint(this._data));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseDataToPoint(this._data));
  }
}
