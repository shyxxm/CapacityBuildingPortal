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

const MNA = 8; 
const Training = 7; 
const Registration = 7; 
const Content = 6; 
const Resource = 8; 
const Research = 1; 
const TTT = 1; 
const SetUp = 2;

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

const labels = ['MNA', 'Pre-Training', 'Registration', 'Content Development', 'Resource Allocation', 'Research', 'TTT', 'Center Set-Up'];

export const data = {
    labels , // Your categories
    datasets: [
      {
        label: '', // Set label to an empty string
        data: [
          MNA,
          Training,
          Registration,
          Content,
          Resource,
          Research,
          TTT,
          SetUp
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(231, 76, 60, 0.5)',
          'rgba(241, 196, 15, 0.5)',
          'rgba(22, 160, 133, 0.5)'
        ],
        
      },
    ],
  };
  

export function App() {
  return <Bar options={options} data={data} />;
}
