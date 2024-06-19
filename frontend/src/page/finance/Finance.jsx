/* eslint-disable react/prop-types */
import React from "react";
import UserIdContext from "./UserIdContext.jsx";
import MonthlyActivity from "./MonthlyActivity.jsx";
// import LineChart from "./LineChart.jsx";
import LineChart from "./LineChart.jsx";

const Finance = () => {
  return (
    <UserIdContext.Provider value="66654dc4c6e950671e988962">
      <div className="flex flex-col gap-8 mx-6 my-4">
        <h1>Finance</h1>
        <LineChart type="cashflow" />
        <MonthlyActivity />
        {/* <LineChart /> */}
        <LineChart type="market" />
      </div>
    </UserIdContext.Provider>
  );
};

export default Finance;
