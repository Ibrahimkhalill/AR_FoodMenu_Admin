/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Line,Pie} from "react-chartjs-2";
import { IoMdArrowUp } from "react-icons/io";
import user from "../assets/user.svg";
import dollar from "../assets/mdi_dollar.svg";
import { FaEuroSign } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { TbCurrencyRiyal } from "react-icons/tb";

import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  ArcElement, // ✅ Register ArcElement for Pie Chart
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
import CircularProgressBar from "./CircularProgressBar";
import GradientLineChart from "./GradientLineChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = ({ data, barChartData }) => {
  const currentYear = new Date().getFullYear();

  // Initialize with the most recent year's data
  const [selectYear, setSelectYear] = useState(currentYear);
  const [selectLineBarYear, setSelectLineBarYear] = useState(new Date().getFullYear())
  const [barAmountData, setBarAmountData] = useState([]);
   const pieData = {
    labels: ["Tourist", "Guide"],
    datasets: [
      {
        data: [data.total_users, data?.total_guides], // Percentage values
        backgroundColor: ["#3FA9F5", "#1D6A78"],
        hoverBackgroundColor: ["#3FA9F5", "#1D6A78"],
      },
    ],

};
  useEffect(() => {
    if (selectYear) {
      const filteredYearData = barChartData?.find(
        (item) => item.year === parseInt(selectYear)
      );
      setBarAmountData(filteredYearData?.data || []);
    }
  }, [barChartData, selectYear]);

  const filteredMonthlyRevenue = barChartData?.filter(
    (item) => item.year == selectYear
  );

  // Transform the filtered data into the barData format
  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Profit", // Use translation for the label
        data: filteredMonthlyRevenue.map((item) => item.data), // Extract the revenue values
        backgroundColor: "#FFD700", // Gold color as specified
      },
    ],
  };
  // Options for Bar Chart
  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#FFDC58" },
      },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: { color: "#FFDC58", callback: (value) => `${value}﷼` },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  // const year_revenue = useMemo(() => {
  //   return barAmountData.reduce((total, amount) => total + amount, 0);
  // }, [barAmountData]);

  return (
    <div>
      {/* Top Stats Section */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-8">
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Revenue</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.total_income}</p>
              
            </div>
          </div>
          <div>
           <TbCurrencyRiyal size={40}/>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Tourist</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.total_users}</p>
            
            </div>
          </div>
          <div>
            <img src={user} alt="" />
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Guide</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.total_guides}</p>
              
            </div>
          </div>
          <div>
            <img src={user} alt="" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex  gap-4 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md border  w-[70%]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Monthly Revenue</h2>
              <div className="flex gap-3 items-center">
               
                <div className="flex items-center   ">
                  <IoMdArrowUp size={20} className="text-[#4CE13F]" />
                  
                </div>
              </div>
            </div>
            <select
              className="p-2 border rounded-md"
              onChange={(e) => setSelectYear(e.target.value)}
            >
               {[...new Set(barChartData?.map((item) => item.year))]
            .reverse()
            .map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}

            </select>
          </div>
          <div className="h-96">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border  w-[30%] ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Total User</h2>
           
          </div>
          <div className="h-96">
          <div className="w-full max-w-sm p-5  rounded-lg ">
      {/* Header */}
  

      {/* Pie Chart */}
      <div className="relative flex justify-center">
        <Pie data={pieData} />
      </div>

      {/* Legend */}
      
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
