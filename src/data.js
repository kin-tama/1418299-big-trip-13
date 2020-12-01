import {getRandomInteger} from "./util.js";
import dayjs from "dayjs";

export const routePointsNames = [
  `Нефтегорск`,
  `Кадычкан`,
  `Хальмер-Ю`,
  `Курша-2`,
  `Молога`,
  `Промышленный`,
  `Старая Губаха`,
  `Бечевинка`,
  `Иультин`,
  `Нижнеянск`,
  `Припять`
];

export const routePointsTypes = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];


export const routePointsOptionsPrice = {
  "Switch to comfort": 30,
  "Add meal": 10,
  "Choose seats": 20,
  "Travel by train": 40,
  "Order Uber": 20,
  "Add luggage": 40,
  "Rent a car": 80
};

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
const MAX_NUMBER_OF_OPTIONS = 4;
const MAX_NUMBER_OF_PHOTOS = 10;
const MAX_COST = 500;

const getRadomDescription = () => {
  let description = routePointsDescriptions[getRandomInteger(0, routePointsDescriptions.length)];

  for (let i = 1; i < getRandomInteger(1, MAX_NUMBER_OF_STATEMENTS); i++) {
    description = description + routePointsDescriptions[getRandomInteger(1, routePointsDescriptions.length - 1)];
  }

  return description;
};

const getRadomOptions = () => {
  let options = [];
  for (let i = 0; i < getRandomInteger(1, MAX_NUMBER_OF_OPTIONS); i++) {
    let randInt = getRandomInteger(1, routePointsOptions.length - 1);
    options[i] = {
      option: routePointsOptions[randInt],
      addCost: routePointsOptionsPrice[routePointsOptions[randInt]]
    };
  }

  return options;
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

export const createNewRoutePoint = (start) => {
  return {
    pointType: routePointsTypes[getRandomInteger(1, routePointsTypes.length - 1)],
    pointName: routePointsNames[getRandomInteger(1, routePointsNames.length - 1)],
    beginningTime: start,
    finishTime: getFinishDate(start),
    cost: getRandomInteger(1, MAX_COST),
    description: getRadomDescription(),
    options: getRadomOptions(),
    photos: getRandomPhotos(MAX_NUMBER_OF_PHOTOS),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

// Тип точки маршрута
// Пункт назначения
// Дата и время начала события
// Дата и время окончания события
// Стоимость. Целое число
// Дополнительные опции
