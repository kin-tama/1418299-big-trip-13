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
  let pointsVsOptions = {};
  data.forEach((element) => {
    pointsVsOptions[element.type] = element.offers;
  });
  return pointsVsOptions;
};

export const getDataMap = (data) => {
  let optionsList = [];
  data.forEach((element) => {
    (element.offers.forEach((item) => {
      optionsList.push(item.title);
    }));
  });
  let dataMap = {};
  for (let i = 0; i < optionsList.length; i++) {
    dataMap[optionsList[i]] = optionsList[i].split(` `).join(``);
  }
  return dataMap;
};

export const getReverseMap = (data) => {
  let optionsList = [];
  data.forEach((element) => {
    (element.offers.forEach((item) => {
      optionsList.push(item.title);
    }));
  });
  let dataMap = {};
  for (let i = 0; i < optionsList.length; i++) {
    dataMap[optionsList[i].split(` `).join(``)] = optionsList[i];
  }
  return dataMap;
};

export const getOffersPrices = (data) => {
  let prices = {};
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
      "Choose meal": 180,
      "Upgrade to comfort class": 50
    },
    photos: [],
    photoDescription: [],
    isFavorite: false,
  };
};

