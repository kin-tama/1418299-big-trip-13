export const SortType = {
  DEFAULT: `DEFAULT`,
  TIME: `TIME`,
  PRICE: `PRICE`
};

export const UserAction = {
  CHANGE_POINT: `CHANGE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  FUTURE: `future`,
  PAST: `past`,
  EVERYTHING: `everything`
};

export const getRandomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};
