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
import PropTypes from "prop-types";
import axios from "../services/axiosConfig"; // Import the configured Axios instance

const columns = [
  {
    field: "trainer_id",
    headerName: "ID",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainer_name",
    headerName: "First name",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainer_start_date",
    headerName: "Trainer Start Date",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainer_end_date",
    headerName: "Trainer End Date",
    flex: 2,
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
          No Trainers Selected
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

function ViewTrainer() {
  const [chartData, setChartData] = useState([]); // Initialize data as an empty array
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    trainer_name: "",
    trainer_start_date: "",
    trainer_end_date: "",
  });

  // function to fetch data
  const fetchData = () => {
    fetch("/view_trainers_sort")
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
          trainer_id: item[0],
          trainer_name: item[1],
          trainer_start_date: new Date(item[2]).toISOString().split("T")[0],
          trainer_end_date: new Date(item[3]).toISOString().split("T")[0],
        }));
        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Call fetchData immediately on component mount
    fetchData();

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
      fetch("/delete_trainer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainer_id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Error deleting trainer:", data.error);
          } else {
            console.log("Trainer deleted successfully:", id);
          }
        })
        .catch((error) => {
          console.error("Error deleting trainer:", error);
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
      const trainerToEdit = chartData.find((row) => row.id === selectedRows[0]);
      setSelectedTrainer(trainerToEdit);
      setFormData(trainerToEdit);
      setEditDialogOpen(true);
    } else {
      console.log("Please select exactly one row to edit.");
    }
  };

  const handleEditSave = () => {
    console.log("Saving edited trainer:", formData);

    // Call the backend API to update the trainer
    fetch("/edit_trainer", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error updating trainer:", data.error);
        } else {
          console.log("Trainer updated successfully:", formData.id);
          // Update the frontend state to reflect the changes
          setChartData((prevData) =>
            prevData.map((item) => (item.id === formData.id ? formData : item))
          );
          setEditDialogOpen(false);
          setSelectedRows([]);
        }
      })
      .catch((error) => {
        console.error("Error updating trainer:", error);
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
                      Current Trainers
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
        <DialogTitle>Edit Trainer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="trainer_name"
            label="First Name"
            type="text"
            fullWidth
            value={formData.trainer_name}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            name="trainer_start_date"
            label="Trainer Start Date"
            type="date"
            fullWidth
            value={formData.trainer_start_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            name="trainer_end_date"
            label="Trainer End Date"
            type="date"
            fullWidth
            value={formData.trainer_end_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
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

export default ViewTrainer;
