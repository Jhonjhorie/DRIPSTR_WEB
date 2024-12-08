import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const salesData = [100, 200, 300, 500, 30, 10, 20]; // Example sales data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"]; // X-axis labels

function SalesStatistics() {
  return (
    <div className="w-full bg-slate-600 h-full shadow-md p-5 rounded-3xl">
      <div className="w-full bg-white h-full rounded-3xl place-items-center">
        <BarChart
          series={[
            {
              data: salesData,
              label: "Sales",
              id: "salesId",
              yAxisId: "salesAxisId",
            },
          ]}
          xAxis={[
            {
              data: months,
              scaleType: "band",
            },
          ]}
          yAxis={[{ id: "salesAxisId" }]}
          barStyle={{}}
        />
      </div>
    </div>
  );
}

export default SalesStatistics;
