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
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  FUTURE: `future`,
  PAST: `past`,
  EVERYTHING: `everything`
};

export const MenuItem = {
  TABLE: `Table`,
  STATISTICS: `Stats`,
  NEW_POINT: `NEW_POINT`
};

export const routePointsTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
