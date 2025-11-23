import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const STATUS_ORDER = [
  "Applied",
  "Online Test",
  "Interview",
  "Offer",
  "Rejected",
  "On Hold",
];

const DashboardCharts = ({ byStatus }) => {
  const labels = STATUS_ORDER;
  const values = labels.map((status) => byStatus[status] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: values,
        backgroundColor: "rgba(99, 102, 241, 0.7)",     // primary
        borderColor: "rgba(129, 140, 248, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#e5e7eb",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(75, 85, 99, 0.9)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#9ca3af",
          stepSize: 1,
        },
        grid: {
          color: "rgba(31, 41, 55, 0.8)",
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>Applications by status</h2>
        <p>See how your pipeline is distributed.</p>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardCharts;
