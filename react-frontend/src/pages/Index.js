import React, { useState, useEffect, Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { App as AssessBar } from "../charts/Dashboard/Assessment.tsx";
import { App as ImpleBar } from "../charts/Dashboard/Implementation.tsx";
import { App as IncomeBar } from "../charts/Dashboard/Income.tsx";
import { App as PreBar } from "../charts/Dashboard/PreTraining.tsx";

import CentreTable from "../charts/Dashboard/CentreTable.tsx";

import PreTraining from "../charts/Timeline/PreTraining.tsx";
import ImpleTime from "../charts/Timeline/Implementation.tsx";

import AgeDonut from "../charts/Donut/AgeDonut.tsx";
import TrainerCountDonut from "../charts/Donut/TrainerCount.tsx";
import GenderDonut from "../charts/Donut/GenderDonut.tsx";
import TraineeCountDonut from "../charts/Donut/TraineeCountDonut.tsx";

import GoogleMap from "../maps/GoogleMap.tsx";
import { App as EnrolBar } from "../charts/Dashboard/Enrolment.tsx";

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
                      <CentreTable />
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
                        <div className="col-md-4 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">
                                Age Distribution of Trainees
                              </h5>
                              <AgeDonut />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 d-flex">
                          <div className="card flex-fill">
                            <div className="card-body d-flex flex-column">
                              <h5 className="text-center">
                                Gender Distribution
                              </h5>
                              <GenderDonut />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 d-flex">
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
                    href="https://ammachilabs.org/"
                    target="_blank"
                    className="pe-1 text-primary text-decoration-underline"
                  >
                    AMMACHI Labs
                  </a>{" "}
                  {/* Distributed by <a href="https://themewagon.com">ThemeWagon</a> */}
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
