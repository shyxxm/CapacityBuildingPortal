import React, { useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function App() {
  const [chartData, setchartData] = useState([{}]);

  // function to fetch data
  const fetchData = () => {
    fetch('/preTraining_data')
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Server response not OK');
        }
      })
      .then(chartData => {
        setchartData(chartData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000); //Fetch data ever 5 secs

    //Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

   const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.raw; // Directly return the data point value
          }
        }
      },
         
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Courses Offered',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Student Enrolment Count',
          font: {
            weight: 'bold',
            size: 14,
          },
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(0); // remove decimal points
          },
          stepSize:1
        }
      },
    },
  };
  
  const labels = ['Course A', 'Course B', 'Course C', 'Course D', 'Course E'];
  
   const data = {
      labels , // categories
      datasets: [
        {
          label: '',
          data:[65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          barPercentage:0.9 //width of bar
        },
      ],
    };

  return <Bar options={options} data={data} />;
}
