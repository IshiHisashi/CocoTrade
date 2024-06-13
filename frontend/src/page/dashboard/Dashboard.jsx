import React from "react";
import PriceIndicatorCard from "../../component/card/PriceIndicatorCard.jsx";

const userId = "66640d8158d2c8dc4cedaf1e";

const Dashboard = () => {
  return (
    <>
      <p>You have an upcoming shipment on May 8, 2024</p>
      <button type="button">Add Purchase</button>

      <section className="grid grid-cols-2">
        <PriceIndicatorCard type="market" userId={userId} />
        <PriceIndicatorCard type="suggestion" userId={userId} />
      </section>
    </>
  );
};

export default Dashboard;
