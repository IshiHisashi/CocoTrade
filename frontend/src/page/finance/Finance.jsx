/* eslint-disable react/prop-types */
import React from "react";
// import UserIdContext from "./UserIdContext.jsx";
import MonthlyActivity from "./MonthlyActivity.jsx";
import LineChart from "./LineChart.jsx";

const Finance = ({ URL }) => {
  return (
    <div className="flex flex-col gap-8 mx-[31px] py-[25px]">
      <LineChart type="cashflow" URL={URL} />
      <MonthlyActivity URL={URL} />
      <LineChart type="market" URL={URL} />
    </div>
  );
};

export default Finance;
