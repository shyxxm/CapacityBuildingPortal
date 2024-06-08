import React, { useEffect, Fragment, useRef } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
} from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const initialRows = [];

function EditToolbar(props) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    const highestId =
      rows.length > 0 ? Math.max(...rows.map((row) => row.course_id)) : 0;
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
        center_id: "",
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
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function CourseGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [centers, setCenters] = React.useState([]);
  const dataGridRef = useRef(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch("/view_program_details?program_id=9");
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
  }, []);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("/view_center_data?program_id=9");
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
  }, []);

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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => async () => {
    if (!dataGridRef.current) {
      console.error("DataGrid reference is not available.");
      return;
    }
    const apiRef = dataGridRef.current.apiRef.current;
    if (!apiRef) {
      console.error("apiRef is not available.");
      return;
    }
    apiRef.stopCellEditMode({ id });

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

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log("Row update:", updatedRow);
    try {
      if (newRow.isNew) {
        const addedCourse = await addCourse(updatedRow);
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? addedCourse : row))
        );
        return addedCourse;
      } else {
        await editCourse(updatedRow);
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
        );
        return updatedRow;
      }
    } catch (error) {
      console.error(error);
      return rows.find((row) => row.id === newRow.id);
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
          center_id: updatedRow.center_id,
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
          program_id: 9, // Assuming program_id is 9, or change accordingly
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
      row.course_name !== "" &&
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
        return (
          <select
            value={params.value || ""}
            onChange={(e) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
          >
            {centers.map((center) => (
              <option key={center.value} value={center.value}>
                {center.label}
              </option>
            ))}
          </select>
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
                  <h5 className="card-title fw-semibold mb-4">Courses</h5>
                  <div className="card">
                    <div className="card-body p-4">
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
                          ref={dataGridRef}
                          rows={rows}
                          columns={columns}
                          editMode="row"
                          rowModesModel={rowModesModel}
                          onRowModesModelChange={handleRowModesModelChange}
                          onRowEditStop={handleRowEditStop}
                          onCellEditCommit={handleRowEditCommit}
                          processRowUpdate={processRowUpdate}
                          slots={{
                            toolbar: EditToolbar,
                          }}
                          slotProps={{
                            toolbar: { rows, setRows, setRowModesModel },
                          }}
                          getRowId={(row) => row.id}
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </Fragment>
  );
}

export default CourseGrid;
