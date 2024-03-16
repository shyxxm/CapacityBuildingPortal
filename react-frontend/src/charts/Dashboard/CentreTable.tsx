import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  name: string,
  preTrainingData: string,
  skImplementationData: string,
  certificationData: string,
  incomeData: string
) {
  // Split the string data by comma and convert it to an array of JSX elements
  const preTrainingDataElements = preTrainingData
    .split(",") //split data by comma
    .map(
      (
        item,
        index,
        array //iterate over each element in the array
      ) => (
        <React.Fragment key={index}>
          {item}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      )
    );

  const skImplementationDataElements = skImplementationData
    .split(",") //split data by comma
    .map(
      (
        item,
        index,
        array //iterate over each element in the array
      ) => (
        <React.Fragment key={index}>
          {item}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      )
    );

  const certificationDataElements = certificationData
    .split(",")
    .map((item, index, array) => (
      <React.Fragment key={index}>
        {item}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));

  const incomeDataElements = incomeData.split(",").map((item, index, array) => (
    <React.Fragment key={index}>
      {item}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  return {
    name,
    preTrainingData: preTrainingDataElements,
    skImplementationData: skImplementationDataElements,
    certificationData: certificationDataElements,
    incomeData: incomeDataElements,
  };
}

const rows = [
  createData(
    "Centre 1",
    "MNA - Completed, Pre-Training - Ongoing",
    "Enrolment - Completed, Curriculum Progress - Ongoing",
    "Inspection - Ongoing, Stipend Distribution - Completion",
    "Curriculum Progress - Ongoing"
  ),
  createData(
    "Centre 2",
    "MNA - Completed, Pre-Training - Ongoing",
    "Enrolment - Completed, Curriculum Progress - Ongoing",
    "Certification - Ongoing",
    "Follow-up Activity - Ongoing"
  ),
  createData(
    "Centre 3",
    "MNA - Completed, Pre-Training - Ongoing",
    "Enrolment - Completed, Curriculum Progress - Ongoing",
    "Curriculum Progress - Ongoing",
    "Placement Proofs - Ongoing"
  ),
  createData(
    "Centre 4",
    "MNA - Completed, Pre-Training - Ongoing",
    "Enrolment - Completed, Curriculum Progress - Ongoing",
    "Internal Assessment - Ongoing, Inspection - Completed, Stipend Distribution - Completed, Certification - Ongoing",
    "Curriculum Progress - Ongoing"
  ),
  createData(
    "Centre 5",
    "Center Setup - Completed, TTT - Ongoing, Resource Allocation - Completed",
    "",
    "Project Assessment - Ongoing",
    "Curriculum Progress - Ongoing"
  ),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Centre Name</TableCell>
            <TableCell align="right">Pre-Training</TableCell>
            <TableCell align="right">Skill Implementation</TableCell>
            <TableCell align="right">Assessment and Certification</TableCell>
            <TableCell align="right">Income Generation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.preTrainingData}</TableCell>
              <TableCell align="right">{row.skImplementationData}</TableCell>
              <TableCell align="right">{row.certificationData}</TableCell>
              <TableCell align="right">{row.incomeData}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
