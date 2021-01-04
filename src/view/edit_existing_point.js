import dayjs from "dayjs";
import {routePointsNames} from "../data.js";
import {routePointsOptions} from "../data.js";
import {routePointsOptionsPrice} from "../data.js";
import {routePointsTypes} from "../data.js";
import AbstractView from "./abstract.js";


export const getpointTypes = (allTypes) => {
  let element = ``;
  for (let i = 0; i < allTypes.length; i++) {
    element = element + `<option value="${allTypes[i]}"></option>`;
  }
  return element;
};

const optionShortly = (index, allOptions) => allOptions[index].split(` `).slice(-1).toString().toLowerCase();

const getExistingOptions = (options) => {
  let existingOptions = [];
  options.forEach((element) => {
    existingOptions.push(element.option);
  });
  return existingOptions;
};

export const getOptions = (allOptions, optionsPrice, options) => {
  let element = ``;
  for (let i = 0; i < allOptions.length; i++) {
    element = element + `<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${optionShortly(i, allOptions)}-1" type="checkbox" name="event-offer-${optionShortly(i, allOptions)}" ${getExistingOptions(options).includes(allOptions[i]) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${optionShortly(i, allOptions)}-1">
        <span class="event__offer-title">${allOptions[i]}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${optionsPrice[allOptions[i]]}</span>
      </label>
    </div>`;
  }
  return element;
};

export const getRadio = (allTypes) => {
  let element = ``;
  for (let i = 0; i < allTypes.length; i++) {
    element = element + `<div class="event__type-item">
    <input id="event-type-${allTypes[i].toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="-${allTypes[i].toLowerCase()}">
    <label class="event__type-label  event__type-label--${allTypes[i].toLowerCase()}" for="event-type-taxi-1">${allTypes[i]}</label>
  </div>`;
  }
  return element;
};

const createEditPointTemplate = (point) => {

  const {pointType, pointName, beginningTime, finishTime, cost, description, options} = point;

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointName}" list="destination-list-1">
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${getOptions(routePointsOptions, routePointsOptionsPrice, options)}
        </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
      </section>
    </section>
  </form>
  </li>`;
};

export default class EditPointView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._clickRollupHandler = this._clickRollupHandler.bind(this);
    this._clickResetHandler = this._clickResetHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  _clickRollupHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickRollupHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickRollupHandler);
  }

  _clickResetHandler(evt) {
    evt.preventDefault();
    this._callback.reset();
  }

  setClickResetHandler(callback) {
    this._callback.reset = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._clickResetHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._point);
  }

  // метод, устанавливающий eventlistener. Принимает на вход callback (). Callback передается как значение для свойства this._callback.formSubmit
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    // по событию submit на форме вызывается this._formSubmitHandler
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
