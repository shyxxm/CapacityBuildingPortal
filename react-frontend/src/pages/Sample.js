import React, { useState, useEffect, Fragment } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import PreTraining from "../charts/Timeline/PreTraining.tsx";
import ImpleTime from "../charts/Timeline/Implementation.tsx";

function Sample() {
  // State to store the selected phase
  const [selectedGanttPhase, setSelectedGanttPhase] = useState(1);

  // Handle change in dropdown
  const handleSelectChangeinGantt = (event) => {
    setSelectedGanttPhase(parseInt(event.target.value, 10));
  };

  // Function to determine which BarChart to render
  const renderGanttChart = () => {
    switch (selectedGanttPhase) {
      case 1:
        return <PreTraining />;
      case 2:
        return <ImpleTime />;
      case 3:
        return <PreTraining />;
      case 4:
        return <PreTraining />;
      default:
        return <PreTraining />;
    }
  };

  return (
    <Fragment>
      {/* Body Wrapper */}
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
        <Nav />
        {/* Sidebar End */}
        {/* Main wrapper */}
        <div className="body-wrapper">
          {/* Header Start */}
          <Header />
          {/* Header End */}
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="card-title fw-semibold">
                      Pace / Stage of Center
                    </h5>
                  </div>
                  <div>
                    <select
                      className="form-select"
                      onChange={handleSelectChangeinGantt}
                    >
                      <option value={1}>Pre-Training</option>
                      <option value={2}>Skill Implementation</option>
                      <option value={3}>Assessment and Certification</option>
                      <option value={4}>Income Generation</option>
                    </select>
                  </div>
                </div>
                {renderGanttChart()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Sample;

// const domContainer = document.querySelector("#app");
// ReactDOM.render(React.createElement(Sample), domContainer);
