import dayjs from "dayjs";
import AbstractView from "./abstract.js";

const createExistingPointTemplate = (point) => {
  const {pointType, pointName, beginningTime, finishTime, cost, options, isFavorite} = point;

  const getTimeDiff = (start, finish) => {
    let days = finish.diff(start, `day`);
    let hours = finish.diff(start, `hour`) - (days * 24);
    let minutes = finish.diff(start, `minute`) - ((days * 24 + hours) * 60);

    return `${days ? days + `D` : ``} ${hours ? hours + `H ` : ``} ${minutes ? minutes + `M ` : ``}`;
  };

  const getListOfOffers = (offers) => {
    if (!offers) {
      return ``;
    }

    let allOptions = Object.keys(offers);


    let element = ``;
    for (let i = 0; i < allOptions.length; i++) {
      if (offers[allOptions[i]] > 0) {
        element = element + `<li class="event__offer">
        <span class="event__offer-title">${allOptions[i]}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offers[allOptions[i]]}</span>
        </li>`;
      }
    }
    return element;
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(beginningTime).format(`YYYY-MM-DD`)}">${dayjs(beginningTime).format(`MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${pointType} ${pointName}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(beginningTime).format(`YYYY-MM-DD`)}T${dayjs(beginningTime).format(`hh-mm`)}">${dayjs(beginningTime).format(`hh-mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(finishTime).format(`YYYY-MM-DD`)}T${dayjs(finishTime).format(`hh-mm`)}">${dayjs(finishTime).format(`hh-mm`)}</time>
      </p>
      <p class="event__duration">${getTimeDiff(dayjs(beginningTime), dayjs(finishTime))}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${cost}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${getListOfOffers(options)}
    </ul>
    <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;
};

export default class ExistingPointView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createExistingPointTemplate(this._point);
  }

  setFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
