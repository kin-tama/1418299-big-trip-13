import dayjs from "dayjs";
import flatpickr from "flatpickr";
import he from "he";

import {
  routePointsNames,
  routePointsOptionsPrice,
  routePointsTypes,
  POINT_TYPES_MAP,
  OPTIONS_MAP,
  descriptions
} from "../data.js";
import {
  getpointTypes,
  getOptions,
  getRadio
} from "./edit_existing_point.js";
import Smart from "./smart.js";

const createNewPointTemplate = (data) => {

  const {pointType, pointName, beginningTime, finishTime, cost, description, options, photos} = data;

  const getPhotos = (allPhotos) => {
    let element = ``;
    for (let i = 0; i < allPhotos.length; i++) {
      element = element + `<img class="event__photo" src="${allPhotos[i]}" alt="Event photo">`;
    }
    return element;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(pointName)}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${getpointTypes(routePointsNames)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(beginningTime).format(`DD/MM/YY hh:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(finishTime).format(`DD/MM/YY hh:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${cost}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${getOptions(pointType, options, routePointsOptionsPrice)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${getPhotos(photos)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
};

export default class NewPointView extends Smart {

  static parsePointToData(point) {
    return Object.assign(
        {},
        point
    );
  }

  static parseDataToPoint(data) {
    let point = Object.assign({}, data);
    return point;
  }

  constructor(point) {
    super();
    this._data = NewPointView.parsePointToData(point);
    this._startDatepicker = null;
    this._finishDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._changePointNameHandler = this._changePointNameHandler.bind(this);
    this._choosePointTypeHandler = this._choosePointTypeHandler.bind(this);
    this._choosePointOptionsHandler = this._choosePointOptionsHandler.bind(this);
    this._insertPriceHandler = this._insertPriceHandler.bind(this);
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
  }

  getTemplate() {
    return createNewPointTemplate(this._data);
  }


  setClickDeleteHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._clickDeleteHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    // по событию submit на форме вызывается this._formSubmitHandler
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(NewPointView.parseDataToPoint(this._data));
  }

  // метод, устанавливающий eventlistener. Принимает на вход callback (). Callback передается как значение для свойства this._callback.formSubmit
  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._choosePointTypeHandler);
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._choosePointOptionsHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._changePointNameHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._insertPriceHandler);
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
    this.setClickDeleteHandler(this._callback.delete);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _changePointNameHandler(evt) {
    this.updateData({
      pointName: evt.target.value,
      description: descriptions[evt.target.value]
    });
  }

  _choosePointTypeHandler(evt) {
    if (evt.target.type !== `radio`) {
      return;
    }
    evt.preventDefault();

    if (evt.target.checked) {
      this.updateData({
        pointType: POINT_TYPES_MAP[evt.target.value],
        options: {
          "Switch to comfort": false,
          "Add meal": false,
          "Choose seats": false,
          "Travel by train": false,
          "Order Uber": false,
          "Add luggage": false,
          "Rent a car": false
        }
      });
    }
  }

  _insertPriceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      cost: Number(evt.target.value),
    });
  }

  _choosePointOptionsHandler(evt) {
    // изменения options
    if (evt.target.type !== `checkbox`) {
      return;
    }
    evt.preventDefault();

    let currentOptions = Object.assign({}, this._data.options);

    currentOptions[OPTIONS_MAP[evt.target.id]] = evt.target.checked ? routePointsOptionsPrice[OPTIONS_MAP[evt.target.id]] : false;

    this.updateData({
      options: currentOptions
    });
  }

  _clickDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete(NewPointView.parseDataToPoint(this._data));
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
          altFormat: `d/m/y H:i`,
          dateFormat: `d/m/y H:i`,
          defaultDate: 0,
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
          defaultDate: 0,
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
}

