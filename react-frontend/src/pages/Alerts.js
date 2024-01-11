import React, { Fragment } from 'react'
import Header from "./Header"
import Nav from "./NavBar"

function Alerts(){
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
              <h5 className="card-title fw-semibold mb-4">Alerts</h5>
              <div className="card mb-0">
                <div className="card-body p-4">
                  <div className="alert alert-primary" role="alert">
                    A simple primary alert—check it out!
                  </div>
                  <div className="alert alert-secondary" role="alert">
                    A simple secondary alert—check it out!
                  </div>
                  <div className="alert alert-success" role="alert">
                    A simple success alert—check it out!
                  </div>
                  <div className="alert alert-danger" role="alert">
                    A simple danger alert—check it out!
                  </div>
                  <div className="alert alert-warning" role="alert">
                    A simple warning alert—check it out!
                  </div>
                  <div className="alert alert-info" role="alert">
                    A simple info alert—check it out!
                  </div>
                  <div className="alert alert-light" role="alert">
                    A simple light alert—check it out!
                  </div>
                  <div className="alert alert-dark" role="alert">
                    A simple dark alert—check it out!
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

export default Alerts