import moment from "moment";

export const formatDateToUTC = (dateMillis: number, format = "MMM D, YYYY") =>
  moment(dateMillis).utc().format("ll");
