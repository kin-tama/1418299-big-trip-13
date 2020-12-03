import dayjs from "dayjs";
import {routePointsNames} from "../data.js";
import {routePointsOptions} from "../data.js";
import {routePointsOptionsPrice} from "../data.js";
import {routePointsTypes} from "../data.js";
import {getpointTypes} from "./edit_existing_point.js";
import {getOptions} from "./edit_existing_point.js";
import {getRadio} from "./edit_existing_point.js";

export const createNewPointTemplate = (point) => {

  const {pointType, pointName, beginningTime, finishTime, cost, description, options, photos} = point;

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
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${getOptions(routePointsOptions, routePointsOptionsPrice, options)}
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
