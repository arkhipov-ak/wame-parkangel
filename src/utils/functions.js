export function declOfNum({ number, array }) {
  return array[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
};

export const hideKeyboard = (e) => {
  if (e.key === "Enter") e.target.blur();
};

export const renderDay = (date) => {
  return (date.getDate() + ""). length === 1 ? `0${date.getDate()}` : date.getDate();
};

export const renderMonth = (date) => {
  return (date.getMonth() + 1 + "").length === 1  ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
};

export const renderMinutes = (date) => {
  return (date.getMinutes() + "").length === 1 ? `0${date.getMinutes()}` : date.getMinutes();
};