import React, { Fragment, useState } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Papa from 'papaparse';

function AddTrainer(){

  const [trainerData, setTrainerData] = useState([])

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      transform: (value, header) => {
        // Check if the current column is one of the date columns
        if (header === 'start_date' || header === 'end_date') {
          // Remove quotation marks from the date value
          return value.replace(/['"]+/g, '');
        }
        return value;
      },
      complete: (results) => {
        console.log(results.data)
        setTrainerData(results.data);
      },
    });
  };

  const [trainer_name, setTrainerName] = useState('');
  const [start_date, setStartDate] = React.useState(dayjs());
  const [end_date, setEndDate] = React.useState(dayjs());

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

  const handleMultiSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Iterate over each manager data object in trainerData array
    trainerData.forEach((trainer) => {
      const { trainer_name, start_date, end_date } = trainer;
  
      // Make HTTP POST request to your backend API for each manager
      axios.post('/add_trainer', { trainer_name, start_date, end_date })
        .then((response) => {
          console.log('Trainers created successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error creating Trainer:', error);
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
    axios.post('/add_trainer', { trainer_name, start_date, end_date })
      .then((response) => {

        handleClick(); // Show snackbar
        console.log('Trainer created successfully:', response.data);
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to main page after delay
      }, 3000); // Adjust the delay time as needed (3000 milliseconds = 3 seconds)
      })
      .catch((error) => {
        console.log(trainer_name, start_date, end_date)
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
              <h5 className="card-title fw-semibold mb-4">Add Trainers</h5>
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
                  label="Trainer Name"
                  variant="outlined"
                  value={trainer_name}
                  onChange={(event) => setTrainerName(event.target.value)}
                />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Trainer Start Date"
                        start_date={start_date}
                        onChange={(newValue) => setStartDate(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Trainer End Date"
                        end_date={end_date}
                        onChange={(newValue) => setEndDate(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                <button
                  type="submit" // Use button type submit to trigger form submission
                  className="btn btn-danger w-40 py-8 fs-4   rounded-2"
                  style={{ width: '100%' }}
                >
                  Create Trainer
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
                  Trainer created successfully
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
                {trainerData.length ? (
                  <button className="btn btn-danger w-40 py-8 fs-4  rounded-2" style={{ width: '20%' }} onClick={handleMultiSubmit}>
                    Create {trainerData.length} trainers
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

export default AddTrainer;