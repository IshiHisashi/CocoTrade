import React from "react";
import LandingFeatureCard from "../../../component/card/LandingFeatureCard";

const Features = () => {
  return (
    <div className="bg-white py-6 px-4">
      <div className="texts text-center">
        <h2 className="text-[36px] font-bold">Features</h2>
        <p>Discover the key features of the web app</p>
      </div>
      <div className="flex flex-col gap-4">
        <LandingFeatureCard
          title="Simplify Finances"
          description="Take a quick glance at your monthly activity to track purchases and sales."
        >
          <div>
            <img
              src="./images/simplify-finances.png"
              alt="monthly transaction"
            />
            <img src="./photos/cocotrade-16_d.png" alt="copra pic" />
          </div>
        </LandingFeatureCard>
        <LandingFeatureCard
          title="Real-time Market Pricing"
          description="Set your own copra price relative to the world market price."
        >
          <div>
            <img src="./photos/cocotrade-11_d.png" alt="copra pic" />
            <img src="./images/palm-oil-price.png" alt="price_1" />
            <img src="./images/copra-purchase-price.png" alt="price_2" />
          </div>
        </LandingFeatureCard>
        <LandingFeatureCard
          title="Inventory Management"
          description="Keep track of your purchases and observe the trend from daily to yearly."
        >
          <div>
            <img src="./images/inventory-management.png" alt="inventory" />
            <img src="./photos/cocotrade-14_d.png" alt="copra pic" />
          </div>
        </LandingFeatureCard>
      </div>
    </div>
  );
};

export default Features;
