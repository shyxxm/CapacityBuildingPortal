import React, { Fragment, useState, useEffect } from 'react';
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { DataGrid } from '@mui/x-data-grid';
import { Toolbar, Button } from '@mui/material';

const columns = [
  { field: 'trainer_id', headerName: 'ID', width: 70 },
  { field: 'trainer_name', headerName: 'First name', width: 130 },
  { field: 'trainer_start_date', headerName: 'Trainer Start Date', width: 250 },
  { field: 'trainer_end_date', headerName: 'Trainer End Date', width: 250 },
];

function ViewManager() {
  const [chartData, setChartData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = () => {
    fetch('/view_trainers_sort')
      .then(res => res.json())
      .then(response => {
        const data = response.data.map((item, index) => ({
          id: index + 1,
          trainer_id: item[0],
          trainer_name: item[1],
          trainer_start_date: item[2],
          trainer_end_date: item[3],
        }));
        setChartData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectionModelChange = (selection) => {
    setSelectedRows(selection.selectionModel);
  };

  const handleDeleteClick = () => {
    // Here you can implement the logic to delete the selected rows
    console.log("Deleting rows:", selectedRows);
  };

  return (
    <Fragment>
      <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
        <Nav />
        <div className="body-wrapper">
          <Header />
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title fw-semibold mb-4">Current Trainers</h5>
                <div className="card">
                  <div className="card-body p-4">
                    <Toolbar>
                      {selectedRows.length > 0 && (
                        <Button variant="contained" color="error" onClick={handleDeleteClick}>
                          Delete
                        </Button>
                      )}
                    </Toolbar>
                    <div style={{ height: 600, width: '100%' }}>
                      <DataGrid
                        rows={chartData}
                        columns={columns}
                        onSelectionModelChange={handleSelectionModelChange}
                        pageSize={5}
                        checkboxSelection
                      />
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

export default ViewManager;
