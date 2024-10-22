import React, { useState, useEffect, Fragment } from 'react'
import Header from "../components/Header"
import Nav from "../components/NavBar"
import {Link} from 'react-router-dom';
import { App as BarChart } from '../charts/BarChart.tsx';
import { App as HorizontalBarChart } from '../charts/HorizontalBarChart.tsx';
import { App as AssessBar } from '../charts/Dashboard/Assessment.tsx';
import { App as ImpleBar } from '../charts/Dashboard/Implementation.tsx';
import { App as IncomeBar } from '../charts/Dashboard/Income.tsx';
import { App as PreBar } from '../charts/Dashboard/PreTraining.tsx';


function Dashboard(){

    // State to store the selected phase
    const [selectedPhase, setSelectedPhase] = useState(1);

    // Handle change in dropdown
    const handleSelectChange = (event) => {
      setSelectedPhase(parseInt(event.target.value, 10));
    };
  
    // Function to determine which BarChart to render
    const renderBarChart = () => {
      switch (selectedPhase) {
        case 1:
          return <PreBar />;
        case 2:
          return <ImpleBar />;
        case 3:
          return <AssessBar />;
        case 4:
          return <IncomeBar />;
        default:
          return <PreBar />;
      }
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
    {/* Sidebar Start */}
<Nav></Nav>
    {/*  Sidebar End */}
    {/*  Main wrapper */}
    <div className="body-wrapper">
      {/*  Header Start */}
<Header></Header>
      {/*  Header End */}
      <div className="container-fluid">
        {/*  Row 1 */}
        <div className="row">
          <div className="col-lg-6 d-flex align-items-strech">
            <div className="card w-100">
              <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="card-title fw-semibold">Project Level Phase Status Overview</h5>
                  </div>
                  <div>
                    <select className="form-select" onChange={handleSelectChange} >
                      <option value={1}>Pre-Training</option>
                      <option value={2}>Skill Implementation</option>
                      <option value={3}>Assessment and Certification</option>
                      <option value={4}>Income Generation</option>
                    </select>
                  </div>
                </div>
                {renderBarChart()}

              </div>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-strech">
            <div className="card w-100">
              <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="card-title fw-semibold">Individual Centre Progress</h5>
                  </div>
                </div>
                <HorizontalBarChart></HorizontalBarChart>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <div className="mb-4">
                  <h5 className="card-title fw-semibold">
                    Recent Transactions
                  </h5>
                </div>
                <ul className="timeline-widget mb-0 position-relative mb-n5">
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      09:30
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-primary flex-shrink-0 my-8" />
                      <span className="timeline-badge-border d-block flex-shrink-0" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1">
                      Payment received from John Doe of $385.90
                    </div>
                  </li>
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      10:00 am
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-info flex-shrink-0 my-8" />
                      <span className="timeline-badge-border d-block flex-shrink-0" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                      New sale recorded{" "}
                      <a
                        href="javascript:void(0)"
                        className="text-primary d-block fw-normal"
                      >
                        #ML-3467
                      </a>
                    </div>
                  </li>
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      12:00 am
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-success flex-shrink-0 my-8" />
                      <span className="timeline-badge-border d-block flex-shrink-0" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1">
                      Payment was made of $64.95 to Michael
                    </div>
                  </li>
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      09:30 am
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-warning flex-shrink-0 my-8" />
                      <span className="timeline-badge-border d-block flex-shrink-0" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                      New sale recorded{" "}
                      <a
                        href="javascript:void(0)"
                        className="text-primary d-block fw-normal"
                      >
                        #ML-3467
                      </a>
                    </div>
                  </li>
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      09:30 am
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-danger flex-shrink-0 my-8" />
                      <span className="timeline-badge-border d-block flex-shrink-0" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1 fw-semibold">
                      New arrival recorded
                    </div>
                  </li>
                  <li className="timeline-item d-flex position-relative overflow-hidden">
                    <div className="timeline-time text-dark flex-shrink-0 text-end">
                      12:00 am
                    </div>
                    <div className="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span className="timeline-badge border-2 border border-success flex-shrink-0 my-8" />
                    </div>
                    <div className="timeline-desc fs-3 text-dark mt-n1">
                      Payment Done
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="card w-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-4">
                  Recent Transactions
                </h5>
                <div className="table-responsive">
                  <table className="table text-nowrap mb-0 align-middle">
                    <thead className="text-dark fs-4">
                      <tr>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Id</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Assigned</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Name</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Priority</h6>
                        </th>
                        <th className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">Budget</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">1</h6>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-1">Sunil Joshi</h6>
                          <span className="fw-normal">Web Designer</span>
                        </td>
                        <td className="border-bottom-0">
                          <p className="mb-0 fw-normal">Elite Admin</p>
                        </td>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary rounded-3 fw-semibold">
                              Low
                            </span>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0 fs-4">$3.9</h6>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">2</h6>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-1">
                            Andrew McDownland
                          </h6>
                          <span className="fw-normal">Project Manager</span>
                        </td>
                        <td className="border-bottom-0">
                          <p className="mb-0 fw-normal">Real Homes WP Theme</p>
                        </td>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-secondary rounded-3 fw-semibold">
                              Medium
                            </span>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0 fs-4">$24.5k</h6>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">3</h6>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-1">
                            Christopher Jamil
                          </h6>
                          <span className="fw-normal">Project Manager</span>
                        </td>
                        <td className="border-bottom-0">
                          <p className="mb-0 fw-normal">MedicalPro WP Theme</p>
                        </td>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-danger rounded-3 fw-semibold">
                              High
                            </span>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0 fs-4">$12.8k</h6>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0">4</h6>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-1">Nirav Joshi</h6>
                          <span className="fw-normal">Frontend Engineer</span>
                        </td>
                        <td className="border-bottom-0">
                          <p className="mb-0 fw-normal">Hosting Press HTML</p>
                        </td>
                        <td className="border-bottom-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success rounded-3 fw-semibold">
                              Critical
                            </span>
                          </div>
                        </td>
                        <td className="border-bottom-0">
                          <h6 className="fw-semibold mb-0 fs-4">$2.4k</h6>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-xl-3">
            <div className="card overflow-hidden rounded-2">
              <div className="position-relative">
                <a href="javascript:void(0)">
                  <img
                    src="../assets/images/products/s4.jpg"
                    className="card-img-top rounded-0"
                    alt="..."
                  />
                </a>
                <a
                  href="javascript:void(0)"
                  className="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Add To Cart"
                >
                  <i className="ti ti-basket fs-4" />
                </a>{" "}
              </div>
              <div className="card-body pt-3 p-4">
                <h6 className="fw-semibold fs-4">Boat Headphone</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-semibold fs-4 mb-0">
                    $50{" "}
                    <span className="ms-2 fw-normal text-muted fs-3">
                      <del>$65</del>
                    </span>
                  </h6>
                  <ul className="list-unstyled d-flex align-items-center mb-0">
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card overflow-hidden rounded-2">
              <div className="position-relative">
                <a href="javascript:void(0)">
                  <img
                    src="../assets/images/products/s5.jpg"
                    className="card-img-top rounded-0"
                    alt="..."
                  />
                </a>
                <a
                  href="javascript:void(0)"
                  className="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Add To Cart"
                >
                  <i className="ti ti-basket fs-4" />
                </a>{" "}
              </div>
              <div className="card-body pt-3 p-4">
                <h6 className="fw-semibold fs-4">MacBook Air Pro</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-semibold fs-4 mb-0">
                    $650{" "}
                    <span className="ms-2 fw-normal text-muted fs-3">
                      <del>$900</del>
                    </span>
                  </h6>
                  <ul className="list-unstyled d-flex align-items-center mb-0">
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card overflow-hidden rounded-2">
              <div className="position-relative">
                <a href="javascript:void(0)">
                  <img
                    src="../assets/images/products/s7.jpg"
                    className="card-img-top rounded-0"
                    alt="..."
                  />
                </a>
                <a
                  href="javascript:void(0)"
                  className="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Add To Cart"
                >
                  <i className="ti ti-basket fs-4" />
                </a>{" "}
              </div>
              <div className="card-body pt-3 p-4">
                <h6 className="fw-semibold fs-4">Red Valvet Dress</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-semibold fs-4 mb-0">
                    $150{" "}
                    <span className="ms-2 fw-normal text-muted fs-3">
                      <del>$200</del>
                    </span>
                  </h6>
                  <ul className="list-unstyled d-flex align-items-center mb-0">
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card overflow-hidden rounded-2">
              <div className="position-relative">
                <a href="javascript:void(0)">
                  <img
                    src="../assets/images/products/s11.jpg"
                    className="card-img-top rounded-0"
                    alt="..."
                  />
                </a>
                <a
                  href="javascript:void(0)"
                  className="bg-primary rounded-circle p-2 text-white d-inline-flex position-absolute bottom-0 end-0 mb-n3 me-3"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Add To Cart"
                >
                  <i className="ti ti-basket fs-4" />
                </a>{" "}
              </div>
              <div className="card-body pt-3 p-4">
                <h6 className="fw-semibold fs-4">Cute Soft Teddybear</h6>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-semibold fs-4 mb-0">
                    $285{" "}
                    <span className="ms-2 fw-normal text-muted fs-3">
                      <del>$345</del>
                    </span>
                  </h6>
                  <ul className="list-unstyled d-flex align-items-center mb-0">
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="me-1" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                    <li>
                      <a className="" href="javascript:void(0)">
                        <i className="ti ti-star text-warning" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 px-6 text-center">
          <p className="mb-0 fs-4">
            Design and Developed by{" "}
            <a
              href="https://adminmart.com/"
              target="_blank"
              className="pe-1 text-primary text-decoration-underline"
            >
              AdminMart.com
            </a>{" "}
            Distributed by <a href="https://themewagon.com">ThemeWagon</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</>

</Fragment>


  )
}

export default Dashboard