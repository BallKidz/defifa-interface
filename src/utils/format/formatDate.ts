import moment from "moment";

export const formatSecondsToUTC = (
  seconds: number,
  fromDate: number,
  includetime?: boolean
) => {
  const future_unix_timestamp = fromDate;
  const future = moment.unix(future_unix_timestamp);
  const duration = moment.duration(seconds, "seconds");
  const new_unix_timestamp = moment(future).subtract(duration).unix();
  const date = moment.unix(new_unix_timestamp).toDate();
  if (!includetime) {
    return moment(date).utc().format("ll");
  }
  return moment(date).utc().format("MMMM Do YYYY, h A");
};

export const formatSecondsToLocal = (
  seconds: number,
  fromDate: number,
  format = "MMMM Do YYYY, HH:mm"
) => {
  const future_unix_timestamp = fromDate;
  const future = moment.unix(future_unix_timestamp);
  const duration = moment.duration(seconds, "seconds");
  const new_unix_timestamp = moment(future).subtract(duration).unix();
  const date = moment.unix(new_unix_timestamp).toDate();

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

export const formatDateHoursFromNow = (dateMillis?: number) => {
  return moment(dateMillis).endOf("day").fromNow();
};
