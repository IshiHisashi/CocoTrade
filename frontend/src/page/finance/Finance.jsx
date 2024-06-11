/* eslint-disable react/prop-types */
import React from "react";
import MonthlyActivity from "./MonthlyActivity.jsx";

const Finance = () => {
  const userId = "66654dc4c6e950671e988962";
  return (
    <div>
      <h1>Finance</h1>
      <MonthlyActivity userId={userId} />
    </div>
  );
};

export default Finance;
