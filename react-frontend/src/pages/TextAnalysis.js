import React, { Fragment, useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Nav from "../components/NavBar";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "../services/axiosConfig"; // Import the configured Axios instance
import TextField from "@mui/material/TextField";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-plugin-datalabels";

const steps = [
  "Select type of text to analyse",
  "Confirm text to analyse",
  "Analysis Output",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TextAnalysis() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "SDG Predictions",
        data: [],
        borderColor: "rgba(0, 51, 153, 1)",
        backgroundColor: "rgba(0, 153, 51, 0.5)",
        pointStyle: "circle",
        pointRadius: 10,
        pointHoverRadius: 15,
      },
    ],
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Important Words",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [pointStyle, setPointStyle] = useState("crossRot");

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chartInstance.update();
    }
  }, [pointStyle]);

  const config = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: `Point Style: ${pointStyle}`,
      },
    },
  };

  const actions = [
    "circle",
    "cross",
    "crossRot",
    "dash",
    "line",
    "rect",
    "rectRounded",
    "rectRot",
    "star",
    "triangle",
    false,
  ];

  const [extractedText, setExtractedText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [type, setType] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showRow, setShowRow] = useState(false);
  const [showgraph, setShowGraph] = useState(false);
  const [stopSpinning, setStopSpinning] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [keyphrases, setKeyphrases] = useState([]);

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const fileInputRef = useRef(null);

  const handleNext = (event) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === 0) {
      if (type === "plain_text") {
        handlePlainTextNext(event);
      } else if (type === "whatsapp_chat") {
        handleWhatsAppSubmit(event);
      } else {
        handleSubmit(event);
      }
    } else if (activeStep === 1) {
      handleStep2Next(event);
    } else if (activeStep === 2) {
      // handleStep3Next(event);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlainTextNext = (event) => {
    // Custom logic for plain text
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileUploaded(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const response = await axios.post("/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedText = response.data.text;
      setExtractedText(extractedText);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleWhatsAppSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    try {
      const response = await axios.post("/whatsapp_text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedText = response.data.text;
      setExtractedText(extractedText);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
    }
    return colors;
  };

  const generateBorderColors = (colors) => {
    return colors.map((color) => color.replace("0.2", "1"));
  };

  const handleStep2Next = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/process_text", {
        text: extractedText,
      });
      const processedText = response.data.text;
      const predictedSentiment = response.data.sentiment;
      const predictions = response.data.predictions;
      const importantWords = response.data.important_words.map(
        (item) => item.word
      );
      const importantWeights = response.data.important_words.map(
        (item) => item.weight
      );

      setSentiment(predictedSentiment);
      setKeyphrases(importantWords);

      const sortedPredictions = predictions.sort((a, b) => b.score - a.score);
      const selectedImageKey = sortedPredictions[0].label;

      setSelectedImage(selectedImageKey);
      setShowGraph(true);
      setShowImage(true);
      setShowRow(true);
      setStopSpinning(true);

      setChartData({
        labels: sortedPredictions.map(
          (prediction) => `SDG ${prediction.label}`
        ),
        datasets: [
          {
            label: "SDG Predictions",
            data: sortedPredictions.map((prediction) => prediction.score),
            borderColor: "rgba(0, 51, 153, 1)",
            backgroundColor: "rgba(0, 153, 51, 0.5)",
            pointStyle: "circle",
            pointRadius: 10,
            pointHoverRadius: 15,
          },
        ],
      });

      const colors = generateColors(importantWords.length);

      const barChartData = {
        labels: importantWords.slice(0, 10),
        datasets: [
          {
            label: "Important Words",
            data: importantWeights.slice(0, 10),
            backgroundColor: colors,
            borderColor: generateBorderColors(colors),
            borderWidth: 1,
          },
        ],
      };
      setBarChartData(barChartData);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const ferrisOfTechs = [
    "SDG 1.png",
    "SDG 2.png",
    "SDG 3.png",
    "SDG 4.png",
    "SDG 5.png",
    "SDG 6.png",
    "SDG 7.png",
    "SDG 8.png",
    "SDG 9.png",
    "SDG 10.png",
    "SDG 11.png",
    "SDG 12.png",
    "SDG 13.png",
    "SDG 14.png",
    "SDG 15.png",
    "SDG 16.png",
    "SDG 17.png",
  ];

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
                      Text Analysis
                    </h5>
                    <div className="card mb-0">
                      <div className="card-body p-4">
                        <Box sx={{ width: "100%" }}>
                          <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                              const stepProps = {};
                              const labelProps = {};

                              return (
                                <Step key={label} {...stepProps}>
                                  <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                              );
                            })}
                          </Stepper>
                          {activeStep === steps.length ? (
                            <React.Fragment>
                              <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  pt: 2,
                                }}
                              >
                                <Box sx={{ flex: "1 1 auto" }} />
                                <Button onClick={handleReset}>Reset</Button>
                              </Box>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              {activeStep !== 2 && (
                                <Typography
                                  sx={{ mt: 10, textAlign: "center" }}
                                >
                                  Step {activeStep + 1}
                                </Typography>
                              )}
                              <Box
                                sx={{
                                  pt: 2,
                                }}
                              >
                                {activeStep === 0 ? (
                                  <React.Fragment>
                                    {/* Step 1 */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                      }}
                                    >
                                      <FormControl sx={{ m: 1 }}>
                                        <InputLabel id="demo-simple-select-label">
                                          Type
                                        </InputLabel>
                                        <Select
                                          sx={{ width: 200 }}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          value={type}
                                          label="Type"
                                          onChange={handleChange}
                                        >
                                          <MenuItem value="plain_text">
                                            Plain text
                                          </MenuItem>
                                          <MenuItem value="pdf">PDF</MenuItem>
                                          <MenuItem value="whatsapp_chat">
                                            WhatsApp Chat
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                      {type === "pdf" ||
                                      type === "whatsapp_chat" ? (
                                        <label
                                          htmlFor="file-upload"
                                          style={{ margin: "8px" }}
                                        >
                                          <Button
                                            variant="contained"
                                            component="span"
                                            sx={{ m: 1 }}
                                          >
                                            Upload
                                          </Button>
                                          <input
                                            id="file-upload"
                                            type="file"
                                            hidden
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                          />
                                        </label>
                                      ) : null}
                                      {/* Conditionally render a message if a file has been uploaded */}
                                      {fileUploaded && (
                                        <p>
                                          File uploaded successfully. Click
                                          Next!
                                        </p>
                                      )}
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                      }}
                                    >
                                      <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                      >
                                        Back
                                      </Button>
                                      <Box sx={{ flex: "1 1 auto" }} />
                                      <Button
                                        onClick={(event) => handleNext(event)}
                                      >
                                        Next
                                      </Button>
                                    </Box>
                                  </React.Fragment>
                                ) : null}
                                {activeStep === 1 ? (
                                  // Step 2
                                  <React.Fragment>
                                    <Box
                                      component="form"
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "& .MuiTextField-root": {
                                          m: 1,
                                          width: "100ch",
                                          textAlign: "center",
                                        },
                                      }}
                                      noValidate
                                      autoComplete="off"
                                    >
                                      <div>
                                        <TextField
                                          id="outlined-multiline-static"
                                          label="Text to Analyse"
                                          multiline
                                          rows={10}
                                          value={extractedText}
                                          onChange={(e) =>
                                            setExtractedText(e.target.value)
                                          }
                                        />
                                      </div>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                      }}
                                    >
                                      <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                      >
                                        Back
                                      </Button>
                                      <Box sx={{ flex: "1 1 auto" }} />
                                      <Button
                                        onClick={(event) => handleNext(event)}
                                      >
                                        Next
                                      </Button>
                                    </Box>
                                  </React.Fragment>
                                ) : null}

                                {activeStep === 2 ? (
                                  // Step 3
                                  <div>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    {stopSpinning && (
                                      <div className="row">
                                        <div className="col-md-4 d-flex">
                                          <div className="card flex-fill">
                                            <div className="card-body d-flex flex-column">
                                              <h5 className="text-center">
                                                Sentiment Analysis
                                              </h5>
                                              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                                                {sentiment && (
                                                  <button
                                                    type="button"
                                                    className={`btn w-100 m-1 ${
                                                      sentiment === "positive"
                                                        ? "btn-success"
                                                        : "btn-danger"
                                                    }`}
                                                  >
                                                    {sentiment === "positive"
                                                      ? "Positive"
                                                      : "Danger"}
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-4 d-flex">
                                          <div className="card flex-fill">
                                            <div className="card-body d-flex flex-column">
                                              <h5 className="text-center">
                                                SDG Classification
                                              </h5>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-4 d-flex">
                                          <div className="card flex-fill">
                                            <div className="card-body d-flex flex-column">
                                              <h5 className="text-center">
                                                Keyword Extraction
                                              </h5>
                                              <br />
                                              <br />
                                              <div className="d-flex flex-wrap">
                                                {keyphrases.map(
                                                  (keyword, index) => (
                                                    <button
                                                      key={index}
                                                      type="button"
                                                      className="btn btn-outline-primary m-1"
                                                      style={{
                                                        flex: "1 0 30%",
                                                      }}
                                                    >
                                                      {keyword}
                                                    </button>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {ferrisOfTechs.map((tech, index) => (
                                      <motion.div
                                        className="ferris-wheel-techs"
                                        key={index + 1}
                                        initial="initial"
                                        animate={
                                          stopSpinning
                                            ? "stop"
                                            : ["animate", "initialHide"]
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
                                            src={require(`../images/sdgs/${tech}`)}
                                            alt={tech}
                                          />
                                        </div>
                                      </motion.div>
                                    ))}

                                    <div
                                      className={`image-shown ${
                                        showImage ? "show" : ""
                                      }`}
                                    >
                                      <img
                                        className="tech-shown"
                                        src={
                                          selectedImage
                                            ? require(`../images/sdgs/SDG ${selectedImage}.png`)
                                            : ""
                                        }
                                        alt="Selected Image"
                                      />
                                    </div>
                                    <div
                                      className={`chart-line-output row ${
                                        showRow ? "show" : ""
                                      }`}
                                    >
                                      <div className="col-lg-6 d-flex align-items-strech">
                                        <div className="card w-100">
                                          <div className="card-body">
                                            <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                              <div className="mb-3 mb-sm-0">
                                                <h5 className="card-title fw-semibold">
                                                  SDG Confidence Score
                                                </h5>
                                              </div>
                                            </div>
                                            <div
                                              className={`chart-line-output ${
                                                showgraph ? "show" : ""
                                              }`}
                                              style={{ height: "400px" }}
                                            >
                                              <Line
                                                ref={chartRef}
                                                data={chartData}
                                                options={config}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 d-flex align-items-strech">
                                        <div className="card w-100">
                                          <div className="card-body">
                                            <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                              <div className="mb-3 mb-sm-0">
                                                <h5 className="card-title fw-semibold">
                                                  Keywords with Weights
                                                </h5>
                                              </div>
                                            </div>
                                            <div
                                              className={`chart-line-output ${
                                                showgraph ? "show" : ""
                                              }`}
                                              style={{ height: "400px" }}
                                            >
                                              <Bar
                                                ref={chartRef}
                                                data={barChartData}
                                                options={{
                                                  responsive: true,
                                                  scales: {
                                                    x: {
                                                      beginAtZero: true,
                                                    },
                                                    y: {
                                                      beginAtZero: true,
                                                    },
                                                  },
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                      }}
                                    >
                                      <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                      >
                                        Back
                                      </Button>
                                      <Box sx={{ flex: "1 1 auto" }} />
                                      <Button onClick={handleNext}>
                                        {activeStep === steps.length - 1
                                          ? "Finish"
                                          : "Next"}
                                      </Button>
                                    </Box>
                                  </div>
                                ) : null}
                              </Box>
                            </React.Fragment>
                          )}
                        </Box>
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
