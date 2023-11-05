export function declOfNum({ number, array }) {
  return array[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
};

export const hideKeyboard = (e) => {
  if (e.key === "Enter") e.target.blur();
};