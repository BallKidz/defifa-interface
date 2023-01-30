import { Fragment } from "react";
import DataTable, { createTheme } from 'react-data-table-component';
import { CurrentScore } from '../../../hooks/read/CurrentScore';

const SimulatorCreate = () => {
  const data: any  = CurrentScore();
  let bulidColumns = []
  for (let key in data[0]) {
    bulidColumns.push({
      name: key
    }
    );
  }
  // TODO: Need to figure out how to dynamically create the selector function.
  let columns = bulidColumns.map(obj => Object.assign({}, obj, { selector: (row: { team: any; }) => row.team }));
  for(let i = 0; i < columns.length; i++) {
    if(columns[i].name === "Teams") {
      columns[i].selector = (row: { Teams: any; }) => row.Teams;
    } else if(columns[i].name === "Mints") {
      columns[i].selector = (row: { Mints: any; }) => row.Mints;
    } else if(columns[i].name === "WCW") {
      columns[i].selector = (row: { WCW: any; }) => row.WCW;
    } else if(columns[i].name === "Divisional") {
      columns[i].selector = (row: { Divisional: any; }) => row.Divisional;
    } else if(columns[i].name === "Conference") {
      columns[i].selector = (row: { Conference: any; }) => row.Conference;
    } else if(columns[i].name === "Final") {
      columns[i].selector = (row: { Final: any; }) => row.Final;
    } else if(columns[i].name === "Total_Points") {
      columns[i].selector = (row: { Total_Points: any; }) => row.Total_Points;
    } else if(columns[i].name === "Accumulated") {
      columns[i].selector = (row: { Accumulated: any; }) => row.Accumulated;
    } else if(columns[i].name === "Redemption") {
      columns[i].selector = (row: { Redemption: any; }) => row.Redemption;
    } else if(columns[i].name === "ROI") {
      columns[i].selector = (row: { ROI: any; }) => row.ROI;
    }
  }

  // createTheme creates a new theme with the given name and overrides
  createTheme('default', {
    background: {
      default: 'transparent',
    },
    text: {
      primary: '#c0b3f0',
      secondary: '#FFFFFF',
      size: '18px', // TODO: This is not working. Want to change the font size.
    },   
  });

  // TODO: Live scorecard could be part of tournament create flow as well as attestation process.
  return (
      <Fragment>
        <DataTable
          title="Expected scores. Not yet attested."
          columns={columns}
          data={data}
          dense
          // See https://react-data-table-component.netlify.app/?path=/docs/api-custom-styles--page
        />
    </Fragment>
  );
};

export default SimulatorCreate;
