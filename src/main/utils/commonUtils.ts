export const sleep = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const getCurrentTime = (): string => {
  const date = new Date();
  const year = addFrontZero(date.getFullYear());
  const month = addFrontZero(date.getMonth() + 1);
  const day = addFrontZero(date.getDate());
  const hour = addFrontZero(date.getHours());
  const minute = addFrontZero(date.getMinutes());
  const second = addFrontZero(date.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};

export const addFrontZero = (number: number): string => {
  if (number < 10) {
    return `0${number}`;
  }

  return String(number);
};
