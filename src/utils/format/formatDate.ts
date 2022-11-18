import moment from "moment";

export const formatDateToUTC = (dateMillis: number) =>
  moment(dateMillis).format("ll");

export const formatDateToLocal = (
  dateMillis: number,
  format = "MMMM Do YYYY, h:mm a"
) => {
  const local = moment(dateMillis).local().format(format);

  return local;
};

export const formatDateHoursFromNow = (dateMillis?: number) => {
  return moment(dateMillis).endOf("day").fromNow();
};
