import React from "react";
import LandingBenefitsCard from "../../../component/card/LandingBenefitsCard";

const Benefit = () => {
  return (
    <div className="py-[60px] sm:py-[130px] px-[24px] sm:px-[123px]">
      <div className="texts text-center pb-[80px]">
        <h2 className="h2-serif text-bluegreen-700">Benefits</h2>
        <p className="p18">
          It&apos;s time to drop the pen and paper for manually monitoring
          finances, transactions, and inventory.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-[19px]">
        <LandingBenefitsCard
          title="Increase Productivity"
          description="Get real-time data, from copra market price to finances."
          imgurl="./images/increase-productiviry.png"
        />
        <LandingBenefitsCard
          title="Calculate Accurately"
          description="Reduce the room for error in finances and inventory logs."
          imgurl="./images/calculate-accurately.png"
        />
        <LandingBenefitsCard
          title="Expedite Shipment"
          description="Keep track of your inventory and plan target shipment."
          imgurl="./images/expedite-shipment.png"
        />
      </div>
    </div>
  );
};

export default Benefit;
