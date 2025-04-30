export const sleep = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const getCurrentTime = () => {
  const date = new Date();
  const year = addFrontZero(date.getFullYear());
  const month = addFrontZero(date.getMonth() + 1);
  const day = addFrontZero(date.getDate());
  const hour = addFrontZero(date.getHours());
  const minute = addFrontZero(date.getMinutes());
  const second = addFrontZero(date.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};

export const addFrontZero = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};
