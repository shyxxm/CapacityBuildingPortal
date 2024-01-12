import React, { useState, useEffect, Fragment } from 'react';
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

const Business = [20]; 
const Placement = [90]; 
const FollowUp = [75];  

// const tooltipLists = [
//   ["Centre 1", "Centre 2", "Centre 3"],
//   ["Centre 5", "Centre 2"],
//   ["Centre 1", "Centre 2"],
// ];


  

export function App() {
  const [chartData, setchartData] = useState([{}]);

  useEffect(() => {
    fetch('/chart_data')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Server response not OK');
        }
      })
      .then((chartData) => {
        setchartData(chartData);
        console.log(chartData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

   const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Ensured as a specific string literal
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let labelIndex = context.dataIndex; // Index of the current bar
            let items = chartData[labelIndex]; // Get the list for the current bar
            return items; // Return an array of strings (each string is a line in the tooltip)
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
            weight: 'bold',  // Make the label bold
            size: 12,        // You can adjust the size as needed
          },
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: 'Phase Completion Centre Count',
          font: {
            weight: 'bold',  // Make the label bold
            size: 12,        // You can adjust the size as needed
          },
        },
        beginAtZero: true,
      },
    },
  };
  
  const labels = ['Business Set-up', 'Placement Proofs', 'Follow-up Activity'];
  
   const data = {
      labels , // Your categories
      datasets: [
        {
          label: '', // Set label to an empty string
          data: [
            Business,
            Placement,
            FollowUp
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
        },
      ],
    };

  return <Bar options={options} data={data} />;
}
