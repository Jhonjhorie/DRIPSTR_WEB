import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { supabase } from "@/constants/supabase";

function SalesStatistics() {
  const [salesData, setSalesData] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("daily");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("total_price, date_of_order")
          .order("date_of_order", { ascending: true });

        const { data: artistData, error: artistError } = await supabase
          .from("artist_Subscription")
          .select("amount, created_at")
          .order("created_at", { ascending: true });

        const { data: merchantData, error: merchantError } = await supabase
          .from("merchant_Subscription")
          .select("created_at, status")
          .order("created_at", { ascending: true });

        if (ordersError) throw ordersError;
        if (artistError) throw artistError;
        if (merchantError) throw merchantError;

        const aggregatedSales = {};
        ordersData.forEach((order) => {
          const date = new Date(order.date_of_order);
          const key = getDateKey(date, timePeriod);
          const adjustedPrice = order.total_price * 0.03;
          if (!aggregatedSales[key]) aggregatedSales[key] = 0;
          aggregatedSales[key] += adjustedPrice;
        });

        artistData.forEach((subscription) => {
          const date = new Date(subscription.created_at);
          const key = getDateKey(date, timePeriod);
          if (!aggregatedSales[key]) aggregatedSales[key] = 0;
          aggregatedSales[key] += subscription.amount;
        });

        merchantData.forEach((subscription) => {
          const date = new Date(subscription.created_at);
          const key = getDateKey(date, timePeriod);
          const valueToAdd = subscription.status === "Completed" ? 500 : 0;
          if (!aggregatedSales[key]) aggregatedSales[key] = 0;
          aggregatedSales[key] += valueToAdd;
        });

        const sortedDates = Object.keys(aggregatedSales).sort((a, b) => new Date(a) - new Date(b));
        const sortedSales = sortedDates.map((date) => aggregatedSales[date]);

        setDates(sortedDates);
        setSalesData(sortedSales);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [timePeriod]);

  const getDateKey = (date, period) => {
    switch (period) {
      case "daily":
        return date.toLocaleString("default", { day: "numeric", month: "short", year: "numeric" });
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toLocaleString("default", { month: "short", year: "numeric", day: "numeric" });
      case "monthly":
        return date.toLocaleString("default", { month: "short", year: "numeric" });
      case "yearly":
        return date.getFullYear().toString();
      default:
        return date.toLocaleString("default", { month: "short", year: "numeric" });
    }
  };

  const formatCurrency = (value) => `₱${value.toFixed(1)}`;

  // Custom tooltip formatter for monthly view
  const customValueFormatter = (value, context) => {
    const totalSales = value;
    if (timePeriod === "monthly") {
      const profitAfterTax = totalSales * 0.8; // Total sales - 20%
      return `Total Sales: ${formatCurrency(totalSales)}\nProfit After Tax: ${formatCurrency(profitAfterTax)}`;
    }
    return `Total Sales: ${formatCurrency(totalSales)}`;
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-600 h-full shadow-md p-5 rounded-3xl flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-slate-600 h-full shadow-md p-5 rounded-3xl text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 h-full shadow-md p-5 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <p className="text-white text-xl font-bold">Sales Statistics</p>
        <select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="bg-slate-600 rounded-xl text-violet-400 text-lg font-bold cursor-pointer border-none focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="w-full bg-white h-full rounded-3xl place-items-center">
        <BarChart
          series={[
            {
              data: salesData,
              label: "Total Sales",
              id: "salesId",
              yAxisId: "salesAxisId",
              valueFormatter: customValueFormatter, // Use custom formatter
            },
          ]}
          xAxis={[
            {
              data: dates,
              scaleType: "band",
            },
          ]}
          yAxis={[
            {
              id: "salesAxisId",
              valueFormatter: formatCurrency,
            },
          ]}
          height={300}
          margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          tooltip={{ trigger: "item" }} // Ensure tooltip is triggered per bar
        />
      </div>
    </div>
  );
}

export default SalesStatistics;