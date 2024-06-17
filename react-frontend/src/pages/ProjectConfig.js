import React, { useEffect, useState, Fragment, useRef } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const steps = [
  "Select an existing project",
  "Location for centers",
  "Course configuration",
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

function CenterEditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = () => {
    const maxId = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) : 0;
    const newId = maxId + 1;

    setRows((oldRows) => [
      ...oldRows,
      {
        id: newId,
        center_name: "",
        center_location: "",
        center_latitude: "",
        center_longitude: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: {
        mode: GridRowModes.Edit,
        fieldToFocus: "center_name",
      },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add center
      </Button>
    </GridToolbarContainer>
  );
}

function CourseEditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = async () => {
    let highestId = 0;
    // Fetch the maximum course ID to find the next ID
    try {
      const response = await fetch("/get_max_course_id");
      const data = await response.json();
      highestId = data.max_course_id;
    } catch (error) {
      console.error("Error fetching the maximum course ID:", error);
    }

    const newId = highestId + 1;

    setRows((oldRows) => [
      ...oldRows,
      {
        id: newId,
        course_id: newId,
        course_name: "",
        course_capacity: 0,
        course_duration: 0,
        course_aim: "",
        course_start_date: dayjs().toISOString(),
        course_end_date: dayjs().add(1, "month").toISOString(),
        center_id: "", // Ensure center_id is set later
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "course_name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add course
      </Button>
    </GridToolbarContainer>
  );
}

function ProjectConfig() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [project, setProject] = useState("");
  const [programName, setProgramName] = useState({ data: [] });
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [rows, setRows] = useState([]);
  const [centers, setCenters] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

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
        if (programName && Array.isArray(programName.data)) {
          setProgramName(programName);
        } else {
          throw new Error("Invalid data format received");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchCenterData = (program_id) => {
    fetch(`/view_center_data?program_id=${program_id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server response not OK");
        }
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        const transformedData = data.map((item) => ({
          id: item[0], // Assuming the first item in the array is center_id
          center_name: item[1],
          center_location: item[2],
          center_latitude: item[3],
          center_longitude: item[4],
        }));
        console.log(transformedData); // Check the transformed data structure
        setRows(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleProjectChange = (event) => {
    const selectedProject = event.target.value;
    setProject(selectedProject);

    // Fetch the program ID based on the selected project name
    fetch(`/get_program_id?program_name=${selectedProject}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server response not OK");
        }
      })
      .then((programData) => {
        if (programData && programData.program_id) {
          setSelectedProgramId(programData.program_id);
          fetchCenterData(programData.program_id); // Fetch centers for the selected program
        } else {
          throw new Error("Invalid program data received");
        }
      })
      .catch((error) => {
        console.error("Error fetching program ID:", error);
      });
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    if (!isLastStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    fetch("/delete_center", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ center_id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error deleting center:", data.error);
        } else {
          console.log("Center deleted successfully:", data);
        }
      })
      .catch((error) => {
        console.error("Error deleting center:", error);
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    fetch(newRow.isNew ? "/add_center" : "/edit_center", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        center_id: updatedRow.id,
        center_name: updatedRow.center_name,
        center_location: updatedRow.center_location,
        center_latitude: updatedRow.center_latitude,
        center_longitude: updatedRow.center_longitude,
        program_id: selectedProgramId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error saving center:", data.error);
        } else {
          console.log("Center saved successfully:", data);
        }
      })
      .catch((error) => {
        console.error("Error saving center:", error);
      });

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const centerColumns = [
    {
      field: "id",
      headerName: "Center ID",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "center_name",
      headerName: "Center Name",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "center_location",
      headerName: "Center Location",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "center_latitude",
      headerName: "Center Latitude",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "center_longitude",
      headerName: "Center Longitude",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: "center",
      align: "center",
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ width: 300 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select a Project
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={project}
                  label="Select a Project"
                  onChange={handleProjectChange}
                >
                  {programName.data &&
                    programName.data.map((program, index) => (
                      <MenuItem key={index} value={program}>
                        {program}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                height: 500,
                width: "100%",
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaders": {
                  textAlign: "center",
                },
                "& .actions": {
                  color: "text.secondary",
                },
                "& .textPrimary": {
                  color: "text.primary",
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={centerColumns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) =>
                  console.error("Error processing row update:", error)
                }
                getRowId={(row) => row.id}
                slots={{
                  toolbar: (props) => <CenterEditToolbar {...props} />,
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel, rows }, // Pass rows state as prop
                }}
              />
            </Box>
          </Box>
        );
      case 2:
        return <CourseGrid selectedProgramId={selectedProgramId} />;
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography>Content for "Step 4 Placeholder"</Typography>
            <p>
              Placeholder content for Step 4. Add any relevant UI elements or
              forms here.
            </p>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
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
                  <h5 className="card-title fw-semibold mb-4">
                    Project Configuration
                  </h5>
                  <div className="card">
                    <div className="card-body p-4">
                      <Box sx={{ width: "100%" }}>
                        <Stepper nonLinear activeStep={activeStep}>
                          {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                              <StepButton
                                color="inherit"
                                onClick={handleStep(index)}
                              >
                                {label}
                              </StepButton>
                            </Step>
                          ))}
                        </Stepper>
                        <div>
                          {allStepsCompleted() ? (
                            <React.Fragment>
                              <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  pt: 2,
                                }}
                              >
                                <Box sx={{ flex: "1 1 auto" }} />
                                <Button onClick={handleReset}>Reset</Button>
                              </Box>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                                Step {activeStep + 1}
                              </Typography>
                              <div>{renderStepContent(activeStep)}</div>
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
                                <Button onClick={handleNext} sx={{ mr: 1 }}>
                                  {isLastStep() ? "Finish" : "Next"}
                                </Button>
                              </Box>
                            </React.Fragment>
                          )}
                        </div>
                      </Box>
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

function CourseGrid({ selectedProgramId }) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [centers, setCenters] = useState([]);
  const dataGridRef = useRef(null);
  const apiRef = useGridApiRef();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!selectedProgramId) return;

      try {
        const response = await fetch(
          `/view_program_details?program_id=${selectedProgramId}`
        );
        const data = await response.json();
        console.log("Program details data:", data);

        const transformedRows = data.centers.flatMap((center) =>
          center.courses.map((course) => ({
            id: course.course_id,
            course_id: course.course_id,
            course_name: course.course_name,
            course_capacity: course.course_capacity,
            course_duration: course.course_duration,
            course_aim: course.course_aim,
            course_start_date: course.course_start_date,
            course_end_date: course.course_end_date,
            center_id: center.center_id,
            center_name: center.center_name,
          }))
        );
        console.log("Transformed Rows:", transformedRows);

        setRows(transformedRows);
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    };

    fetchProgramDetails();
  }, [selectedProgramId]);

  useEffect(() => {
    const fetchCenters = async () => {
      if (!selectedProgramId) return;

      try {
        const response = await fetch(
          `/view_center_data?program_id=${selectedProgramId}`
        );
        const centerData = await response.json();
        console.log("Center data:", centerData);

        const allCenters = centerData.map((center) => ({
          value: center[0],
          label: center[1],
        }));
        console.log("All Centers:", allCenters);

        setCenters(allCenters);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, [selectedProgramId]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleRowEditCommit = (params) => {
    const { id, field, value } = params;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleEditClick = (id) => () => {
    console.log("Edit Clicked:", id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    console.log("Save Clicked:", id);
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    if (!isInEditMode) {
      console.error("The cell is not in edit mode.");
      return;
    }

    // Commit the changes and stop the edit mode
    apiRef.current.stopRowEditMode({ id });

    const rowToSave = rows.find((row) => row.id === id);
    console.log("Data to be saved:", rowToSave);
    if (validateRow(rowToSave)) {
      try {
        const updatedRow = await processRowUpdate(rowToSave);
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === id ? updatedRow : row))
        );
      } catch (error) {
        console.error("Error saving course:", error);
      }
    } else {
      console.error("Invalid data:", rowToSave);
      alert("Please fill in all required fields before saving.");
    }
  };

  const handleDeleteClick = (id) => async () => {
    try {
      await deleteCourse(id);
      setRows((oldRows) => oldRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const getCenterIdByName = async (centerName) => {
    try {
      const response = await fetch(
        `/get_center_id_by_name?center_name=${centerName}`
      );
      const data = await response.json();
      return data.center_id;
    } catch (error) {
      console.error("Error fetching center ID:", error);
      return null;
    }
  };

  const processRowUpdate = async (newRow) => {
    let updatedRow = { ...newRow, isNew: false };

    // Ensure all required fields have default values
    if (!updatedRow.course_name) updatedRow.course_name = "New Course";
    if (!updatedRow.course_capacity) updatedRow.course_capacity = 1;
    if (!updatedRow.course_duration) updatedRow.course_duration = 1;
    if (!updatedRow.center_id) updatedRow.center_id = centers[0]?.value || "";

    console.log("Row update:", updatedRow);

    try {
      const response = await fetch(
        newRow.isNew ? "/add_course" : "/edit_course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedRow,
            program_id: selectedProgramId,
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        console.log("Course saved successfully:", data);
        return updatedRow;
      }
    } catch (error) {
      console.error("Error saving course:", error);
      return newRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const editCourse = async (updatedRow) => {
    try {
      const response = await fetch("/edit_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: updatedRow.course_id,
          course_name: updatedRow.course_name,
          course_capacity: updatedRow.course_capacity,
          course_duration: updatedRow.course_duration,
          course_aim: updatedRow.course_aim,
          course_start_date: updatedRow.course_start_date,
          course_end_date: updatedRow.course_end_date,
          center_id: updatedRow.center_id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update course");
      }

      console.log("Course updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const addCourse = async (newCourse) => {
    console.log("Data being added:", newCourse);
    try {
      const response = await fetch("/add_course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCourse,
          program_id: selectedProgramId,
          center_id: newCourse.center_id || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add course");
      }

      console.log("Course added successfully:", data);
      return {
        ...data,
        id: data.course_id, // Use the course_id from the backend
      };
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  };

  const deleteCourse = async (course_id) => {
    try {
      const response = await fetch("/delete_course", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete course");
      }

      console.log("Course deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  const validateRow = (row) => {
    console.log("Validating row:", row);
    return (
      row.course_name.trim() !== "" &&
      row.course_capacity > 0 &&
      row.course_duration > 0 &&
      row.center_id !== ""
    );
  };

  const columns = [
    {
      field: "course_id",
      headerName: "Course ID",
      width: 100,
      editable: false,
    },
    {
      field: "course_name",
      headerName: "Course Name",
      width: 180,
      editable: true,
    },
    {
      field: "course_capacity",
      headerName: "Course Capacity",
      type: "number",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "course_duration",
      headerName: "Course Duration",
      type: "number",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "course_aim",
      headerName: "Course Aim",
      width: 300,
      editable: true,
    },
    {
      field: "course_start_date",
      headerName: "Course Start Date",
      width: 180,
      editable: true,
      renderCell: (params) => {
        return params.value ? dayjs(params.value).format("MM/DD/YYYY") : "";
      },
      renderEditCell: (params) => (
        <DatePicker
          value={params.value ? dayjs(params.value) : null}
          onChange={(newValue) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue ? newValue.toISOString() : "",
            })
          }
          format="MM/DD/YYYY"
        />
      ),
    },
    {
      field: "course_end_date",
      headerName: "Course End Date",
      width: 180,
      editable: true,
      renderCell: (params) => {
        return params.value ? dayjs(params.value).format("MM/DD/YYYY") : "";
      },
      renderEditCell: (params) => (
        <DatePicker
          value={params.value ? dayjs(params.value) : null}
          onChange={(newValue) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue ? newValue.toISOString() : "",
            })
          }
          format="MM/DD/YYYY"
        />
      ),
    },
    {
      field: "center_id",
      headerName: "Center",
      width: 220,
      editable: true,
      type: "singleSelect",
      valueOptions: centers,
      renderCell: (params) => {
        const center = centers.find((center) => center.value === params.value);
        return center ? center.label : params.value;
      },
      renderEditCell: (params) => {
        const handleChange = (e) => {
          const value = e.target.value;
          console.log("Selected center ID:", value); // Logging selected value
          params.api.setEditCellValue({
            id: params.id,
            field: params.field,
            value: value,
          });
        };

        return (
          <Select value={params.value || ""} onChange={handleChange} fullWidth>
            {centers.map((center) => (
              <MenuItem key={center.value} value={center.value}>
                {center.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            height: 500,
            width: "100%",
            "& .actions": {
              color: "text.secondary",
            },
            "& .textPrimary": {
              color: "text.primary",
            },
          }}
        >
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            onCellEditCommit={handleRowEditCommit}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) =>
              console.error("Error processing row update:", error)
            }
            slots={{
              toolbar: (props) => <CourseEditToolbar {...props} />,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel, rows },
            }}
            getRowId={(row) => row.id}
          />
        </Box>
      </LocalizationProvider>
    </Fragment>
  );
}

export default ProjectConfig;
