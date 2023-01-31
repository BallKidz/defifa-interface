// Utility function used to build out columns for a table
export const buildColumns = (data: Array<{ [key: string]: any }>) => {
  return Object.keys(data[0]).map((key) => ({
    Header: key,
    accessor: key,
  }));
};
