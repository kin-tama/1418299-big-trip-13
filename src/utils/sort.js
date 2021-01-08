import dayjs from "dayjs";

export const sortDate = (taskA, taskB) => {
  return dayjs(taskB.beginningTime).diff(dayjs(taskA.beginningTime));
}

export const sortCost = (taskA, taskB) => {
  return (taskB.cost - taskA.cost);
}
