import React, { Fragment } from 'react'
import {Link} from 'react-router-dom';


function Nav() {
    return(
<>
<div
    // className="page-wrapper"
    // id="main-wrapper"
    // // data-layout="vertical"
    // data-navbarbg="skin6"
    // data-sidebartype="full"
    // data-sidebar-position="fixed"
    // data-header-position="fixed"
  >
  {/* Sidebar Start */}
  <aside className="left-sidebar">
    {/* Sidebar scroll*/}
    <div>
      <div className="brand-logo d-flex align-items-center justify-content-between">
        <Link to="/" >
        <a  className="text-nowrap logo-img">
          <img src="../assets/images/logos/dark-logo.svg" width={180} alt="" />
        </a>
        <div
          className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
          id="sidebarCollapse"
        >
          <i className="ti ti-x fs-8" />
        </div>
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
            <Link  to="/" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-layout-dashboard" />
              </span>
              <span className="hide-menu">Dashboard</span>
            </a>
            </Link>
          </li>
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4" />
            <span className="hide-menu">UI COMPONENTS</span>
          </li>
          <li className="sidebar-item">
          <Link  to="/Buttons" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-article" />
              </span>
              <span className="hide-menu">Buttons</span>
            </a>
            </Link>

          </li>
          <li className="sidebar-item">
          <Link  to="/Alerts" >

            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-alert-circle" />
              </span>
              <span className="hide-menu">Alerts</span>
            </a>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Cards" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-cards" />
              </span>
              <span className="hide-menu">Cards</span>
            </a>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Forms" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-file-description" />
              </span>
              <span className="hide-menu">Forms</span>
            </a>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Typography" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-typography" />
              </span>
              <span className="hide-menu">Typography</span>
            </a>
            </Link>
          </li>
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4" />
            <span className="hide-menu">AUTH</span>
          </li>
          <li className="sidebar-item">
            <Link  to="/Login">
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-login" />
              </span>
              <span className="hide-menu">Login</span>
            </a>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Register" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-user-plus" />
              </span>
              <span className="hide-menu">Register</span>
            </a>
            </Link>
          </li>
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4" />
            <span className="hide-menu">EXTRA</span>
          </li>
          <li className="sidebar-item">
            <Link to="/Icon" > 
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-mood-happy" />
              </span>
              <span className="hide-menu">Icons</span>
            </a>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Sample" >
            <a
              className="sidebar-link"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-aperture" />
              </span>
              <span className="hide-menu">Sample Page</span>
            </a>
            </Link>
          </li>
        </ul>
        <div className="unlimited-access hide-menu bg-light-primary position-relative mb-7 mt-5 rounded">
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
        </div>
      </nav>
      {/* End Sidebar navigation */}
    </div>
    {/* End Sidebar scroll*/}
  </aside>
  {/*  Sidebar End */}
  </div>
</>

    )
}

export default Nav;