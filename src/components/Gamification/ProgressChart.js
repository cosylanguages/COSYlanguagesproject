// Import necessary libraries and components.
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components with ChartJS.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * A component that displays a line chart of the user's progress over time.
 * @param {object} props - The component's props.
 * @param {Array} [props.data=[]] - An array of data points for the chart.
 * @returns {JSX.Element} The ProgressChart component.
 */
const ProgressChart = ({ data = [] }) => {
  // The data for the chart.
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'XP Over Time',
        data: data.map(d => d.xp),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // The options for the chart.
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Learning Progress',
      },
    },
  };

  // Render the chart.
  return <Line data={chartData} options={options} />;
};

export default ProgressChart;
