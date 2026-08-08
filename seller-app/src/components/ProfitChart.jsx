import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfitChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            return '$' + value;
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return value + ' units';
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };

  const labels = ['Aug 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5', 'Aug 6', 'Aug 7'];

  const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Net Profit',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        data: [450, 520, 480, 610, 590, 720, 680],
        yAxisID: 'y',
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        type: 'bar',
        label: 'Sales',
        backgroundColor: '#3b82f6',
        data: [1200, 1500, 1300, 1800, 1750, 2100, 1950],
        yAxisID: 'y',
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        type: 'bar',
        label: 'PPC Spend',
        backgroundColor: '#ef4444',
        data: [200, 250, 220, 300, 280, 350, 320],
        yAxisID: 'y',
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
