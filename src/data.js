import {getRandomInteger} from "./utils/common.js";
import dayjs from "dayjs";


export const routePointsTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const blankPoint = () => {
  return {
    pointType: `taxi`,
    pointName: ``,
    beginningTime: dayjs(),
    finishTime: dayjs(),
    cost: 0,
    description: ``,
    options: {
      "Choose meal": 180,
      "Upgrade to comfort class": 50
    },
    photos: [],
    photoDescription: [],
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

