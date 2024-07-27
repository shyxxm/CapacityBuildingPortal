import React, { Fragment, useState } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "../services/axiosConfig"; // Import the configured Axios instance
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Papa from "papaparse";

function AddTrainee() {
  const [traineeData, setTraineeData] = useState([]);
  const [trainee_name, setTraineeName] = useState("");
  const [join_date, setJoinDate] = useState(dayjs());
  const [trainee_employment, setTraineeEmployment] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      transform: (value, header) => {
        if (header === "join_date") {
          return value.replace(/['"]+/g, "");
        }
        return value;
      },
      complete: (results) => {
        console.log(results.data);
        setTraineeData(results.data);
      },
    });
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const validateFields = () => {
    if (!trainee_name || !join_date || !trainee_employment) {
      setError("All fields are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleMultiSubmit = (event) => {
    event.preventDefault();

    // Validate CSV data
    if (
      traineeData.some(
        (trainee) =>
          !trainee.trainee_name ||
          !trainee.join_date ||
          !trainee.trainee_employment
      )
    ) {
      setError("All fields in the CSV file are required");
      return;
    }

    const requests = traineeData.map((trainee) =>
      axios.post("/add_trainee", trainee)
    );

    Promise.all(requests)
      .then((responses) => {
        console.log("Trainees created successfully:", responses);
        handleClick();
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error creating trainees:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate fields
    if (!validateFields()) return;

    axios
      .post("/add_trainee", {
        trainee_name,
        join_date: join_date.format("YYYY-MM-DD"), // Ensure date is properly formatted
        trainee_employment,
      })
      .then((response) => {
        handleClick();
        console.log("Trainee created successfully:", response.data);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error creating trainee:", error);
      });
  };

  return (
    <Fragment>
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
                  <h5 className="card-title fw-semibold mb-4">Add Trainees</h5>
                  <div className="card">
                    <div
                      className="card-body p-4"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          "& > :not(style)": { m: 1, width: "100%" },
                        }}
                        noValidate
                        autoComplete="off"
                        style={{ maxWidth: "400px" }}
                      >
                        <TextField
                          id="trainee-name"
                          label="Trainee Name"
                          variant="outlined"
                          value={trainee_name}
                          onChange={(event) =>
                            setTraineeName(event.target.value)
                          }
                          sx={{ width: "300px" }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              label="Trainee Join Date"
                              value={join_date}
                              onChange={(newValue) => setJoinDate(newValue)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  sx={{ width: "300px" }}
                                />
                              )}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                        <TextField
                          id="trainee-employment"
                          label="Trainee Employment"
                          variant="outlined"
                          value={trainee_employment}
                          onChange={(event) =>
                            setTraineeEmployment(event.target.value)
                          }
                          sx={{ width: "300px" }}
                        />
                        {error && (
                          <Alert severity="error" sx={{ width: "100%" }}>
                            {error}
                          </Alert>
                        )}
                        <button
                          type="submit"
                          className="btn btn-danger w-100 py-8 fs-4 rounded-2"
                          style={{ width: "300px" }}
                        >
                          Create Trainee
                        </button>
                      </Box>
                      <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                      >
                        <Alert
                          onClose={handleClose}
                          severity="success"
                          variant="filled"
                          sx={{ width: "100%" }}
                        >
                          Trainee created successfully
                        </Alert>
                      </Snackbar>
                      <h5 className="card-title fw-semibold mb-4 text-center mt-4">
                        or
                      </h5>
                      <div
                        className="card mb-0"
                        style={{ width: "100%", maxWidth: "400px" }}
                      >
                        <div
                          className="card-body p-4"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <label
                            className="btn btn-info w-100 py-8 fs-4 rounded-2"
                            style={{ width: "300px" }}
                          >
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleFileUpload}
                              style={{ display: "none" }}
                            />
                            Upload CSV
                          </label>
                          <br />
                          {traineeData.length ? (
                            <button
                              className="btn btn-danger w-100 py-8 fs-4 rounded-2"
                              style={{ width: "300px" }}
                              onClick={handleMultiSubmit}
                            >
                              Create {traineeData.length} trainees
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AddTrainee;
