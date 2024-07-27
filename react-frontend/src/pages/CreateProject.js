import React, { useState, useEffect, Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { useNavigate } from "react-router-dom";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "../services/axiosConfig"; // Import the configured Axios instance

import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

const StyledButton = styled("button")(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  }
  & .arrow {
    transform: translateY(-1px);
  }
`
);

const steps = ["Create a Project", "Set OKRs", "Final Steps"];

const names = [
  "Aswathi",
  "Anu",
  "Radhika",
  "Shyam",
  "Amma",
  "Swamiji",
  "Swami P",
  "Swami AA",
  "Swami PVS",
  "Swami AG",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function CreateProject() {
  // Get-Mangager API

  const [getManagers, setGetManagers] = useState({ data: [[]] });

  // Function to fetch manager data
  const fetchData = () => {
    axios
      .get("/view_managers")
      .then((res) => {
        setGetManagers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000); // Fetch every 5000 milliseconds (5 seconds)
    return () => clearInterval(intervalId);
  }, []);

  const [activeStep, setActiveStep] = React.useState(0);
  const [openSnack, setOpenSnack] = React.useState(false);
  const navigate = useNavigate();

  // Goes to the next step in the 3 step process
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(formValues);

    if (activeStep === steps.length - 1) {
      handleClickOpen();
      axios
        .post("/create_project", formValues)
        .then((response) => {
          console.log("Data sent successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
        });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSnackClick = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    navigate("/dashboard");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());
  const [okrNumber, setOkrNumber] = React.useState(null);
  const [kpiNumbers, setKpiNumbers] = React.useState([]);

  const [formValues, setFormValues] = useState({
    projectDescription: "",
    projectName: "",
    personName: [],
    startDate: dayjs().format("DD-MM-YYYY"),
    endDate: dayjs().format("DD-MM-YYYY"),
    okrNumber: null,
    okrValues: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [okrDates, setOkrDates] = useState(
    Array.from({ length: formValues.okrNumber || 0 }, () => dayjs())
  );

  const handleKpiChange = (okrIndex, kpiIndex, kpiData) => {
    const okrKey = `OkrValue${okrIndex + 1}`;

    setFormValues((prevValues) => ({
      ...prevValues,
      okrValues: {
        ...prevValues.okrValues,
        [okrKey]: {
          ...prevValues.okrValues[okrKey],
          KPIs: {
            ...prevValues.okrValues[okrKey]?.KPIs,
            [`Kpi${kpiIndex + 1}`]: {
              ...prevValues.okrValues[okrKey]?.KPIs?.[`Kpi${kpiIndex + 1}`],
              ...kpiData,
            },
          },
        },
      },
    }));
  };

  const handleOkrInputChange = (
    okrIndex,
    value,
    okrDate,
    monthRange,
    kpiNumber
  ) => {
    const okrKey = `OkrValue${okrIndex + 1}`;
    const formattedDate = okrDate ? dayjs(okrDate).format("YYYY") : "";
    const kpiData = {};

    for (let kpiIndex = 0; kpiIndex < kpiNumber; kpiIndex++) {
      kpiData[`Kpi${kpiIndex + 1}`] = {
        KpiName: "",
        KpiDate: null,
      };
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      okrValues: {
        ...prevValues.okrValues,
        [okrKey]: {
          ...prevValues.okrValues[okrKey],
          OkrName: value,
          OkrDate: formattedDate,
          MonthRange: monthRange,
          KPINumber: kpiNumber,
          KPIs: kpiData,
        },
      },
    }));

    setKpiNumbers((prevNumbers) => {
      const updatedNumbers = [...prevNumbers];
      updatedNumbers[okrIndex] = kpiNumber;
      return updatedNumbers;
    });
  };

  const handleSelectChange = (selectedNames) => {
    setPersonName(selectedNames);
    setFormValues((prevValues) => ({
      ...prevValues,
      personName: selectedNames,
    }));
  };

  const okrList = Array.from({ length: okrNumber }, (_, index) => index + 1);

  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <Fragment>
      {/* Body Wrapper */}
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
        <Nav />
        {/* Sidebar End */}
        {/* Main wrapper */}
        <div className="body-wrapper">
          {/* Header Start */}
          <Header />
          {/* Header End */}
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="card-title fw-semibold">
                      Creating a Project
                    </h5>
                  </div>
                  <div></div>
                </div>
                {/* {renderGanttChart()} */}
                <Box sx={{ width: "100%" }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {activeStep === steps.length ? (
                    <React.Fragment>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth={fullWidth}
                        maxWidth={maxWidth}
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Project Creation Summary"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Summary of new project details. Confirm before
                            creating
                          </DialogContentText>

                          <Box sx={{ mt: 2, mb: 4, display: "flex", gap: 2 }}>
                            <TextField
                              error={formValues.projectName === ""}
                              id="standard-read-only-input"
                              defaultValue="Empty Name"
                              label="Project Name"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={formValues.projectName}
                              variant="standard"
                            />

                            <TextField
                              error={formValues.projectDescription === ""}
                              id="standard-read-only-input"
                              label="Project Description"
                              defaultValue="Empty Name"
                              multiline
                              InputProps={{
                                readOnly: true,
                              }}
                              value={formValues.projectDescription}
                              variant="standard"
                              sx={{ width: "70%" }}
                            />
                          </Box>
                          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                            <TextField
                              error={formValues.personName.length === 0}
                              id="standard-read-only-input"
                              label="Project Managers"
                              defaultValue="Empty Name"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={formValues.personName}
                              variant="standard"
                              sx={{ width: "47%" }}
                            />
                            <TextField
                              id="standard-read-only-input"
                              label="Project Start Date"
                              defaultValue="Empty Name"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={formValues.startDate}
                              variant="standard"
                            />
                            <TextField
                              id="standard-read-only-input"
                              label="Project End Date"
                              defaultValue="Empty Name"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={formValues.startDate}
                              variant="standard"
                            />
                          </Box>
                          {Array.from(
                            { length: formValues.okrNumber || 0 },
                            (_, okrIndex) => (
                              <React.Fragment key={okrIndex}>
                                <Box
                                  sx={{
                                    mt: 5,
                                    display: "flex",
                                    gap: 2,
                                    mb: 1,
                                  }}
                                >
                                  <h5>{`Objective Key Result ${
                                    okrIndex + 1
                                  }`}</h5>
                                </Box>

                                <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                                  <TextField
                                    error={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.OkrName === ""
                                    }
                                    id="standard-read-only-input"
                                    label="OKR Name"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    value={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.OkrName
                                    }
                                    variant="standard"
                                    sx={{ width: "47%" }}
                                  />
                                  <TextField
                                    error={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.OkrDate === ""
                                    }
                                    id="standard-read-only-input"
                                    label="OKR Year"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    value={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.OkrDate
                                    }
                                    variant="standard"
                                  />
                                  <TextField
                                    error={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.MonthRange === ""
                                    }
                                    id="standard-read-only-input"
                                    label="OKR Month Range"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    value={
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.MonthRange
                                    }
                                    variant="standard"
                                  />
                                </Box>
                                {Array.from(
                                  {
                                    length:
                                      formValues.okrValues[
                                        `OkrValue${okrIndex + 1}`
                                      ]?.KPINumber || 0,
                                  },
                                  (_, kpiIndex) => (
                                    <Box
                                      key={kpiIndex}
                                      sx={{ mb: 2, display: "flex", gap: 2 }}
                                    >
                                      <TextField
                                        id={`kpi-name-${okrIndex}-${kpiIndex}`}
                                        label={`KPI Name #${kpiIndex + 1}`}
                                        defaultValue="Empty Name"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={
                                          formValues.okrValues[
                                            `OkrValue${okrIndex + 1}`
                                          ]?.KPIs?.[`Kpi${kpiIndex + 1}`]
                                            ?.KpiName
                                        }
                                        variant="standard"
                                        sx={{ width: "70%" }}
                                      />
                                      <TextField
                                        id={`kpi-duration-${okrIndex}-${kpiIndex}`}
                                        label={`Duration of KPI #${
                                          kpiIndex + 1
                                        }`}
                                        defaultValue="Empty Name"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                        value={
                                          formValues.okrValues[
                                            `OkrValue${okrIndex + 1}`
                                          ]?.KPIs?.[`Kpi${kpiIndex + 1}`]
                                            ?.KpiDate
                                        }
                                        variant="standard"
                                      />
                                    </Box>
                                  )
                                )}
                              </React.Fragment>
                            )
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Back</Button>

                          <Button onClick={handleSnackClick} autoFocus>
                            CREATE
                          </Button>

                          <Snackbar
                            open={openSnack}
                            autoHideDuration={3000}
                            onClose={handleSnackClose}
                          >
                            <Alert
                              onClose={handleSnackClose}
                              severity="success"
                              variant="filled"
                              sx={{ width: "100%" }}
                            >
                              You have successfully created a new project!
                            </Alert>
                          </Snackbar>
                        </DialogActions>
                      </Dialog>
                    </React.Fragment>
                  ) : activeStep === 0 ? (
                    // Step 1

                    <React.Fragment>
                      <Typography sx={{ mt: 10, mb: 3, textAlign: "center" }}>
                        Step {activeStep + 1}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          id="outlined-required"
                          label="Project Name"
                          color="secondary"
                          defaultValue="Empty Name"
                          name="projectName"
                          value={formValues.projectName}
                          onInput={handleInputChange}
                          sx={{ width: 500 }} // Adjust the width as needed
                        />
                      </Box>
                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="outlined-required-multiline-flexible"
                          label="Project Description"
                          color="secondary"
                          multiline
                          maxRows={4}
                          name="projectDescription"
                          value={formValues.projectDescription}
                          onChange={handleInputChange}
                          sx={{ width: 500 }} // Adjust the width as needed
                        />
                      </Box>
                      <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Select
                          multiple
                          displayEmpty
                          value={personName}
                          color="secondary"
                          onChange={(event) =>
                            handleSelectChange(event.target.value)
                          }
                          input={<OutlinedInput />}
                          sx={{ width: 500 }} // Adjust the width as needed
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <m>Select Project Managers</m>;
                            }

                            return selected.join(", ");
                          }}
                          MenuProps={MenuProps}
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem disabled value="">
                            <em>Active PMs</em>
                          </MenuItem>
                          {getManagers.data.map((name, index) => (
                            <MenuItem
                              key={index} // Assuming 'name' is unique, you can use 'name' as the key if it's guaranteed to be unique
                              value={name}
                              style={getStyles(name, personName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            components={["DatePicker", "DatePicker"]}
                          >
                            <DatePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) => {
                                setStartDate(newValue);
                                setFormValues((prevValues) => ({
                                  ...prevValues,
                                  startDate: newValue.format("DD-MM-YYYY"),
                                }));
                              }}
                              sx={{ width: 245 }} // Adjust the width as needed
                            />
                            <DatePicker
                              label="End Date"
                              value={endDate}
                              onChange={(newValue) => {
                                setEndDate(newValue);
                                setFormValues((prevValues) => ({
                                  ...prevValues,
                                  endDate: newValue.format("DD-MM-YYYY"),
                                }));
                              }}
                              sx={{ width: 245 }} // Adjust the width as needed
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                        }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </Box>
                    </React.Fragment>
                  ) : activeStep === 1 ? (
                    // Step 2

                    <React.Fragment>
                      <Typography sx={{ mt: 10, mb: 3, textAlign: "center" }}>
                        Step {activeStep + 1}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField
                          required
                          id="outlined-required"
                          label="Project Name"
                          color="secondary"
                          defaultValue=""
                          name="projectName"
                          value={formValues.projectName}
                          onChange={handleInputChange}
                          sx={{ width: 500 }} // Adjust the width as needed
                        />
                      </Box>

                      <Box
                        sx={{
                          mt: 2,
                          mb: 1,
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <NumberInput
                          aria-label="Demo number input"
                          placeholder="Number of OKRs"
                          name="okrNumber"
                          value={okrNumber}
                          onChange={(event, val) => {
                            const value = val === "" ? null : parseInt(val, 10);

                            // Update the okrNumber state
                            setOkrNumber(val);

                            // Update the formValues state
                            setFormValues((prevValues) => ({
                              ...prevValues,
                              okrNumber: value, // Convert to number or keep null
                            }));
                          }}
                          sx={{ width: 500 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          mb: 1,
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <List
                          sx={{
                            width: "100%",
                            maxWidth: 500,
                            bgcolor: "background.paper",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >
                          {Array.from(
                            { length: formValues.okrNumber || 0 },
                            (_, index) => (
                              <ListItem
                                key={index + 1}
                                disableGutters
                                sx={{
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  placeholder={`OKR ${index + 1}`}
                                  value={
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.OkrName || ""
                                  }
                                  sx={{
                                    width: "100%",
                                    textAlign: "center",
                                  }}
                                  onChange={(event) =>
                                    handleOkrInputChange(
                                      index,
                                      event.target.value
                                    )
                                  }
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                        }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </Box>
                    </React.Fragment>
                  ) : activeStep === 2 ? (
                    // Step 3

                    <React.Fragment>
                      <Typography sx={{ mt: 10, mb: 3, textAlign: "center" }}>
                        Step {activeStep + 1}
                      </Typography>
                      {Array.from(
                        { length: formValues.okrNumber || 0 },
                        (_, index) => (
                          <div key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 3,
                                mb: 2,
                              }}
                            >
                              <TextField
                                id={`outlined-required-${index + 1}`}
                                label={`Objective Key Result ${index + 1}`}
                                color="secondary"
                                defaultValue=""
                                value={
                                  formValues.okrValues[`OkrValue${index + 1}`]
                                    ? formValues.okrValues[
                                        `OkrValue${index + 1}`
                                      ].OkrName
                                    : ""
                                }
                                onChange={(event) =>
                                  handleOkrInputChange(
                                    index,
                                    event.target.value
                                  )
                                }
                                sx={{ width: 500 }} // Adjust the width as needed
                              />
                            </Box>

                            <Box
                              sx={{
                                mb: 1,
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    label={`Select year of OKR ${index + 1}`}
                                    views={["year"]}
                                    value={okrDates[index]} // Use individual okrDate for each DatePicker
                                    onChange={(newValue) => {
                                      // Update the individual okrDate for this DatePicker
                                      setOkrDates((prevDates) => {
                                        const newDates = [...prevDates];
                                        newDates[index] = newValue;
                                        return newDates;
                                      });

                                      // Call handleOkrInputChange with the updated okrDate
                                      handleOkrInputChange(
                                        index,
                                        formValues.okrValues[
                                          `OkrValue${index + 1}`
                                        ]?.OkrName || "",
                                        newValue
                                      );
                                    }}
                                    sx={{ width: 500 }}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 3,
                              }}
                            >
                              <TextField
                                label={`Quarterly Month Range for OKR ${
                                  index + 1
                                }`}
                                color="secondary"
                                value={
                                  formValues.okrValues[`OkrValue${index + 1}`]
                                    ?.MonthRange !== undefined
                                    ? formValues.okrValues[
                                        `OkrValue${index + 1}`
                                      ]?.MonthRange
                                    : ""
                                }
                                onChange={(event) =>
                                  handleOkrInputChange(
                                    index,
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.OkrName || "",
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.OkrDate,
                                    event.target.value
                                  )
                                }
                                sx={{ width: 500 }}
                              />
                            </Box>

                            <Box
                              sx={{
                                mt: 2,
                                mb: 4,
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <NumberInput
                                aria-label={`Number of KPIs for OKR ${
                                  index + 1
                                }`}
                                placeholder={`Select Number of KPIs for OKR ${
                                  index + 1
                                }`}
                                value={kpiNumbers[index] || ""}
                                onChange={(event, val) => {
                                  const value =
                                    val === "" ? null : parseInt(val, 10);

                                  // Update the kpiNumbers state with an array of length value
                                  setKpiNumbers((prevNumbers) => {
                                    const updatedNumbers = [...prevNumbers];
                                    updatedNumbers[index] = value;
                                    return updatedNumbers;
                                  });

                                  // Update the formValues state
                                  handleOkrInputChange(
                                    index,
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.OkrName || "",
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.OkrDate,
                                    formValues.okrValues[`OkrValue${index + 1}`]
                                      ?.MonthRange,
                                    value
                                  );
                                }}
                                sx={{ width: 500 }}
                              />
                            </Box>

                            <Box>
                              <Box
                                sx={{
                                  textAlign: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <List
                                  sx={{
                                    width: "100%",
                                    maxWidth: 500,
                                    bgcolor: "background.paper",
                                  }}
                                >
                                  <Typography sx={{ textAlign: "center" }}>
                                    Enter KPI values
                                  </Typography>
                                  {[
                                    ...Array(
                                      Math.max(0, kpiNumbers[index] || 0)
                                    ),
                                  ].map((_, kpiIndex) => (
                                    <ListItem key={kpiIndex} disableGutters>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <TextField
                                          id={`outlined-required-multiline-flexible-${kpiIndex}`}
                                          label={`KPI #${kpiIndex + 1}`}
                                          multiline
                                          color="secondary"
                                          value={
                                            formValues.okrValues[
                                              `OkrValue${index + 1}`
                                            ]?.KPIs?.[`Kpi${kpiIndex + 1}`]
                                              ?.KpiName || ""
                                          }
                                          name={`KPIValue${kpiIndex + 1}`}
                                          onChange={(event) =>
                                            handleKpiChange(index, kpiIndex, {
                                              KpiName: event.target.value,
                                            })
                                          }
                                          maxRows={4}
                                          sx={{ width: 300, mt: 1, mr: 1 }}
                                        />
                                        <Box
                                          sx={{
                                            mt: 1.5,
                                            mb: 2,
                                            textAlign: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <NumberInput
                                            aria-label={`Number of Weeks for KPI #${
                                              kpiIndex + 1
                                            }`}
                                            placeholder="No. of Weeks"
                                            value={
                                              formValues.okrValues[
                                                `OkrValue${index + 1}`
                                              ]?.KPIs?.[`Kpi${kpiIndex + 1}`]
                                                ?.KpiDate || ""
                                            }
                                            onChange={(event, val) => {
                                              const value =
                                                val === ""
                                                  ? null
                                                  : parseInt(val, 10);
                                              handleKpiChange(index, kpiIndex, {
                                                KpiDate: value,
                                              });
                                            }}
                                            sx={{
                                              width: 230,
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    </ListItem>
                                  ))}
                                </List>
                                ;
                              </Box>
                            </Box>
                          </div>
                        )
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                        }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        Step {activeStep + 1}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                        }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </Box>
                    </React.Fragment>
                  )}
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CreateProject;
