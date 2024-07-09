import React, { Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const columns = [
  {
    field: "trainee_id",
    headerName: "ID",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainee_name",
    headerName: "Trainee name",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainee_join_date",
    headerName: "Trainee Join Date",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainee_employment",
    headerName: "Trainee Employment",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "program_name",
    headerName: "Program Name",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "course_name",
    headerName: "Course Name",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
];

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete, onEdit } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          No trainees Selected
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : null}
    </Toolbar>
  );
}

function ViewTrainee() {
  const [chartData, setChartData] = useState([]); // Initialize data as an empty array
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [formData, setFormData] = useState({
    trainee_name: "",
    trainee_join_date: "",
    trainee_employment: "",
    program_id: "",
    program_name: "",
    course_id: "",
    course_name: "",
  });
  const [programsCourses, setProgramsCourses] = useState({});
  const [courses, setCourses] = useState([]); // Initialize courses as an empty array

  // function to fetch data
  const fetchData = () => {
    fetch("/view_trainees_sort")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Server response not OK");
        }
      })
      .then((response) => {
        const data = response.data; // Extract the data array from the response
        console.log("Received data:", data);
        // Transform the data into an array of objects with unique IDs
        const transformedData = data.map((item, index) => ({
          id: index + 1, // Use index + 1 as the unique ID (assuming index starts from 0)
          trainee_id: item[0],
          trainee_name: item[1],
          trainee_join_date: new Date(item[2]).toISOString().split("T")[0],
          trainee_employment: item[3],
          program_name: item[4] ?? "Not Enrolled",
          course_name: item[5] ?? "Not Enrolled",
          program_id: item[6] ?? "", // Add program_id
          course_id: item[7] ?? "", // Add course_id
        }));
        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchProgramsCourses = () => {
    fetch("/view_programs_courses")
      .then((res) => res.json())
      .then((response) => {
        setProgramsCourses(response.programs_courses);
      })
      .catch((error) => {
        console.error("Error fetching programs and courses:", error);
      });
  };

  useEffect(() => {
    // Call fetchData and fetchProgramsCourses immediately on component mount
    fetchData();
    fetchProgramsCourses();

    // Set up a periodic fetch
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5000 milliseconds (5 seconds)

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleDelete = () => {
    // Handle deletion of selected rows
    console.log("Deleting rows:", selectedRows);

    // Call the delete API for each selected row
    selectedRows.forEach((id) => {
      fetch(`/delete_trainee`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainee_id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error deleting trainee:", data.error);
          } else {
            console.log("Trainee deleted successfully:", id);
          }
        })
        .catch((error) => {
          console.error("Error deleting trainee:", error);
        });
    });

    // Update the frontend state to remove the deleted rows
    const remainingRows = chartData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setChartData(remainingRows);
    setSelectedRows([]);
  };

  const handleEdit = () => {
    // Handle editing of selected rows
    if (selectedRows.length === 1) {
      const traineeToEdit = chartData.find((row) => row.id === selectedRows[0]);
      setSelectedTrainee(traineeToEdit);
      setFormData({
        ...traineeToEdit,
        program_id: traineeToEdit.program_id || "",
        program_name: traineeToEdit.program_name || "Not Enrolled",
        course_id: traineeToEdit.course_id || "",
        course_name: traineeToEdit.course_name || "Not Enrolled",
      });
      setCourses(
        programsCourses[traineeToEdit.program_id]
          ? programsCourses[traineeToEdit.program_id].courses
          : []
      );
      setEditDialogOpen(true);
    } else {
      console.log("Please select exactly one row to edit.");
    }
  };

  const handleProgramChange = (event) => {
    const program_id = event.target.value;
    const program_name = programsCourses[program_id].program_name;
    setFormData((prev) => ({
      ...prev,
      program_id,
      program_name,
      course_id: "",
      course_name: "",
    }));
    setCourses(programsCourses[program_id]?.courses ?? []);
  };

  const handleCourseChange = (event) => {
    const course_id = event.target.value;
    const course_name = courses.find(
      (course) => course.course_id === course_id
    ).course_name;
    setFormData((prev) => ({ ...prev, course_id, course_name }));
  };

  const handleEditSave = () => {
    console.log("Saving edited trainee:", formData);

    // Call the backend API to update the trainee
    fetch(`/edit_trainee`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error updating trainee:", data.error);
        } else {
          // Refresh data after updating
          fetchData();
          setEditDialogOpen(false);
          setSelectedRows([]);
        }
      })
      .catch((error) => {
        console.error("Error updating trainee:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <Nav />
          {/*  Sidebar End */}
          {/*  Main wrapper */}
          <div className="body-wrapper">
            {/*  Header Start */}
            <Header />
            {/*  Header End */}
            <div className="container-fluid">
              <div className="container-fluid">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold mb-4">
                      Current Trainees
                    </h5>
                    <div className="card">
                      <div className="card-body p-4">
                        <Box
                          sx={{
                            width: "100%",
                            height: 450, // Set a fixed height for the table
                            "& .MuiDataGrid-root": {
                              border: "none",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                              backgroundColor: "#f5f5f5",
                            },
                            "& .MuiDataGrid-footerContainer": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <EnhancedTableToolbar
                            numSelected={selectedRows.length}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                          />
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              rows={chartData} // Use chartData state as rows
                              columns={columns}
                              initialState={{
                                pagination: {
                                  paginationModel: { page: 0, pageSize: 5 },
                                },
                              }}
                              pageSizeOptions={[5, 10]}
                              checkboxSelection
                              onRowSelectionModelChange={(newSelection) =>
                                handleSelectionModelChange(newSelection)
                              }
                              selectionModel={selectedRows}
                              sx={{
                                "& .MuiDataGrid-columnHeaders": {
                                  fontSize: 16,
                                },
                                "& .MuiDataGrid-cell": {
                                  fontSize: 14,
                                },
                              }}
                            />
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
      </>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Trainee</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="trainee_name"
            label="Trainee Name"
            type="text"
            fullWidth
            value={formData.trainee_name}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            name="trainee_join_date"
            label="Trainee Join Date"
            type="date"
            fullWidth
            value={formData.trainee_join_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            name="trainee_employment"
            label="Trainee Employment"
            type="text"
            fullWidth
            value={formData.trainee_employment}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="program-label">Program</InputLabel>
            <Select
              labelId="program-label"
              name="program_id"
              value={formData.program_id}
              onChange={handleProgramChange}
            >
              {Object.entries(programsCourses).map(([program_id, program]) => (
                <MenuItem key={program_id} value={program_id}>
                  {program.program_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              name="course_id"
              value={formData.course_id}
              onChange={handleCourseChange}
              disabled={!formData.program_id}
            >
              {courses.map((course) => (
                <MenuItem key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ViewTrainee;
