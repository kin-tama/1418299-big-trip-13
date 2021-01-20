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

