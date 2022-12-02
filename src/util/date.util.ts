export const formatDate = (date?: Date, hideMinutes?: boolean) => {
  if (!date) return "";
  let newDate = new Date(date);
  const offset = newDate.getTimezoneOffset();
  newDate = new Date(newDate.getTime() - offset * 60 * 1000);
  if (!hideMinutes) {
    newDate.setSeconds(0, 0);
    return newDate
      .toISOString()
      .replace(/T/, " ")
      .replace(/:00.000Z/, "");
  }
  return newDate.toISOString().split("T")[0];
};
