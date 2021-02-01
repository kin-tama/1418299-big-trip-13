import dayjs from "dayjs";

export const isDateEqual = (dateA, dateB) => {
  return dayjs(dateA).isSame(dateB, `D`);
};

export const isPast = (date) => {
  const dateToCompare = dayjs(date);
  const now = dayjs();
  return dateToCompare.isBefore(now);
};

export const isCostEqual = (costA, costB) => {
  return costA === costB;
};

export const getpointsVsOptions = (data) => {
  const pointsVsOptions = {};
  data.forEach((element) => {
    pointsVsOptions[element.type] = element.offers;
  });
  return pointsVsOptions;
};

export const getDataMap = (data) => {
  const optionsList = data.map((element) => element.offers.map((item) => item.title)).flat(1);
  const dataMap = {};
  optionsList.forEach((element) => {
    dataMap[element] = element.split(` `).join(``);
  });
  return dataMap;
};

export const getReverseMap = (data) => {

  const optionsList = data.map((element) => element.offers.map((item) => item.title)).flat(1);
  const dataMap = {};
  optionsList.forEach((element) => {
    dataMap[element.split(` `).join(``)] = element;
  });

  return dataMap;
};

export const getOffersPrices = (data) => {
  const prices = {};
  data.forEach((element) => {
    (element.offers.forEach((item) => {
      prices[item.title] = item.price;
    }));
  });

  return prices;
};

export const blankPoint = () => {
  return {
    pointType: `taxi`,
    pointName: ``,
    beginningTime: dayjs().toDate(),
    finishTime: dayjs().toDate(),
    cost: 0,
    description: ``,
    options: {
    },
    photos: [],
    photosDescription: [],
    isFavorite: false,
  };
};
