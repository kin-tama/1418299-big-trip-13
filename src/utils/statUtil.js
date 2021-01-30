import dayjs from "dayjs";

export const countCost = (data) => {
  let output = {};
  for (let i = 0; i < data.length; i++) {
    if (output[data[i].pointType.toUpperCase()]) {
      output[data[i].pointType.toUpperCase()] += data[i].cost;
    } else {
      output[data[i].pointType.toUpperCase()] = data[i].cost;
    }
  }
  return output;
};

export const countTypes = (data) => {
  let output = {};
  for (let i = 0; i < data.length; i++) {
    if (output[data[i].pointType.toUpperCase()]) {
      output[data[i].pointType.toUpperCase()]++;
    } else {
      output[data[i].pointType.toUpperCase()] = 1;
    }
  }
  return output;
};

export const countTtime = (data) => {
  let output = {};
  for (let i = 0; i < data.length; i++) {
    if (output[data[i].pointType.toUpperCase()]) {
      output[data[i].pointType.toUpperCase()] += dayjs(data[i].finishTime).diff(dayjs(data[i].beginningTime), `m`);
    } else {
      output[data[i].pointType.toUpperCase()] = dayjs(data[i].finishTime).diff(dayjs(data[i].beginningTime), `m`);
    }
  }

  for (let element in output) {
    if (output.hasOwnProperty(element)) {
      output[element] = Math.round(output[element] / 1440);
    }
  }

  return output;
};
