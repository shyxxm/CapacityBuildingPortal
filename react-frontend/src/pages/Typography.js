import React, { Fragment } from 'react'
import Header from "./Header"
import Nav from "./NavBar"

function Typography(){
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
              <h5 className="card-title fw-semibold mb-4">Headings</h5>
              <div className="card">
                <div className="card-body p-4">
                  <h1>h1. Bootstrap heading</h1>
                  <h2>h2. Bootstrap heading</h2>
                  <h3>h3. Bootstrap heading</h3>
                  <h4>h4. Bootstrap heading</h4>
                  <h5>h5. Bootstrap heading</h5>
                  <h6>h6. Bootstrap heading</h6>
                </div>
              </div>
              <h5 className="card-title fw-semibold mb-4">
                Inline text elements
              </h5>
              <div className="card mb-0">
                <div className="card-body p-4">
                  <p>
                    You can use the mark tag to <mark>highlight</mark> text.
                  </p>
                  <p>
                    <del>
                      This line of text is meant to be treated as deleted text.
                    </del>
                  </p>
                  <p>
                    <s>
                      This line of text is meant to be treated as no longer
                      accurate.
                    </s>
                  </p>
                  <p>
                    <ins>
                      This line of text is meant to be treated as an addition to
                      the document.
                    </ins>
                  </p>
                  <p>
                    <u>This line of text will render as underlined.</u>
                  </p>
                  <p>
                    <small>
                      This line of text is meant to be treated as fine print.
                    </small>
                  </p>
                  <p>
                    <strong>This line rendered as bold text.</strong>
                  </p>
                  <p className="mb-0">
                    <em>This line rendered as italicized text.</em>
                  </p>
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

export default Typography