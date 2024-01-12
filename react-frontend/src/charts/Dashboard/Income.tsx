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
    fetch('/income_data')
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
    // Call fetchData immediately on component mount
    fetchData();

    // Set up a periodic fetch
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5000 milliseconds (5 seconds)

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

   const options: ChartOptions<'bar'> = {
    responsive: true,
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
            console.log(context)
            let labelIndex = context.dataIndex; // Index of the current bar
            let items = chartData[labelIndex]; // Get the list for the current bar
            if (Array.isArray(items)) {
              return items; // Join the items with a newline
            }
            return ''; // Return an empty string if items is not an array
          }
        }
      },
         
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sub-level Phases',
          font: {
            weight: 'bold',
            size: 12,
          },
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Phase Completion Centre Count',
          font: {
            weight: 'bold',
            size: 12,
          },
        },
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return Number(value).toFixed(0); // remove decimal points
          }
        }
      },
    },
  };
  
  const labels = ['Business Set-up', 'Placement Proofs', 'Follow-up Activity'];
  
   const data = {
      labels , // categories
      datasets: [
        {
          label: '',
          data: [
            Array.isArray(chartData[0]) ? chartData[0].length : 0,
            Array.isArray(chartData[1]) ? chartData[1].length : 0,
            Array.isArray(chartData[2]) ? chartData[2].length : 0,
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          barPercentage:0.9 //width of bar
        },
      ],
    };

  return <Bar options={options} data={data} />;
}
