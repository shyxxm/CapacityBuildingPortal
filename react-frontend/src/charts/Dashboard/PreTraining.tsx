import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

import axios from "../../services/axiosConfig";

// import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function App() {
  const [chartData, setChartData] = useState([{}]);

  // // function to fetch data
  // const fetchData = () => {
  //   fetch('/preTraining_data')
  //     .then(res => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw new Error('Server response not OK');
  //       }
  //     })
  //     .then(chartData => {
  //       setchartData(chartData);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // };

  // Function to fetch data
  const fetchData = () => {
    axios
      .get("/preTraining_data")
      .then((res) => {
        // Axios automatically handles JSON conversion
        setChartData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000); //Fetch data ever 5 secs

    //Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            console.log(context);
            let labelIndex = context.dataIndex; //Index of the current bar
            let items = chartData[labelIndex]; //Get the list for the current bar
            if (Array.isArray(items)) {
              return items; //join the items with a newline
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sub-level Phases",
          font: {
            weight: "bold",
            size: 14,
          },
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "Phase Completion Centre Count",
          font: {
            weight: "bold",
            size: 14,
          },
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return Number(value).toFixed(0); // remove decimal points
          },
          stepSize: 1,
        },
      },
    },
  };

  const labels = [
    "MNA",
    "Pre-Training",
    "Registration",
    "Content Development",
    "Resource Allocation",
    "Research",
    "TTT",
    "Center Set-Up",
  ];

  const data = {
    labels, // categories
    datasets: [
      {
        label: "",
        data: [
          Array.isArray(chartData[0]) ? chartData[0].length : 0,
          Array.isArray(chartData[1]) ? chartData[1].length : 0,
          Array.isArray(chartData[2]) ? chartData[2].length : 0,
          Array.isArray(chartData[3]) ? chartData[3].length : 0,
          Array.isArray(chartData[4]) ? chartData[4].length : 0,
          Array.isArray(chartData[5]) ? chartData[5].length : 0,
          Array.isArray(chartData[6]) ? chartData[6].length : 0,
          Array.isArray(chartData[7]) ? chartData[7].length : 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(231, 76, 60, 0.5)",
          "rgba(241, 196, 15, 0.5)",
          "rgba(22, 160, 133, 0.5)",
        ],
        barPercentage: 0.9, //width of bar
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
