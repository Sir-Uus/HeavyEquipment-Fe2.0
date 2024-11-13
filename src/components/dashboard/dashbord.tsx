import { Bar } from "react-chartjs-2";
import { useDashboardData } from "../../hooks/dashboardHooks/useDashboard";
import { useDashboardActivity } from "../../hooks/dashboardHooks/useDashboard";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashbord = () => {
  const { equipmentsCount, ordersCount, activeUsersCount } = useDashboardData();
  const { data: recentActivity, isLoading } = useDashboardActivity();

  const chartData = {
    labels: recentActivity?.map((activity: any) => `${activity.invoice}`) || [],
    datasets: [
      {
        label: "Transactions",
        data: recentActivity?.map((activity: any) => `${activity.totalAmount}`) || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Recent Activity - Transactions (Last 7 Days)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Invoice",
        },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <a href="/admin/list-equipment">
            <div className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105">
              <h2 className="font-semibold text-lg">Total Equipments</h2>
              <p className="text-2xl font-bold">{equipmentsCount}</p>
            </div>
          </a>
          <div className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105">
            <h2 className="font-semibold text-lg">Total Request</h2>
            <p className="text-2xl font-bold">{ordersCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105">
            <h2 className="font-semibold text-lg">Active Users</h2>
            <p className="text-2xl font-bold">{activeUsersCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-md ">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          {isLoading ? <p>Loading chart...</p> : <Bar data={chartData} options={chartOptions} />}
        </div>
      </main>
    </div>
  );
};

export default Dashbord;
