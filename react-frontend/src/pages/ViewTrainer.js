import React, { Fragment, useState, useEffect } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'trainer_id', headerName: 'ID', width: 70 },
  { field: 'trainer_name', headerName: 'First name', width: 130 },
  { field: 'trainer_start_date', headerName: 'Trainer Start Date', width: 250 },
  { field: 'trainer_end_date', headerName: 'Trainer End Date', width: 250 },

];


function ViewTrainer(){

    const [chartData, setChartData] = useState([]); // Initialize data as an empty array

    // function to fetch data
    const fetchData = () => {
      fetch('/view_trainers_sort')
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Server response not OK');
          }
        })
        .then(response => {
            const data = response.data; // Extract the data array from the response
            console.log("Received data:", data);
            // Transform the data into an array of objects with unique IDs
            const transformedData = data.map((item, index) => ({
              id: index + 1, // Use index + 1 as the unique ID (assuming index starts from 0)
              manager_id: item[0],
              trainer_name: item[1],
              trainer_start_date: item[2],
              trainer_end_date: item[3],
            }));
            setChartData(transformedData);
          })
          
        .catch(error => {
          console.error('Error fetching data:', error);
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
    <Nav></Nav>
    {/*  Sidebar End */}
    {/*  Main wrapper */}
    <div className="body-wrapper">
      {/*  Header Start */}
      <Header></Header>
      {/*  Header End */}
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Current Trainers</h5>
              <div className="card">
                <div className="card-body p-4">
                <div style={{ height: 600, width: '100%' }}>
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
</>

    </Fragment>

        )
}

export default ViewTrainer