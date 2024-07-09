import React, { Fragment, useState, useContext, useEffect } from "react";
import axios from "../services/axiosConfig"; // Use the configured Axios instance
import { useNavigate } from "react-router-dom";
import UserContext from "../services/UserContext";

function Login() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is logged in and redirect
    if (userData && userData.firstName) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/login", { username, password })
      .then((response) => {
        const { firstName, username } = response.data;
        setUserData({ firstName, username });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging in user", error);
        setErrorMessage("Invalid username or password.");
      });
  };

  return (
    <Fragment>
      <>
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
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(event) =>
                              setUsername(event.target.value)
                            }
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
                            onChange={(event) =>
                              setPassword(event.target.value)
                            }
                          />
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <div className="form-check">
                            <input
                              className="form-check-input primary"
                              type="checkbox"
                              id="flexCheckChecked"
                            />
                            <label
                              className="form-check-label text-dark"
                              htmlFor="flexCheckChecked"
                            >
                              Remember this Device
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2"
                        >
                          Sign In
                        </button>
                        {errorMessage && (
                          <div style={{ color: "red" }}>{errorMessage}</div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
}

export default Login;
