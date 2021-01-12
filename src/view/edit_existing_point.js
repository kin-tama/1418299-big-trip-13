import dayjs from "dayjs";
import {routePointsNames, routePointsTypes, pointsVsOptions, routePointsOptionsPrice, POINT_TYPES_MAP} from "../data.js";
import Smart from "./smart.js";


export const getpointTypes = (allTypes) => {
  let element = ``;
  for (let i = 0; i < allTypes.length; i++) {
    element = element + `<option value="${allTypes[i]}"></option>`;
  }
  return element;
};

const optionShortly = (index, options) => Object.keys(options)[index].split(` `).slice(-1).toString().toLowerCase();

export const getOptions = (poinType, options, optionsPrice) => {
  if (!poinType || !options) {
    return ``;
  }
  let acceptableOptions = pointsVsOptions[poinType];
  let allOptions = Object.keys(options);
  let chosenOptions = [];

  for (let i = 0; i < allOptions.length; i++) {
    if (options[allOptions[i]] === true) {
      chosenOptions.push(allOptions[i]);
    }
  }

  let element = ``;
  for (let i = 0; i < acceptableOptions.length; i++) {

    element = element + `<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${optionShortly(i, acceptableOptions)}-1" type="checkbox" name="event-offer-
      ${optionShortly(i, acceptableOptions)}" ${options[acceptableOptions[i]] > 0 ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${optionShortly(i, acceptableOptions)}-1">
        <span class="event__offer-title">${acceptableOptions[i]}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${optionsPrice[acceptableOptions[i]]}</span>
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
    <label class="event__type-label  event__type-label--${allTypes[i].toLowerCase()}" for="event-type-${allTypes[i].toLowerCase()}-1">${allTypes[i]}</label>
  </div>`;
  }
  return element;
};

const createEditPointTemplate = (data) => {

  const {pointType, pointName, beginningTime, finishTime, cost, description, options} = data;

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
        ${getOptions(pointType, options, routePointsOptionsPrice)}
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
  constructor(point) {
    super();
    this._data = EditPointView.parsePointToData(point);

    this._changePointNameHandler = this._changePointNameHandler.bind(this);
    this._choosePointTypeHandler = this._choosePointTypeHandler.bind(this);
    // this._checkOptionHandler = this._checkOptionHandler.bind(this);
    this._clickRollupHandler = this._clickRollupHandler.bind(this);
    this._clickResetHandler = this._clickResetHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  // надо ли чем-то дополнить парсеры?
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

  _restoreHandlers() {
    this._setInnerHandlers();
    this.setClickRollupHandler(this._callback.click);
    this.setClickResetHandler(this._callback.reset);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._choosePointTypeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._changePointNameHandler);
    // this.getElement().querySelector(`.event__section--offers`).addEventListener(`change`, this._checkOptionHandler);

  }

  _changePointNameHandler(evt) {
    this.updateData({
      pointName: evt.target.value,
    });
  }

  _choosePointTypeHandler(evt) {
    if (evt.target.type !== `radio`) {
      return;
    }
    evt.preventDefault();

    if (evt.target.checked) {
      this.updateData({
        pointType: POINT_TYPES_MAP[evt.target.value]
      });
    }
  }

  reset(point) {
    this.updateData(
        EditPointView.parseDataToPoint(point)
    );
  }

  // _checkOptionHandler(evt) {
  //   if (evt.target.type !== `checkbox`) {
  //     return;
  //   }
  //   evt.preventDefault();

  //   if (evt.target.checked) {
  //     this.updateData({
  //       options: [OPTIONS_MAP[evt.target.id]]
  //       // не понимаю, как лучше вносить изменения в options. У меня Options - это массив. В коде выше я просто затираю все значения кроме выбранного.
  //       // + мне ещё нужно как-то удалять значение, если !evt.target.checked
  //     });
  //   }
  // }

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
    this._callback.formSubmit(EditPointView.parseDataToPoint(this._data));
  }

  // метод, устанавливающий eventlistener. Принимает на вход callback (). Callback передается как значение для свойства this._callback.formSubmit
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    // по событию submit на форме вызывается this._formSubmitHandler
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
