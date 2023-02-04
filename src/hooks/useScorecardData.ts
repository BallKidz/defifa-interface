import { useState, useEffect } from "react";
import { buildColumns } from "../utils/table/columns";
import { CurrentScore } from "./read/CurrentScore";

interface Column {
  Header: string;
  accessor: string;
}

const useScorecardTable = () => {
  const data = CurrentScore(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    setColumns(buildColumns(data));
  }, [data]);

  return { data, columns };
};

export default useScorecardTable;
