import React, { Fragment, useState } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

function AddManager(){

  const [managerData, setManagerData] = useState([])

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setManagerData(results.data)
      },
    });
  };

  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [first_name, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleMultiSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Iterate over each manager data object in managerData array
    managerData.forEach((manager) => {
      const { username, first_name, password } = manager;
  
      // Make HTTP POST request to your backend API for each manager
      axios.post('/add_manager', { username, first_name, password })
        .then((response) => {
          console.log('Managers created successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error creating manager:', error);
          // Handle error if needed
        });
    });
  
    handleClick(); // Show snackbar
    setTimeout(() => {
      navigate('/dashboard'); // Redirect to main page after delay
    }, 3000); // Adjust the delay time as needed (3000 milliseconds = 3 seconds)
  };
  

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Make HTTP POST request to your backend API
    axios.post('/add_manager', { username, first_name, password })
      .then((response) => {

        handleClick(); // Show snackbar
        console.log('Manager created successfully:', response.data);
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to main page after delay
      }, 3000); // Adjust the delay time as needed (3000 milliseconds = 3 seconds)
      })
      .catch((error) => {
        console.log(username, first_name, password)
        console.error('Error creating manager:', error);
        // Handle error if needed
      });
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
              <h5 className="card-title fw-semibold mb-4">Add Managers</h5>
              <div className="card">
              <div className="card-body p-4" style={{ display: 'grid', placeItems: 'center', gap: '1rem' }}>
              <Box
                component="form"
                onSubmit={handleSubmit} // Attach onSubmit event handler
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                style={{ width: '100%', maxWidth: '25ch' }}
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
                <button
                  type="submit" // Use button type submit to trigger form submission
                  className="btn btn-danger w-40 py-8 fs-4   rounded-2"
                  style={{ width: '100%' }}
                >
                  Create Manager
                </button>
              </Box>
              </div>

              </div>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  Manager created successfully
                </Alert>
      </Snackbar>
              <h5 className="card-title fw-semibold mb-4 text-center">
                or
              </h5>
              <div className="card mb-0">
                <div className="card-body p-4 " style={{ display: 'grid', placeItems: 'center' }}>
                <label className="btn btn-info w-40 py-8 fs-4  rounded-2" style={{ width: '20%' }}>
                  <input type="file"  accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                  Upload CSV
                </label>
                <br></br>
                {managerData.length ? (
                  <button className="btn btn-danger w-40 py-8 fs-4  rounded-2" style={{ width: '20%' }} onClick={handleMultiSubmit}>
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
</>

    </Fragment>

        )
}

export default AddManager;