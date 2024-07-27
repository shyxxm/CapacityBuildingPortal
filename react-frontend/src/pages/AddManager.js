import React, { Fragment, useState } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "../services/axiosConfig"; // Import the configured Axios instance
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

function AddManager() {
  const [managerData, setManagerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [first_name, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const cleanedData = results.data.filter(
          (manager) =>
            manager.first_name &&
            manager.first_name.trim() &&
            manager.username &&
            manager.username.trim() &&
            manager.password &&
            manager.password.trim()
        );
        console.log(cleanedData); // Log the cleaned data
        setManagerData(cleanedData);
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
    if (!first_name || !username || !password) {
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
      managerData.some(
        (manager) =>
          !manager.first_name || !manager.username || !manager.password
      )
    ) {
      setError("All fields in the CSV file are required");
      return;
    }

    const requests = managerData.map((manager) =>
      axios.post("/add_manager", manager)
    );

    Promise.all(requests)
      .then((responses) => {
        console.log("Managers created successfully:", responses);
        handleClick();
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error creating managers:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate fields
    if (!validateFields()) return;

    axios
      .post("/add_manager", { username, first_name, password })
      .then((response) => {
        handleClick();
        console.log("Manager created successfully:", response.data);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error creating manager:", error);
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
                  <h5 className="card-title fw-semibold mb-4">Add Managers</h5>
                  <div className="card">
                    <div
                      className="card-body p-4"
                      style={{
                        display: "grid",
                        placeItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                          "& > :not(style)": { m: 1, width: "25ch" },
                        }}
                        noValidate
                        autoComplete="off"
                        style={{ width: "100%", maxWidth: "25ch" }}
                      >
                        <TextField
                          id="first-name"
                          label="Enter First Name"
                          variant="outlined"
                          value={first_name}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                        <TextField
                          id="username"
                          label="Enter Username"
                          variant="outlined"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                        />
                        <TextField
                          id="password"
                          label="Enter Password"
                          variant="outlined"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        {error && (
                          <Alert severity="error" sx={{ width: "100%" }}>
                            {error}
                          </Alert>
                        )}
                        <button
                          type="submit"
                          className="btn btn-danger w-40 py-8 fs-4 rounded-2"
                          style={{ width: "100%" }}
                        >
                          Create Manager
                        </button>
                      </Box>
                    </div>
                  </div>
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
                      Manager created successfully
                    </Alert>
                  </Snackbar>
                  <h5 className="card-title fw-semibold mb-4 text-center">
                    or
                  </h5>
                  <div className="card mb-0">
                    <div
                      className="card-body p-4 "
                      style={{ display: "grid", placeItems: "center" }}
                    >
                      <label
                        className="btn btn-info w-40 py-8 fs-4 rounded-2"
                        style={{ width: "20%" }}
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
                      {managerData.length ? (
                        <button
                          className="btn btn-danger w-40 py-8 fs-4 rounded-2"
                          style={{ width: "20%" }}
                          onClick={handleMultiSubmit}
                        >
                          Create {managerData.length} managers
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
    </Fragment>
  );
}

export default AddManager;
