import React, { Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const names = ["Swamiji", "Swami P", "Swami AA", "Swami PVS", "Swami AG"];

const okrs = ["OKR1", "OKR2", "OKR3"];

const handleNotificationClick = () => {
  // Add your functionality here
  console.log("Notification bell clicked!");
  // You can perform additional actions or navigate to another page, etc.
};

function ProjectDetails() {
  const [selectedYear, setSelectedYear] = React.useState(null);
  // const formattedDate = selectedYear ? dayjs(selectedYear).format("YYYY") : "";

  const [projectName, setProjectName] = React.useState("");

  const handleChange = (event) => {
    setProjectName(event.target.value);
  };

  const [selectedOKR, setselectedOKR] = React.useState("");

  const handleOkrChange = (event) => {
    setselectedOKR(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedYear(newDate);
    console.log(newDate);
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
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
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
                      Edit Project Details
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
                          {okrs.map((okrs) => (
                            <MenuItem key={okrs} value={okrs}>
                              {okrs}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <div style={{ marginLeft: "48px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              label="OKR year"
                              views={["year"]}
                              value={selectedYear}
                              onChange={handleDateChange}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
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
