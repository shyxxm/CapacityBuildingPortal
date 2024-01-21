import React, { useState, useEffect, Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { Link } from "react-router-dom";
import { App as BarChart } from "../charts/BarChart.tsx";
import { App as HorizontalBarChart } from "../charts/HorizontalBarChart.tsx";
import { App as AssessBar } from "../charts/Dashboard/Assessment.tsx";
import { App as ImpleBar } from "../charts/Dashboard/Implementation.tsx";
import { App as IncomeBar } from "../charts/Dashboard/Income.tsx";
import { App as PreBar } from "../charts/Dashboard/PreTraining.tsx";

import PreTraining from "../charts/Timeline/PreTraining.tsx";
import ImpleTime from "../charts/Timeline/Implementation.tsx";

import AgeDonut from "../charts/Donut/AgeDonut.tsx";
import TrainerCountDonut from "../charts/Donut/TrainerCount.tsx";
import GenderDonut from "../charts/Donut/GenderDonut.tsx";
import TraineeCountDonut from "../charts/Donut/TraineeCountDonut.tsx";

import GoogleMap from "../maps/GoogleMap.tsx";
import { App as EnrolBar } from "../charts/Dashboard/Enrolment.tsx";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "Completed",
        customerId: "Ongoing",
        amount: "Not started",
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                align="center"
                variant="h6"
                gutterBottom
                component="div"
              >
                Pre-Training
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Mobilization and Needs Assessment</TableCell>
                    <TableCell>Pre-Training</TableCell>
                    <TableCell>Registration</TableCell>
                    <TableCell>Content Development </TableCell>
                    <TableCell>Resource Allocation</TableCell>
                    <TableCell>Research</TableCell>
                    <TableCell>TTT</TableCell>
                    <TableCell>Center Set up</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        Completed
                      </TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell component="th" scope="row">
                        Completed
                      </TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 3 }}>
              <Typography
                align="center"
                variant="h6"
                gutterBottom
                component="div"
              >
                Skill Implementation
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Enrollment</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>Curriculum Progress</TableCell>
                    <TableCell>Monitoring</TableCell>
                    <TableCell>Events</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                      <TableCell>Ongoing</TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 3 }}>
              <Typography
                align="center"
                variant="h6"
                gutterBottom
                component="div"
              >
                Asessment and Certification
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Inspection</TableCell>
                    <TableCell>Internal Assessment</TableCell>
                    <TableCell>Project Assessment</TableCell>
                    <TableCell>Stipend Distribution</TableCell>
                    <TableCell>Certification</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                      <TableCell>Not started</TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 3 }}>
              <Typography
                align="center"
                variant="h6"
                gutterBottom
                component="div"
              >
                Income Generation
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Business Set-up</TableCell>
                    <TableCell>Placement Proofs</TableCell>
                    <TableCell>Follow-up activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell>{historyRow.date}</TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData("Center 1", "Completed", "Ongoing", "Ongoing", "Not Started"),
  createData("Center 2", "Ongoing", "Ongoing", "Ongoing", "Ongoing"),
  createData("Center 3", "Ongoing", "Ongoing", "Ongoing", "Ongoing"),
  createData("Center 4", "Ongoing", "Ongoing", "Ongoing", "Ongoing"),
  createData("Center 5", "Ongoing", "Ongoing", "Ongoing", "Ongoing"),
];

function Dashboard() {
  // State to store the selected phase
  const [selectedPhase, setSelectedPhase] = useState(1);

  // Handle change in dropdown
  const handleSelectChange = (event) => {
    setSelectedPhase(parseInt(event.target.value, 10));
  };

  // Function to determine which BarChart to render
  const renderBarChart = () => {
    switch (selectedPhase) {
      case 1:
        return <PreBar />;
      case 2:
        return <ImpleBar />;
      case 3:
        return <AssessBar />;
      case 4:
        return <IncomeBar />;
      default:
        return <PreBar />;
    }
  };

  // State to store the selected phase
  const [selectedGanttPhase, setSelectedGanttPhase] = useState(1);

  // Handle change in dropdown
  const handleSelectChangeinGantt = (event) => {
    setSelectedGanttPhase(parseInt(event.target.value, 10));
  };

  // Function to determine which BarChart to render
  const renderGanttChart = () => {
    switch (selectedGanttPhase) {
      case 1:
        return <PreTraining />;
      case 2:
        return <ImpleTime />;
      case 3:
        return <PreTraining />;
      case 4:
        return <PreTraining />;
      default:
        return <PreTraining />;
    }
  };

  return (
    <Fragment>
      <>
        {/*  Body Wrapper */}
        <div
          className="page-wrapper"
          id="main-wrapper"
          data-layout="vertical"
          data-navbarbg="skin6"
          data-sidebartype="full"
          data-sidebar-position="fixed"
          data-header-position="fixed"
        >
          {/* Sidebar Start */}
          <Nav></Nav>
          {/*  Sidebar End */}
          {/*  Main wrapper */}
          <div className="body-wrapper">
            {/*  Header Start */}
            <Header></Header>
            {/*  Header End */}
            <div className="container-fluid">
              {/*  Row 1 */}
              <div className="row">
                <div className="col-lg-6 d-flex align-items-strech">
                  <div className="card w-100">
                    <div className="card-body">
                      <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                        <div className="mb-3 mb-sm-0">
                          <h5 className="card-title fw-semibold">
                            Project Level Phase Status Overview
                          </h5>
                        </div>
                        <div>
                          <select
                            className="form-select"
                            onChange={handleSelectChange}
                          >
                            <option value={1}>Pre-Training</option>
                            <option value={2}>Skill Implementation</option>
                            <option value={3}>
                              Assessment and Certification
                            </option>
                            <option value={4}>Income Generation</option>
                          </select>
                        </div>
                      </div>
                      <div className="chart-container">{renderBarChart()}</div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-strech">
                  <div className="card w-100">
                    <div className="card-body">
                      <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                        <div className="mb-3 mb-sm-0">
                          <h5 className="card-title fw-semibold">
                            Stage / Pace of Each Center
                          </h5>
                        </div>
                        <div>
                          <select
                            className="form-select"
                            onChange={handleSelectChangeinGantt}
                          >
                            <option value={1}>Pre-Training</option>
                            <option value={2}>Skill Implementation</option>
                            <option value={3}>
                              Assessment and Certification
                            </option>
                            <option value={4}>Income Generation</option>
                          </select>
                        </div>
                      </div>
                      {renderGanttChart()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 d-flex align-items-strech">
                  <div className="card w-100">
                    <div className="card-body">
                      <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                        <div className="mb-3 mb-sm-0 w-100 text-center">
                          <h5 className="card-title fw-semibold fs-6">
                            Individual Centre Progress
                          </h5>
                        </div>
                      </div>
                      <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              {/* <TableCell>Dessert (100g serving)</TableCell> */}
                              <TableCell>Center Name</TableCell>
                              <TableCell align="right">Pre-Training</TableCell>
                              <TableCell align="right">
                                Skill Implementaion
                              </TableCell>
                              <TableCell align="right">
                                Assessment & Certification
                              </TableCell>
                              <TableCell align="right">
                                Income Generation
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <Row align="right" key={row.name} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 d-flex align-items-strech">
                  <div className="card w-100">
                    <div className="card-body">
                      <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                        <div className="mb-3 mb-sm-0">
                          <h5 className="card-title fw-semibold">
                            Impact-Based Dashboard
                          </h5>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">Trainee Count</h5>
                              <TraineeCountDonut />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">Age Distribution</h5>
                              <AgeDonut />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">
                                Gender Distribution
                              </h5>
                              <GenderDonut />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">Trainer Count</h5>
                              <TrainerCountDonut />
                            </div>
                          </div>
                        </div>
                      </div>

                      <br></br>

                      <div className="row">
                        <div className="col-lg-6 d-flex align-items-strech">
                          <div className="card w-100">
                            <div className="card-body">
                              <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                <div className="mb-3 mb-sm-0">
                                  <h5 className="card-title fw-semibold">
                                    Geographical Distribution of Centers: 4
                                  </h5>
                                </div>
                              </div>
                              <GoogleMap />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 d-flex align-items-strech">
                          <div className="card w-100">
                            <div className="card-body">
                              <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                <div className="mb-3 mb-sm-0">
                                  <h5 className="card-title fw-semibold">
                                    Course Enrolment
                                  </h5>
                                </div>
                              </div>
                              <div className="chart-container2">
                                <EnrolBar />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6 px-6 text-center">
                <p className="mb-0 fs-4">
                  Design and Developed by{" "}
                  <a
                    href="https://adminmart.com/"
                    target="_blank"
                    className="pe-1 text-primary text-decoration-underline"
                  >
                    AdminMart.com
                  </a>{" "}
                  Distributed by <a href="https://themewagon.com">ThemeWagon</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
}

export default Dashboard;
