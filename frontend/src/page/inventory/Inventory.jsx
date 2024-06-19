import React from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SalesTable from "./SalesTable";
// import PlanShipment from "./PlanShipment";

const Inventory = () => {
  const userId = "66622c07858df5960bf57a06";
  return (
    <div>
      <h1>Inventory</h1>
      {/* <PlanShipment userId={ userId } /> */}
      <BarChart userId={ userId } />
      <LineChart userId={ userId } />
      <SalesTable userId={ userId }/>
    </div>
  );
};

export default Inventory;
