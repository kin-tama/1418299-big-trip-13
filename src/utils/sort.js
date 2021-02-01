import dayjs from "dayjs";

export const sortDuration = (taskA, taskB) => {
  return ((dayjs(taskA.beginningTime).diff(dayjs(taskA.finishTime))) - (dayjs(taskB.beginningTime).diff(dayjs(taskB.finishTime))));
};

export const sortDate = (taskA, taskB) => {
  return dayjs(taskB.beginningTime).diff(dayjs(taskA.beginningTime));
};

export const sortCost = (taskA, taskB) => {
  return (taskB.cost - taskA.cost);
};
