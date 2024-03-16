import React, { Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";

function Buttons() {
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
                    <h5 className="card-title fw-semibold mb-4">Buttons</h5>
                    <div className="card">
                      <div className="card-body p-4">
                        <button type="button" className="btn btn-primary m-1">
                          Primary
                        </button>
                        <button type="button" className="btn btn-secondary m-1">
                          Secondary
                        </button>
                        <button type="button" className="btn btn-success m-1">
                          Success
                        </button>
                        <button type="button" className="btn btn-danger m-1">
                          Danger
                        </button>
                        <button type="button" className="btn btn-warning m-1">
                          Warning
                        </button>
                        <button type="button" className="btn btn-info m-1">
                          Info
                        </button>
                        <button type="button" className="btn btn-light m-1">
                          Light
                        </button>
                        <button type="button" className="btn btn-dark m-1">
                          Dark
                        </button>
                        <button type="button" className="btn btn-link m-1">
                          Link
                        </button>
                      </div>
                    </div>
                    <h5 className="card-title fw-semibold mb-4">
                      Outline buttons
                    </h5>
                    <div className="card mb-0">
                      <div className="card-body p-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary m-1"
                        >
                          Primary
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary m-1"
                        >
                          Secondary
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success m-1"
                        >
                          Success
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger m-1"
                        >
                          Danger
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-warning m-1"
                        >
                          Warning
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-info m-1"
                        >
                          Info
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-light m-1"
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-dark m-1"
                        >
                          Dark
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-link m-1"
                        >
                          Link
                        </button>
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
  );
}

export default Buttons;
