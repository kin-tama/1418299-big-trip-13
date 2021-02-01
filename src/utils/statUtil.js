import dayjs from "dayjs";

export const countCost = (data) => {
  const output = {};

  for (const element of data) {
    if (output[element.pointType.toUpperCase()]) {
      output[element.pointType.toUpperCase()] += element.cost;
    } else {
      output[element.pointType.toUpperCase()] = element.cost;
    }
  }

  return output;
};

export const countTypes = (data) => {
  const output = {};

  for (const element of data) {
    if (output[element.pointType.toUpperCase()]) {
      output[element.pointType.toUpperCase()]++;
    } else {
      output[element.pointType.toUpperCase()] = 1;
    }
  }
  return output;
};

export const countTtime = (data) => {
  const output = {};

  for (const element of data) {
    if (output[element.pointType.toUpperCase()]) {
      output[element.pointType.toUpperCase()] += dayjs(element.finishTime).diff(dayjs(element.beginningTime), `m`);
    } else {
      output[element.pointType.toUpperCase()] = dayjs(element.finishTime).diff(dayjs(element.beginningTime), `m`);
    }
  }

  for (const element in output) {
    if (output.hasOwnProperty(element)) {
      output[element] = Math.round(output[element] / 1440);
    }
  }

  return output;
};
