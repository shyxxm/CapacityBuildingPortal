import React, { Fragment } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"

function Table(){
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
        <div className="card w-100 h-100 position-relative overflow-hidden">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-4">Icons</h5>
            <iframe
              src="https://tabler-icons.io/"
              frameBorder={0}
              style={{ height: "calc(100vh - 250px)", width: "100%" }}
              data-simplebar=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    </Fragment>

        )
}

export default Table