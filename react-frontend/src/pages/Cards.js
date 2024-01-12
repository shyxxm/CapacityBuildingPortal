import React, { Fragment } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"

function Cards(){
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
              <div className="row">
                <div className="col-md-4">
                  <h5 className="card-title fw-semibold mb-4">Card</h5>
                  <div className="card">
                    <img
                      src="../assets/images/products/s4.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Card title</h5>
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                      <a href="#" className="btn btn-primary">
                        Go somewhere
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <h5 className="card-title fw-semibold mb-4">
                    Header and footer
                  </h5>
                  <div className="card">
                    <div className="card-header">Featured</div>
                    <div className="card-body">
                      <h5 className="card-title">Special title treatment</h5>
                      <p className="card-text">
                        With supporting text below as a natural lead-in to
                        additional content.
                      </p>
                      <a href="#" className="btn btn-primary">
                        Go somewhere
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <h5 className="card-title fw-semibold mb-4">
                    Titles, text, and links
                  </h5>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Card title</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Card subtitle
                      </h6>
                      <p className="card-text">
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </p>
                      <a href="#" className="card-link">
                        Card link
                      </a>
                      <a href="#" className="card-link">
                        Another link
                      </a>
                    </div>
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

export default Cards