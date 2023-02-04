import useScorecardTable from "../../../hooks/useScorecardData";
import Table from "../../UI/Table";

const SimulatorCreate = () => {
  const { data, columns } = useScorecardTable(process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME);

  return <Table columns={columns} data={data} />;
};

export default SimulatorCreate;
