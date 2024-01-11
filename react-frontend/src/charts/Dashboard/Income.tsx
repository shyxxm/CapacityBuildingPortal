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

const Business = [0,20]; 
const Placement = [0,90]; 
const FollowUp = [0,75];  

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

const labels = ['Business Set-up', 'Placement Proofs', 'Follow-up Activity'];

export const data = {
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
  

export function App() {
  return <Bar options={options} data={data} />;
}
