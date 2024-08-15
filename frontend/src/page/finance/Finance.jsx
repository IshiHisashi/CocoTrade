/* eslint-disable react/prop-types */
import React from "react";
import LoadingScreen from "../../component/loading/LoadingScreen.jsx";
import MonthlyActivity from "./MonthlyActivity.jsx";
import LineChart from "./LineChart.jsx";

const Finance = ({ URL }) => {
  return (
    <div className="">
      <title>Finances | CocoTrade</title>
      <div className="flex flex-col gap-8 sm:mx-[31px] sm:py-[25px]">
        <LineChart type="cashflow" URL={URL} />
        <MonthlyActivity URL={URL} />
        <LineChart type="market" URL={URL} />
      </div>
    </div>
  );
};

export default Finance;
