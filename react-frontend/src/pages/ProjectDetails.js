import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";

const Progress = ["Red", "Yellow", "Green"];

function ProjectDetails() {
  const [todayDate, setTodayDate] = useState(dayjs());
  const [projectName, setProjectName] = useState("");
  const [programName, setProgramName] = useState({ data: [] });
  const [okrsData, setOkrsData] = useState([]);
  const [selectedOKR, setSelectedOKR] = useState("");
  const [okrDate, setOkrDate] = useState("");
  const [okrQuarterRange, setOkrQuarterRange] = useState("");
  const [trainer, setTrainer] = useState("");
  const [selectedKPI, setSelectedKPI] = useState("");
  const [selectedProgress, setSelectedProgress] = useState("");
  const [projectUpdate, setProjectUpdate] = useState("");
  const [KPIs, setKPIs] = useState([]); // State for KPIs

  const navigate = useNavigate();

  useEffect(() => {
    fetchProgramName();
  }, []);

  const fetchProgramName = () => {
    fetch("/view_program_name")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server response not OK");
        }
      })
      .then((programName) => {
        setProgramName(programName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchOKRsForProgram = (selectedProgramName) => {
    fetch("/view_okrs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ programName: selectedProgramName }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server response not OK");
        }
      })
      .then((okrs) => {
        console.log("OKRs from server:", okrs);

        const transformedOKRs = okrs.okrs.map((okr) => ({
          okr_name: okr[0],
          okr_year: okr[1],
          okr_quarter: okr[2],
          kpi: okr[3], // Include the KPI here
        }));

        console.log("Transformed OKRs:", transformedOKRs);

        setOkrsData(transformedOKRs);
      })
      .catch((error) => {
        console.error("Error fetching OKRs:", error);
      });
  };

  const handleProjectChange = (event) => {
    const selectedProgramName = event.target.value;
    setProjectName(selectedProgramName);
    setSelectedOKR("");
    fetchOKRsForProgram(selectedProgramName);
  };

  const handleOkrChange = (event) => {
    const selectedOKR = event.target.value;
    setSelectedOKR(selectedOKR);

    // Find the corresponding OKR data
    const selectedOKRData = okrsData.find(
      (okr) => okr.okr_name === selectedOKR
    );
    if (selectedOKRData) {
      // Set OKR data
      setOkrDate(selectedOKRData.okr_year);
      setOkrQuarterRange(selectedOKRData.okr_quarter);

      // Extract and set KPIs from the selected OKR data
      const selectedKPIs = okrsData
        .filter((okr) => okr.okr_name === selectedOKR)
        .map((okr) => okr.kpi); // Accessing the KPI using index 3
      console.log("Selected KPIs:", selectedKPIs);

      setKPIs(selectedKPIs);
    } else {
      // If no corresponding data found, set defaults or clear the fields
      setOkrDate(""); // Set default OKR date
      setOkrQuarterRange(""); // Set default OKR quarter range
      setKPIs([]); // Clear KPIs
    }
  };

  const handleKPIChange = (event) => {
    const selectedKPI = event.target.value;
    setSelectedKPI(selectedKPI);
    console.log(selectedKPI);
  };

  const handleKPIProgressChange = (event) => {
    setSelectedProgress(event.target.value);
  };

  const handleTrainerChange = (event) => {
    setTrainer(event.target.value);
  };

  const handleProjectUpdate = (event) => {
    setProjectUpdate(event.target.value);
  };

  const handleSubmit = () => {
    const formData = {
      projectName: projectName, // Adjusted to string format
      OKR: selectedOKR,
      KPI: selectedKPI,
      progress: selectedProgress,
      date: todayDate,
      name: trainer,
      update: projectUpdate,
    };
    console.log("Submitted data:", formData);
    // Send formData to the backend API
    axios
      .post("/add_progress", formData)
      .then((response) => {
        console.log("Progress added successfully:", response.data);
        navigate("/dashboard"); // Redirect to the dashboard
      })
      .catch((error) => {
        console.error("Error adding progress:", error);
      });
  };

  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <Nav />
      <div className="body-wrapper">
        <Header />
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
                        onChange={handleProjectChange}
                        sx={{ width: 200 }}
                      >
                        {programName.data.map((name, index) => (
                          <MenuItem key={index} value={name}>
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
                    <InputLabel id="demo-simple-select-label">OKR</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedOKR}
                      label="OKR"
                      onChange={handleOkrChange}
                      sx={{ width: 200 }}
                    >
                      {Array.from(
                        okrsData.reduce((uniqueOKRs, okrData) => {
                          // Add the OKR name to the Set if it doesn't already exist
                          uniqueOKRs.add(okrData.okr_name);
                          return uniqueOKRs;
                        }, new Set())
                      ).map((okrName, index) => (
                        <MenuItem key={index} value={okrName}>
                          {okrName}
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
                      sx={{ width: 230 }}
                    />
                  </div>
                  <div style={{ marginLeft: "48px" }}>
                    <TextField
                      id="outlined-required"
                      label="OKR Quarter Range"
                      color="secondary"
                      name="okrQuarterRange"
                      value={okrQuarterRange}
                      sx={{ width: 230 }}
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
                    <InputLabel id="demo-simple-select-label">KPI</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedKPI}
                      label="KPI"
                      onChange={handleKPIChange}
                      sx={{ width: 200 }}
                    >
                      {KPIs.map((kpi, index) => (
                        <MenuItem key={index} value={kpi}>
                          {kpi}
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
                        {Progress.map((progress, index) => (
                          <MenuItem key={index} value={progress}>
                            {progress}
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
                          onChange={(newValue) => setTodayDate(newValue)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Quarter Update</h5>
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
                    />{" "}
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="centered-button" style={{ marginTop: 40 }}>
              <button
                type="button"
                className="btn btn-outline-success m-1"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
