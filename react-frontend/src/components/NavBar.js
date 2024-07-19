import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../services/UserContext";

function Nav() {
  const { firstName } = useContext(UserContext);

  return (
    <>
      <div>
        {/* Sidebar Start */}
        <aside className="left-sidebar">
          {/* Sidebar scroll*/}
          <div>
            <div className="brand-logo d-flex align-items-center justify-content-between">
              <Link to="/">
                <a href="/" className="text-nowrap logo-img">
                  <img
                    src="../assets/images/logos/navbar.png"
                    width={180}
                    alt=""
                  />
                </a>
                <div className="ti menu-2"></div>
              </Link>
            </div>
            {/* Sidebar navigation*/}
            <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
              <ul id="sidebarnav">
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">Home</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-layout-dashboard" />
                      </span>
                      <span className="hide-menu">Select a Project</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/dashboard">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-home-star" />
                      </span>
                      <span className="hide-menu">Dashboard</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">Project Management</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/CreateProject">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-table-alias" />
                      </span>
                      <span className="hide-menu">Create a Project</span>
                    </a>
                  </Link>
                </li>
                {/* <li className="sidebar-item">
                  <Link to="/">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-fidget-spinner" />
                      </span>
                      <span className="hide-menu">Edit Project KPIs</span>
                    </a>
                  </Link>
                </li> */}
                <li className="sidebar-item">
                  <Link to="/ProjectConfig">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-circles" />
                      </span>
                      <span className="hide-menu">Project Configuration</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/ProjectUpdates">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-bell-z" />
                      </span>
                      <span className="hide-menu">Project Updates</span>
                    </a>
                  </Link>
                </li>

                {/* <li className="sidebar-item">
                  <Link to="/CenterConfig">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-fidget-spinner" />
                      </span>
                      <span className="hide-menu">Center Configuration</span>
                    </a>
                  </Link>
                </li> */}
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">Project Reports</span>
                </li>

                {/* <li className="sidebar-item">
                  <Link to="/">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i
                          className="ti ti-chart-infographic
                        "
                        />
                      </span>
                      <span className="hide-menu">Status across Centers</span>
                    </a>
                  </Link>
                </li> */}
                <li className="sidebar-item">
                  <Link to="/ProjectDetails">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-picture-in-picture-on" />
                      </span>
                      <span className="hide-menu">Project Details</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/TextAnalysis">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-device-analytics" />
                      </span>
                      <span className="hide-menu">Text Analysis</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">General Functions</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/AddManager">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i
                          className="ti ti-chart-infographic
                        "
                        />
                      </span>
                      <span className="hide-menu">Add Managers</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/AddTrainer">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-user-check" />
                      </span>
                      <span className="hide-menu">Add Trainers</span>
                    </a>
                  </Link>
                </li>
                {/* <li className="sidebar-item">
                  <Link to="/AddCenter">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-picture-in-picture-on" />
                      </span>
                      <span className="hide-menu">Add Centers</span>
                    </a>
                  </Link>
                </li> */}
                <li className="sidebar-item">
                  <Link to="/AddTrainee">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-picture-in-picture-on" />
                      </span>
                      <span className="hide-menu">Add Trainees</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">General Views</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/ViewManager">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i
                          className="ti ti-chart-infographic
                        "
                        />
                      </span>
                      <span className="hide-menu">View Managers</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/ViewTrainer">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-picture-in-picture-on" />
                      </span>
                      <span className="hide-menu">View Trainers</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/ViewTrainee">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-picture-in-picture-on" />
                      </span>
                      <span className="hide-menu">View Trainees</span>
                    </a>
                  </Link>
                </li>
                {/* <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">UI COMPONENTS</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/Buttons">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-article" />
                      </span>
                      <span className="hide-menu">Buttons</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Alerts">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-alert-circle" />
                      </span>
                      <span className="hide-menu">Alerts</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Cards">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-cards" />
                      </span>
                      <span className="hide-menu">Cards</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Forms">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-file-description" />
                      </span>
                      <span className="hide-menu">Forms</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Typography">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-typography" />
                      </span>
                      <span className="hide-menu">Typography</span>
                    </a>
                  </Link>
                </li> */}
                {/* <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">AUTH</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/Login">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-login" />
                      </span>
                      <span className="hide-menu">Login</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Register">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-user-plus" />
                      </span>
                      <span className="hide-menu">Register</span>
                    </a>
                  </Link>
                </li> */}
                {/* <li className="nav-small-cap">
                  <i className="ti ti-dots nav-small-cap-icon fs-4" />
                  <span className="hide-menu">EXTRA</span>
                </li>
                <li className="sidebar-item">
                  <Link to="/Icon">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-mood-happy" />
                      </span>
                      <span className="hide-menu">Icons</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/Sample">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-aperture" />
                      </span>
                      <span className="hide-menu">Sample Page</span>
                    </a>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link to="/SampleNew">
                    <a className="sidebar-link" aria-expanded="false">
                      <span>
                        <i className="ti ti-aperture" />
                      </span>
                      <span className="hide-menu">New Sample Page</span>
                    </a>
                  </Link>
                </li> */}
              </ul>
              {/* <div className="unlimited-access hide-menu bg-light-primary position-relative mb-7 mt-5 rounded">
                <div className="d-flex">
                  <div className="unlimited-access-title me-3">
                    <h6 className="fw-semibold fs-4 mb-6 text-dark w-85">
                      Upgrade to pro
                    </h6>
                    <a
                      href="https://adminmart.com/product/modernize-bootstrap-5-admin-template/"
                      target="_blank"
                      className="btn btn-primary fs-2 fw-semibold lh-sm"
                    >
                      Buy Pro
                    </a>
                  </div>
                  <div className="unlimited-access-img">
                    <img
                      src="../assets/images/backgrounds/rocket.png"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div> */}
            </nav>
            {/* End Sidebar navigation */}
          </div>
          {/* End Sidebar scroll*/}
        </aside>
        {/*  Sidebar End */}
      </div>
    </>
  );
}

export default Nav;
