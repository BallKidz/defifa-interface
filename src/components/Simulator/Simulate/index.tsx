import useScorecardTable from "../../../hooks/useScorecardData";
import Table from "../../UI/Table";

const SimulatorCreate = () => {
  const { data, columns } = useScorecardTable();

  return <Table columns={columns} data={data} />;
};

export default SimulatorCreate;
