import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các module cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RevenueChart2025() {
  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Doanh thu năm 2025 (triệu VNĐ)",
        data: [120, 150, 180, 200, 250, 300, 280, 310, 330, 400, 420, 500],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // đỏ
          "rgba(255, 159, 64, 0.2)", // cam
          "rgba(255, 205, 86, 0.2)", // vàng
          "rgba(75, 192, 192, 0.2)", // xanh ngọc
          "rgba(54, 162, 235, 0.2)", // xanh dương
          "rgba(153, 102, 255, 0.2)", // tím
          "rgba(201, 203, 207, 0.2)", // xám
          "rgba(255, 99, 132, 0.2)", // đỏ lặp lại
          "rgba(255, 159, 64, 0.2)", // cam lặp lại
          "rgba(255, 205, 86, 0.2)", // vàng lặp lại
          "rgba(75, 192, 192, 0.2)", // xanh ngọc lặp lại
          "rgba(54, 162, 235, 0.2)", // xanh dương lặp lại
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Doanh thu 12 tháng năm 2025",
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `Doanh thu: ${context.raw} triệu VNĐ`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Tháng" } },
      y: { beginAtZero: true, title: { display: true, text: "Triệu VNĐ" } },
    },
  };


  return <Bar data={data} options={options} />;
}

export default RevenueChart2025;
