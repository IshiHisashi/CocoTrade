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
          Comlex image
        </LandingFeatureCard>
        <LandingFeatureCard
          title="Real-time Market Pricing"
          description="Set your own copra price relative to the world market price."
        >
          Comlex image
        </LandingFeatureCard>
        <LandingFeatureCard
          title="Inventory Management"
          description="Keep track of your purchases and observe the trend from daily to yearly."
        >
          Comlex image
        </LandingFeatureCard>
      </div>
    </div>
  );
};

export default Features;
