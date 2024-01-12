import React, { useState, useEffect, Fragment } from 'react';
import Header from '../components/Header';
import Nav from '../components/NavBar';

function Sample() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch('/members')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Server response not OK');
        }
      })
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

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
                <h5 className="card-title fw-semibold mb-4">Sample Page</h5>
                {typeof data.members === 'undefined' ? (
                  <p>loading...</p>
                ) : (
                  data.members.map((member, i) => (
                    <p key={i}> {member} </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Sample;
