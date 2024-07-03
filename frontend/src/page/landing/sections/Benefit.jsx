import React from "react";
import LandingBenefitsCard from "../../../component/card/LandingBenefitsCard";

const Benefit = () => {
  return (
    <div className="py-6 px-4">
      <div className="texts text-center">
        <h2 className="text-[36px] font-bold">Benefits</h2>
        <p>
          it is time to drop the pen and paper for manually monitoring finances,
          transactions, and inventory.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <LandingBenefitsCard
          title="Increase Productivity"
          description="Get real-time data, from copra market price to finances."
          imgurl=""
        />
        <LandingBenefitsCard
          title="Calculate accurately"
          description="Reduce the room for error in finances and inventory logs."
          imgurl=""
        />
        <LandingBenefitsCard
          title="Expedite shipment"
          description="Keep track of your inventory and plan target shipment."
          imgurl=""
        />
      </div>
    </div>
  );
};

export default Benefit;
