import React, { Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const names = ["Swamiji", "Swami P", "Swami AA", "Swami PVS", "Swami AG"];

const okrs = ["OKR1", "OKR2", "OKR3"];

const trainers = ["Shyam", "Prasad", "Aswathi"];

const KPIs = ["KPI1", "KPI2", "KPI3"];

const Progress = ["Red", "Yellow", "Green"];

const okrsData = [
  { okr: "OKR 1", date: "2024-04-01", quarterRange: "Apr - May" },
  { okr: "OKR 2", date: "2024-07-01", quarterRange: "May - June" },
  { okr: "OKR 3", date: "2024-10-01", quarterRange: "June - Sept" },
  // Add more OKRs and their corresponding dates and quarter ranges
];

const handleNotificationClick = () => {
  // Add your functionality here
  console.log("Notification bell clicked!");
  // You can perform additional actions or navigate to another page, etc.
};

function ProjectDetails() {
  const [todayDate, settodayDate] = React.useState(dayjs());

  const [projectName, setProjectName] = React.useState("");

  const handleChange = (event) => {
    setProjectName(event.target.value);
  };

  const [selectedOKR, setselectedOKR] = React.useState("");
  const [okrDate, setOkrDate] = React.useState("");
  const [okrQuarterRange, setOkrQuarterRange] = React.useState("");

  const handleOkrChange = (event) => {
    const selectedOKR = event.target.value;
    setselectedOKR(selectedOKR);

    // Find the corresponding OKR data
    const selectedOKRData = okrsData.find((okr) => okr.okr === selectedOKR);
    if (selectedOKRData) {
      setOkrDate(selectedOKRData.date);
      setOkrQuarterRange(selectedOKRData.quarterRange);
    } else {
      // If no corresponding data found, set defaults or clear the fields
      setOkrDate(""); // Set default OKR date
      setOkrQuarterRange(""); // Set default OKR quarter range
    }
  };

  const [trainer, setTrainer] = React.useState("");

  const handleTrainerChange = (event) => {
    setTrainer(event.target.value);
  };

  const [selectedKPI, setselectedKPI] = React.useState("");

  const handleKPIChange = (event) => {
    setselectedKPI(event.target.value);
  };

  const [selectedProgress, setselectedProgress] = React.useState("");

  const handleKPIProgressChange = (event) => {
    setselectedProgress(event.target.value);
  };

  const [projectUpdate, setprojectUpdate] = React.useState("");

  const handleProjectUpdate = (event) => {
    setprojectUpdate(event.target.value);
  };

  const handleSubmit = () => {
    const formData = {
      projectName: projectName,
      OKR: selectedOKR,
      KPI: selectedKPI,
      date: todayDate,
      name: trainer,
      update: projectUpdate,
    };
    console.log("Submitted data:", formData);
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
              <div className="container-fluid">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">
                      Select a Project
                    </h5>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <div>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">
                            Project Name
                          </InputLabel>
                          <Select
                            value={projectName}
                            label="Project Name"
                            onChange={handleChange}
                            sx={{ width: 200 }}
                          >
                            {names.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Box>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">
                      OKR Project Details
                    </h5>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FormControl sx={{ mt: 1 }}>
                        <InputLabel id="demo-simple-select-label">
                          OKR
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedOKR}
                          label="OKR"
                          onChange={handleOkrChange}
                          sx={{ width: 200 }}
                        >
                          {okrsData.map((okrData) => (
                            <MenuItem key={okrData.okr} value={okrData.okr}>
                              {okrData.okr}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <div style={{ marginLeft: "48px" }}>
                        <TextField
                          id="outlined-required"
                          label="OKR Date"
                          color="secondary"
                          name="okrDate"
                          value={okrDate}
                          sx={{ width: 230 }} // Adjust the width as needed
                        />
                      </div>
                      <div style={{ marginLeft: "48px" }}>
                        <TextField
                          id="outlined-required"
                          label="OKR Quarter Range"
                          color="secondary"
                          name="okrQuarterRange"
                          value={okrQuarterRange}
                          sx={{ width: 230 }} // Adjust the width as needed
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">
                      KPI Project Details
                    </h5>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FormControl sx={{ mt: 1 }}>
                        <InputLabel id="demo-simple-select-label">
                          KPI
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedKPI}
                          label="KPI"
                          onChange={handleKPIChange}
                          sx={{ width: 200 }}
                        >
                          {KPIs.map((KPIs) => (
                            <MenuItem key={KPIs} value={KPIs}>
                              {KPIs}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div style={{ marginLeft: 48 }}>
                        <FormControl sx={{ mt: 1 }}>
                          <InputLabel id="demo-simple-select-label">
                            Progress
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedProgress}
                            label="Progress"
                            onChange={handleKPIProgressChange}
                            sx={{ width: 200 }}
                          >
                            {Progress.map((Progress) => (
                              <MenuItem key={Progress} value={Progress}>
                                {Progress}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ marginLeft: 70 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              label="KPI date"
                              value={todayDate}
                              onChange={(newValue) => settodayDate(newValue)}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">
                      Quarter Update
                    </h5>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        required
                        id="outlined"
                        label="Reported By"
                        defaultValue=""
                        name="trainerName"
                        value={trainer}
                        onInput={handleTrainerChange}
                        sx={{ width: 300 }} // Adjust the width as needed
                      />

                      <div style={{ marginLeft: "48px" }}>
                        <TextField
                          id="outlined-required-multiline-flexible"
                          label="Project Update"
                          multiline
                          maxRows={4}
                          name="projectUpdate"
                          value={projectUpdate}
                          onInput={handleProjectUpdate}
                          sx={{ width: 540 }} // Adjust the width as needed
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="centered-button" style={{ marginTop: 40 }}>
                  <Link to="/dashboard">
                    <button
                      type="button"
                      className="btn btn-outline-success m-1"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
}

export default ProjectDetails;
