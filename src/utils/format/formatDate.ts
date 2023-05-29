import moment from "moment";

export const formatMillistoMoment = (dateMillis: number) => {
  return moment.unix(dateMillis);
};

export const formatSecondsToMoment = (seconds: number, fromDate: number) => {
  let start = moment.unix(fromDate);
  return moment(start).subtract(seconds, "seconds");
};

export const formatSecondsToUTC = (
  seconds: number,
  fromDate: number,
  includetime?: boolean
) => {
  let start = moment.unix(fromDate);
  let date = moment(start).subtract(seconds, "seconds");
  if (!includetime) {
    return moment(date).utc().format();
  }
  return moment(date).utc().format("MMMM Do YYYY, HH:mm");
};

export const formatSecondsToLocal = (
  seconds: number,
  fromDate: number,
  format = "MMMM Do YYYY, HH:mm"
) => {
  let start = moment.unix(fromDate);
  let date = moment(start).subtract(seconds, "seconds");

  return moment(date).local().format(format);
};

export const formatDateToUTC = (dateMillis: number, includeTime?: boolean) => {
  if (!includeTime) {
    return moment(dateMillis).utc().format("ll");
  }
  return moment(dateMillis).utc().format("MMMM Do YYYY, HH:mm");
};

export const formatDateToLocal = (
  dateMillis: number,
  format = "MMMM Do YYYY, HH:mm"
) => {
  const local = moment(dateMillis).local().format(format);

  return local;
};
