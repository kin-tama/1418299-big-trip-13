import {FilterType} from "../const.js";
import {isPast} from "./pointUtil.js";

export const filterUtil = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => !isPast(point.beginningTime)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.beginningTime)),
};
