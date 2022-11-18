import moment from "moment";

export const formatDateToUTC = (dateMillis: number, includeTime?: boolean) => {
  if (!includeTime) {
    return moment(dateMillis).utc().format("ll");
  }
  return moment(dateMillis).utc().format("MMMM Do YYYY, h A");
};

export const formatDateToLocal = (
  dateMillis: number,
  format = "MMMM Do YYYY, h A"
) => {
  const local = moment(dateMillis).local().format(format);

  return local;
};

export const formatDateHoursFromNow = (dateMillis?: number) => {
  return moment(dateMillis).endOf("day").fromNow();
};
