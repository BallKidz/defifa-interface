export const unixToDatetimeLocal = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes() + 5}`.padStart(2, "0"); //now + 5 minutes
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const datetimeLocalToUnix = (value: string): number => {
  return Math.floor(new Date(value).getTime() / 1000);
};
