import {getRandomInteger} from "./utils/common.js";
import dayjs from "dayjs";

export const routePointsNames = [
  `Paris`,
  `London`,
  `L.A.`,
  `Chicago`,
  `Tokyo`,
  `Baghdad`,
  `New York`,
];

export const POINT_TYPES_MAP = {
  "-check-in": `Check-in`,
  "-sightseeing": `Sightseeing`,
  "-restaurant": `Restaurant`,
  "-taxi": `Taxi`,
  "-bus": `Bus`,
  "-train": `Train`,
  "-ship": `Ship`,
  "-transport": `Transport`,
  "-drive": `Drive`,
  "-flight": `Flight`
};

export const routePointsTypes = Object.values(POINT_TYPES_MAP);

export const pointsVsOptions = {
  "Check-in": [`Add meal`],
  "Sightseeing": [`Travel by train`, `Add meal`, `Rent a car`],
  "Taxi": [`Switch to comfort`],
  "Bus": [`Switch to comfort`, `Choose seats`, `Add luggage`],
  "Transport": [`Rent a car`],
  "Train": [`Add meal`, `Choose seats`, `Add luggage`, `Order Uber`],
  "Ship": [`Add meal`, `Choose seats`, `Add luggage`, `Order Uber`],
  "Drive": [`Rent a car`],
  "Flight": [`Choose seats`, `Add luggage`, `Order Uber`],
  "Restaurant": [`Choose seats`]
};


export const routePointsOptionsPrice = {
  "Switch to comfort": 30,
  "Add meal": 10,
  "Choose seats": 20,
  "Travel by train": 40,
  "Order Uber": 20,
  "Add luggage": 40,
  "Rent a car": 80
};

export const OPTIONS_MAP = {
  "event-offer-comfort-1": `Switch to comfort`,
  "event-offer-meal-1": `Add meal`,
  "event-offer-seats-1": `Choose seats`,
  "event-offer-train-1": `Travel by train`,
  "event-offer-uber-1": `Order Uber`,
  "event-offer-luggage-1": `Add luggage`,
  "event-offer-car-1": `Rent a car`
};

export const OPTIONS_MAP_REVERSE = {
  "Switch to comfort": `event-offer-comfort-1`,
  "Add meal": `event-offer-meal-1`,
  "Choose seats": `event-offer-seats-1`,
  "Travel by train": `event-offer-train-1`,
  "Order Uber": `event-offer-uber-1`,
  "Add luggage": `event-offer-luggage-1`,
  "Rent a car": `event-offer-car-1`
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const routePointsOptions = Object.keys(routePointsOptionsPrice);

const routePointsDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. `,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. `,
  `In rutrum ac purus sit amet tempus. `
];

const MAX_NUMBER_OF_STATEMENTS = 5;
const MAX_NUMBER_OF_PHOTOS = 10;
const MAX_COST = 500;

const getRadomDescription = () => {
  let description = routePointsDescriptions[getRandomInteger(0, routePointsDescriptions.length)];

  for (let i = 1; i < getRandomInteger(1, MAX_NUMBER_OF_STATEMENTS); i++) {
    description = description + routePointsDescriptions[getRandomInteger(1, routePointsDescriptions.length - 1)];
  }

  return description;
};

export const descriptions = {
  "Paris": getRadomDescription(),
  "London": getRadomDescription(),
  "L.A.": getRadomDescription(),
  "Chicago": getRadomDescription(),
  "Tokyo": getRadomDescription(),
  "Baghdad": getRadomDescription(),
  "New York": getRadomDescription()
};

const getRandomPhotos = (number) => {
  let photos = [];
  for (let i = 0; i < number; i++) {
    photos[i] = `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`;
  }
  return photos;
};

export const getStartDate = () => {
  let daysGap = getRandomInteger(7, 14);
  let hoursGap = getRandomInteger(5, 20);
  let minutesGap = getRandomInteger(15, 45);
  return dayjs().add(daysGap, `day`).add(hoursGap, `hour`).add(minutesGap, `minute`).toDate();
};

export const getFinishDate = (start) => {
  let daysGap = getRandomInteger(7, 14);
  let hoursGap = getRandomInteger(1, 6) * 4;
  let minutesGap = getRandomInteger(1, 4) * 15;
  return dayjs(start).add(daysGap, `day`).add(hoursGap, `hour`).add(minutesGap, `minute`).toDate();
};

class PointData {
  constructor() {
    this.pointType = routePointsTypes[getRandomInteger(1, routePointsTypes.length - 1)];
    this.pointName = routePointsNames[getRandomInteger(1, routePointsNames.length - 1)];
  }

  _switchGenerator() {
    if (this.pointType === `Bus` || this.pointType === `Taxi`) {
      return getRandomInteger(0, 1) === 1 ? 30 : false;
    }
    return false;
  }

  _mealGenerator() {
    if (this.pointType === `Check-in` || this.pointType === `Sightseeing` || this.pointType === `Train` || this.pointType === `Ship`) {
      return getRandomInteger(0, 1) === 1 ? 10 : false;
    }
    return false;
  }

  _seatsGenerator() {
    if (this.pointType === `Bus` || this.pointType === `Train` || this.pointType === `Ship` || this.pointType === `Flight` || this.pointType === `Restaurant`) {
      return getRandomInteger(0, 1) === 1 ? 20 : false;
    }
    return false;
  }

  _trainGenerator() {
    if (this.pointType === `Sightseeing`) {
      return getRandomInteger(0, 1) === 1 ? 40 : false;
    }
    return false;
  }

  _uberGenerator() {
    if (this.pointType === `Flight` || this.pointType === `Ship` || this.pointType === `Train`) {
      return getRandomInteger(0, 1) === 1 ? 20 : false;
    }
    return false;
  }

  _luggageGenerator() {
    if (this.pointType === `Bus` || this.pointType === `Train` || this.pointType === `Ship` || this.pointType === `Flight`) {
      return getRandomInteger(0, 1) === 1 ? 40 : false;
    }
    return false;
  }

  _carGenerator() {
    if (this.pointType === `Drive` || this.pointType === `Transport` || this.pointType === `Sightseeing`) {
      return getRandomInteger(0, 1) === 1 ? 80 : false;
    }
    return false;
  }

  createNewRoutePoint(start) {
    return {
      id: generateId(),
      pointType: this.pointType,
      pointName: this.pointName,
      beginningTime: start,
      finishTime: getFinishDate(start),
      cost: getRandomInteger(1, MAX_COST),
      description: descriptions[this.pointName],
      options: {
        "Switch to comfort": this._switchGenerator(),
        "Add meal": this._mealGenerator(),
        "Choose seats": this._seatsGenerator(),
        "Travel by train": this._trainGenerator(),
        "Order Uber": this._uberGenerator(),
        "Add luggage": this._luggageGenerator(),
        "Rent a car": this._carGenerator()
      },
      photos: getRandomPhotos(MAX_NUMBER_OF_PHOTOS),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    };
  }
}

export const createNewRoutePoint = (start) => {
  let newPoint = new PointData();
  return newPoint.createNewRoutePoint(start);
};

export const blankPoint = {
  id: generateId(),
  pointType: `Taxi`,
  pointName: ``,
  beginningTime: dayjs(),
  finishTime: getFinishDate(dayjs()),
  cost: 0,
  description: ``,
  options: {
    "Switch to comfort": false,
    "Add meal": false,
    "Choose seats": false,
    "Travel by train": false,
    "Order Uber": false,
    "Add luggage": false,
    "Rent a car": false
  },
  photos: getRandomPhotos(MAX_NUMBER_OF_PHOTOS),
  isFavorite: Boolean(getRandomInteger(0, 1)),
};
