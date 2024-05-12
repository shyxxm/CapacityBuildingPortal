import React, { Fragment, useState, useContext, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../services//UserContext';


function Login(){

  const { userData, setUserData } = useContext(UserContext);


  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if first name is stored in userData whenever userData changes
    if (userData && userData.firstName !== null) {
      console.log('First name is stored:', userData.firstName);
      navigate('/');
    }
  }, [userData, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Make HTTP POST request to your backend API
    axios.post('/login', { username, password})
      .then((response) => {

        const { firstName, username } = response.data;
        console.log('Logged in successfully:', response.data);
        setUserData({ firstName, username });
        // Check if first name is stored in userData
        navigate('/'); // Redirect to main page after delay
      })
      .catch((error) => {
        console.log(username, password)
        console.error('Error logging in User', error);
        setErrorMessage('Invalid username or password.');
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
    <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <a
                  href="./index.html"
                  className="text-nowrap logo-img text-center d-block py-3 w-100"
                >
                  <img
                    src="../assets/images/logos/navbar.png"
                    width={180}
                    alt=""
                  />
                </a>
                <p className="text-center">Your Monitoring Portal</p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input primary"
                        type="checkbox"
                        defaultValue=""
                        id="flexCheckChecked"
                        defaultChecked=""
                      />
                      <label
                        className="form-check-label text-dark"
                        htmlFor="flexCheckChecked"
                      >
                        Remeber this Device
                      </label>
                    </div>
                    {/* <a className="text-primary fw-bold" href="./index.html">
                      Forgot Password ?
                    </a> */}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2"
                  >
                    Sign In
                  </button>
                  {/* <div className="d-flex align-items-center justify-content-center">
                    <p className="fs-4 mb-0 fw-bold">New to Modernize?</p>
                    <a
                      className="text-primary fw-bold ms-2"
                      href="./authentication-register.html"
                    >
                      Create an account
                    </a>
                  </div> */}
                </form>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

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

export default Login