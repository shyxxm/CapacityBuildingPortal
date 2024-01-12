import React from 'react';
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

const Inspection = [0,80]; 
const Internal = [0,75]; 
const Project = [0,75]; 
const Stipend = [0,60]; 
const Certification = [0,8];  

export const options: ChartOptions<'bar'> = {
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

const labels = ['Inspection', 'Internal Assesment', 'Project Assesment', 'Stipend Distribution', 'Certification'];

export const data = {
    labels , // Your categories
    datasets: [
      {
        label: '', // Set label to an empty string
        data: [
          Inspection,
          Internal,
          Project,
          Stipend,
          Certification
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
      },
    ],
  };
  

export function App() {
  return <Bar options={options} data={data} />;
}
