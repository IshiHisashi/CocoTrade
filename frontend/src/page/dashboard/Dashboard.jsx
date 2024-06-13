import React from "react";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";
import UserIdContext from "./UserIdContext.jsx";

const Dashboard = () => {
  return (
    <UserIdContext.Provider value="66640d8158d2c8dc4cedaf1e">
      <p>You have an upcoming shipment on May 8, 2024</p>
      <button type="button">Add Purchase</button>

      <section className="grid grid-cols-2">
        <PriceIndicatorCard type="market" />
        <PriceIndicatorCard type="suggestion" />
      </section>
    </UserIdContext.Provider>
  );
};

export default Dashboard;
