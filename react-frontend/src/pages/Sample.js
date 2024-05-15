import React, { Fragment, useState, useEffect } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function TextAnalysis() {
  const [showImage, setShowImage] = useState(false);
  const [stopSpinning, setStopSpinning] = useState(false);

  useEffect(() => {
    // Set showImage to true after a delay to trigger the animation
    const timeout = setTimeout(() => {
      setShowImage(true);
    }, 15000); // 20 seconds delay

    // Stop spinning after 20 seconds
    const stopTimeout = setTimeout(() => {
      setStopSpinning(true);
    }, 15000); // 20 seconds delay

    return () => {
      clearTimeout(timeout);
      clearTimeout(stopTimeout);
    };
  }, []);

  const ferrisOfTechs = [
    "sdg1.png",
    "sdg2.png",
    "sdg3.png",
    "sdg4.png",
    "sdg5.png",
    "sdg6.png",
    "sdg7.png",
    "sdg8.png",
    "sdg9.png",
    "sdg10.png",
    "sdg11.png",
    "sdg12.png",
    "sdg13.png",
    "sdg14.png",
    "sdg15.png",
    "sdg16.png",
    "sdg17.png",
  ];

  const selectedImage = "sdg5.png";
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
                    <h5 className="card-title fw-semibold mb-4">
                      Inline text elements
                    </h5>
                    <div className="card mb-0">
                      <div className="card-body p-4">
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": { m: 1, width: "60ch" },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <div>
                            <TextField
                              id="outlined-multiline-static"
                              label="Multiline"
                              multiline
                              rows={10}
                              defaultValue="Default Value"
                            />
                          </div>
                        </Box>
                        {ferrisOfTechs.map((tech, index) => (
                          <motion.div
                            className="ferris-wheel-techs"
                            key={index + 1}
                            initial="initial"
                            animate={
                              stopSpinning ? "stop" : ["animate", "initialHide"]
                            }
                            variants={{
                              initial: {
                                opacity: 0,
                              },
                              initialHide: {
                                opacity: 1,
                                transition: {
                                  delay: index + 1,
                                },
                              },
                              animate: {
                                rotate: -360,
                                transition: {
                                  duration: ferrisOfTechs.length,
                                  repeat: Infinity,
                                  delay: index + 1,
                                  ease: "linear",
                                },
                              },
                              stop: {
                                rotate: -360, // Keep the last position
                                transition: {
                                  duration: 0,
                                },
                              },
                            }}
                          >
                            <div className="image-parent">
                              <img
                                className="tech-icon"
                                src={require(`../../public/assets/images/sdgs/${tech}`)}
                                alt={tech}
                              />
                            </div>
                          </motion.div>
                        ))}
                        {/* Display the selected image */}
                        <div
                          className={`image-shown ${showImage ? "show" : ""}`}
                        >
                          <img
                            className="tech-shown"
                            src={require(`../../public/assets/images/sdgs/${selectedImage}`)}
                            alt="Selected Image"
                          />
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
  );
}

export default TextAnalysis;
