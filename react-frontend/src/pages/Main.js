import GoogleMap from "../maps/GoogleMap.tsx";
import MainBarChart from "../charts/MainPage/BarChart.tsx";
import gsap from "gsap";
import SplitTextJS from "split-text-js";
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ImpleTime from "../charts/Timeline/Implementation.tsx";

import { useNavigate, Link } from "react-router-dom";

function Main() {

  const [chartData, setChartData] = useState({ data: [[]] });
  const [programData, setProgramData] = useState({ data: [[]] });
  const [programName, setProgramName] = useState({ data: [[]] });



  // function to fetch data
  const fetchData = () => {
    fetch('/view_trainer_data')
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Server response not OK');
        }
      })
      .then(chartData => {
        setChartData(chartData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

    // function to fetch data
    const fetchProgramData = () => {
      fetch('/view_program_count')
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Server response not OK');
          }
        })
        .then(programData => {
          setProgramData(programData);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    };

        // function to fetch data
        const fetchProgramName = () => {
          fetch('/view_program_name')
            .then(res => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error('Server response not OK');
              }
            })
            .then(programName => {
              setProgramName(programName);
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        };

    useEffect(() => {
      // Call fetchData and fetchProgramData immediately on component mount
      fetchData();
      fetchProgramData();
      fetchProgramName();
    
      // Set up a periodic fetch
      const intervalId = setInterval(fetchData, 5000); // Fetch every 5000 milliseconds (5 seconds)
      const intervalProgramId = setInterval(fetchProgramData, 5000); // Fetch every 5000 milliseconds (5 seconds)
      const intervalProgramName= setInterval(fetchProgramName, 5000); // Fetch every 5000 milliseconds (5 seconds)

    
      // Clear intervals on component unmount
      return () => {
        clearInterval(intervalId);
        clearInterval(intervalProgramId);
        clearInterval(intervalProgramName);

      };
    }, []);


  const navigate = useNavigate();
  useEffect(() => {
    const titles = document.querySelectorAll(".p2");
    const colors = ["#582442", "#d56f0d", "#444444"];
    const tlx = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });

    titles.forEach((title, titleIndex) => {
      const words = title.innerText.split(/\s+/);
      title.innerHTML = ""; // Clear the original text
      let colorIndex = 0;

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.color = colors[colorIndex % colors.length];
        title.appendChild(wordSpan);
        colorIndex++;

        // Add a space after each word except the last one
        if (wordIndex < words.length - 1) {
          title.appendChild(document.createTextNode(" "));
        }

        // Split each word into characters for animation
        const splitWord = new SplitTextJS(wordSpan, { type: "chars" });

        // Animate the characters in the word
        tlx.from(
          splitWord.chars,
          {
            opacity: 0,
            y: 80,
            rotateX: -90,
            stagger: 0.03, // Consistent delay between characters
          },
          `+=${titleIndex * 0.2}` // Start after a delay based on title index
        );
      });

      // Fade out each word as a whole
      tlx.to(
        title.children,
        {
          opacity: 0,
          y: -80,
          rotateX: 90,
          stagger: 0.3, // Delay between fading out each word
        },
        `>+${words.length * 0.2}` // Start after all words have animated in
      );
    });
  }, []);

  const [isFirstZoomed, setIsFirstZoomed] = useState(false);
  const [isSecondZoomed, setIsSecondZoomed] = useState(false);
  const firstItemRef = useRef(null);
  const secondItemRef = useRef(null);
  const thirdItemRef = useRef(null);

  const isInView = (rect) => {
    const windowHeight = window.innerHeight;
    return rect.top >= 0 && rect.bottom <= windowHeight;
  };

  const checkZoom = () => {
    const firstItemRect = firstItemRef.current.getBoundingClientRect();
    const secondItemRect = secondItemRef.current.getBoundingClientRect();
    const thirdItemRect = thirdItemRef.current.getBoundingClientRect();

    const firstItemInView = isInView(firstItemRect);
    const secondItemInView = isInView(secondItemRect);
    const thirdItemInView = isInView(thirdItemRect);

    setIsFirstZoomed(firstItemInView && !secondItemInView);
    setIsSecondZoomed(!firstItemInView && secondItemInView && !thirdItemInView);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkZoom);
    checkZoom(); // Initialize zoom state based on current scroll position
    return () => window.removeEventListener("scroll", checkZoom);
  }, []);

  const [project, setProject] = React.useState("");

  const handleChange = (event) => {
    setProject(event.target.value);
  };

  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical">
      <div className="body-wrapper">
        {/*  Header Start */}
        {/* <Header></Header> */}
        <div className="container-fluid">
          <div className="main-map2">
            <div className="text-wrapper2">
              <p className="p2">Capacity Building Programs</p>
              <p className="p2">Social Interventions</p>
              <p className="p2">Programs Monitoring</p>
            </div>
          </div>
          <div className="centered-container">
            <div className="row justify-content-center">
              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text2">
                      Number of Projects
                    </h5>
                    <p className="text-center normal-text">{programData.data[0][0]}</p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text2">
                      Number of Centers
                    </h5>
                    <p className="text-center normal-text">6</p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text">
                      Number of Locations
                    </h5>
                    <p className="text-center normal-text">6</p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text2">
                      Number of Courses
                    </h5>
                    <p className="text-center normal-text">6</p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text">
                      Number of Trainees
                    </h5>
                    <p className="text-center normal-text">6</p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex">
                <div className="card flex-fill card-hover">
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-center header-text2">
                      Number of Trainers
                    </h5>
                    <p className="text-center normal-text">{chartData.data[0][0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`main-map row ${isFirstZoomed ? "zoom-effect" : ""}`}
            ref={firstItemRef}
          >
            <div className="col-lg-6 d-flex justify-content-center align-items-center mainpage-font text-center">
              {" "}
              <p>Geographical Distribution of Centers</p>
            </div>
            <div className="col-lg-6 d-flex align-items-stretch">
              <GoogleMap></GoogleMap>
            </div>
          </div>

          <div
            className={`row main-map ${isSecondZoomed ? "zoom-effect" : ""}`}
            ref={secondItemRef}
          >
            <div className="col-lg-6 d-flex align-items-stretch">
              <MainBarChart></MainBarChart>
            </div>
            <div className="col-lg-6 d-flex justify-content-center align-items-center mainpage-font2 text-center">
              <p>Project Level Statistics</p>
            </div>
          </div>

          <div className="main-map" ref={thirdItemRef}>
          <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={project}
          label="Project"
          onChange={handleChange}
        >
          {programName.data.map((name, index) => (
            <MenuItem key={index} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
          </div>
          <div className="centered-button">
            <Link to="/dashboard">
              <button type="button" className="btn btn-outline-success m-1">
                Submit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
