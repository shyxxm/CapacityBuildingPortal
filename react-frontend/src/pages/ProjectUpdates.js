import React, { Fragment, useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../services/axiosConfig"; // Import the configured Axios instance
import Button from "@mui/material/Button";
import UserContext from "../services/UserContext";

function ProjectUpdates() {
  const [rows, setRows] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    fetchProjectUpdates();
  }, []);

  const fetchProjectUpdates = () => {
    const username = userData.username;

    axios
      .post("/get_project_updates", { username })
      .then((response) => {
        console.log("Response data:", response.data);
        const transformedData = response.data.updates.map((item) => ({
          ...item,
          date_recorded: new Date(item.date_recorded)
            .toISOString()
            .split("T")[0], // Transform the date_recorded to ISO string
        }));
        setRows(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching project updates:", error);
      });
  };

  const markAsResponded = (progress_id) => {
    axios
      .post("/respond_notification", { progress_id })
      .then((response) => {
        fetchProjectUpdates(); // Refresh updates after marking as read
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "project_name",
      headerName: "Project Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "okr_name",
      headerName: "OKR Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "kpi_name",
      headerName: "KPI Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "progress_status",
      headerName: "Progress Status",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "update_details",
      headerName: "Update Details",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date_recorded",
      headerName: "Date Recorded",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "reported_by",
      headerName: "Reported By",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "responded",
      headerName: "Responded",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value === "No") {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => markAsResponded(params.row.id)}
            >
              Respond
            </Button>
          );
        } else {
          return (
            <Button variant="contained" color="success" disabled>
              Responded
            </Button>
          );
        }
      },
    },
  ];

  const getRowClassName = (params) => {
    if (params.row.progress_status === "Green") {
      return "row-green";
    } else if (params.row.progress_status === "Yellow") {
      return "row-yellow";
    } else if (params.row.progress_status === "Red") {
      return "row-red";
    }
    return "";
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
                    Project Updates
                  </h5>
                  <div className="card">
                    <div className="card-body p-4">
                      <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          initialState={{
                            pagination: {
                              paginationModel: { page: 0, pageSize: 10 },
                            },
                          }}
                          pageSizeOptions={[5, 10, 15, 20]}
                          autoHeight
                          getRowClassName={getRowClassName}
                        />
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

export default ProjectUpdates;
