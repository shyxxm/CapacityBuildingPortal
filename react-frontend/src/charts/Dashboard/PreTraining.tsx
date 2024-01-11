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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MNA = [0,80]; 
const Training = [0,75]; 
const Registration = [0,75]; 
const Content = [0,60]; 
const Resource = [0,8]; 
const Research = [0,18]; 
const TTT = [0,13]; 
const SetUp = [0,100]; 

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      display: false
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
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
