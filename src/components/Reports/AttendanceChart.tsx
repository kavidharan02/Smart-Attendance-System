import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AttendanceChartProps {
  type: 'bar' | 'doughnut';
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }>;
  };
  title?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ 
  type, 
  data, 
  title 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    ...(type === 'bar' && {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="h-64">
        {type === 'bar' ? (
          <Bar data={data} options={options} />
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </div>
  );
};