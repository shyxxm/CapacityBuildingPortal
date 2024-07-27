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
import Alert from "@mui/material/Alert";
import axios from "../services/axiosConfig"; // Import the configured Axios instance

const columns = [
  {
    field: "manager_id",
    headerName: "ID",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "manager_name",
    headerName: "First name",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "manager_username",
    headerName: "Username",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
  },
];

function EnhancedTableToolbar(props) {
  const { numSelected, onDelete, onEdit, errorMessage } = props;

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
          No Managers Selected
        </Typography>
      )}

      {errorMessage && (
        <Box
          sx={{
            flex: "1 1 100%",
            mt: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Box>
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

function ViewManager() {
  const [chartData, setChartData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    manager_id: "",
    manager_name: "",
    manager_username: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = () => {
    axios
      .get("/view_managers_sort")
      .then((response) => {
        const data = response.data.data; // Extract the data array from the response
        console.log("Received data:", data);
        // Transform the data into an array of objects with unique IDs
        const transformedData = data.map((item) => ({
          id: item[0], // Use the manager_id as the unique id
          manager_id: item[0],
          manager_name: item[1],
          manager_username: item[2],
        }));
        setChartData(transformedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log("Selected rows:", newSelection);
  };

  const handleDelete = () => {
    console.log("Deleting rows:", selectedRows);

    selectedRows.forEach((manager_id) => {
      axios
        .delete("/delete_manager", {
          data: { manager_id },
        })
        .then((response) => {
          if (response.data.error) {
            console.error("Error deleting manager:", response.data.error);
          } else {
            console.log("Manager deleted successfully:", manager_id);
          }
        })
        .catch((error) => {
          console.error("Error deleting manager:", error);
        });
    });

    const remainingRows = chartData.filter(
      (row) => !selectedRows.includes(row.manager_id)
    );
    setChartData(remainingRows);
    setSelectedRows([]);
  };

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      const managerToEdit = chartData.find(
        (row) => row.manager_id === selectedRows[0]
      );
      setFormData(managerToEdit);
      setEditDialogOpen(true);
      setErrorMessage(""); // Clear any previous error message
    } else {
      setErrorMessage("Please select exactly one row to edit.");
    }
  };

  const handleEditSave = () => {
    console.log("Saving edited manager:", formData);

    // Call the backend API to update the manager
    axios
      .put("/edit_manager", formData)
      .then((response) => {
        if (response.data.error) {
          console.error("Error updating manager:", response.data.error);
        } else {
          console.log("Manager updated successfully:", formData.manager_id);
          // Update the frontend state to reflect the changes
          setChartData((prevData) =>
            prevData.map((item) =>
              item.manager_id === formData.manager_id ? formData : item
            )
          );
          setEditDialogOpen(false);
          setSelectedRows([]);
        }
      })
      .catch((error) => {
        console.error("Error updating manager:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            <div className="card">
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">
                  Current Managers
                </h5>
                <div className="card">
                  <div className="card-body p-4">
                    <Box sx={{ width: "100%", height: 600 }}>
                      <EnhancedTableToolbar
                        numSelected={selectedRows.length}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        errorMessage={errorMessage}
                      />
                      <div style={{ height: "100%", width: "100%" }}>
                        <DataGrid
                          rows={chartData}
                          columns={columns}
                          initialState={{
                            pagination: {
                              paginationModel: { page: 0, pageSize: 10 },
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
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Manager</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="manager_name"
            label="First Name"
            type="text"
            fullWidth
            value={formData.manager_name}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            name="manager_username"
            label="Username"
            type="text"
            fullWidth
            value={formData.manager_username}
            onChange={handleChange}
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

export default ViewManager;
