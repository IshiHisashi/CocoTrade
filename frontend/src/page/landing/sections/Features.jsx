import React from "react";
import LandingFeatureCard from "../../../component/card/LandingFeatureCard";

const Features = () => {
  return (
    <div className="bg-white pt-[94px] pb-[136px] px-[120px]">
      <div className="texts text-center pb-[120px]">
        <h2 className="h2-serif text-bluegreen-700">Features</h2>
        <p className="p18 text-neutral-600">
          Discover the key features of the web app
        </p>
      </div>
      <div className="flex flex-col gap-[160px]">
        <div className="grid grid-cols-[380px_auto] grid-rows-1 gap-[80px]">
          <div className="h-[600px] flex">
            <LandingFeatureCard
              title="Simplify Finances"
              description="Take a quick glance at your monthly activity to track purchases and sales."
            />
          </div>
          <div className="relative">
            <img
              src="./images/simplify-finances.png"
              alt="monthly transaction"
              className="absolute z-50 bottom-[-30px] right-[60%]"
            />
            <img
              src="./photos/cocotrade-16_d.png"
              alt="copra pic"
              className="absolute right-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-1">
          <div className="h-[600px] flex col-start-2 col-end-3 justify-self-end">
            <LandingFeatureCard
              title="Real-time Market Pricing"
              description="Set your own copra price relative to the world market price."
            />
          </div>
          <div className="row-start-1	row-end-2 relative">
            <img
              src="./photos/cocotrade-11_d.png"
              alt="copra pic"
              className="absolute"
            />
            <img
              src="./images/palm-oil-price.png"
              alt="price_1"
              className="absolute top-[40%] right-0"
            />
            <img
              src="./images/copra-purchase-price.png"
              alt="price_2"
              className="absolute bottom-0 right-[20%]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="h-[600px] flex">
            <LandingFeatureCard
              title="Inventory Management"
              description="Keep track of your purchases and observe the trend from daily to yearly."
            />
          </div>
          <div className="relative">
            <img
              src="./photos/cocotrade-14_d.png"
              alt="copra pic"
              className="absolute"
            />
            <img
              src="./images/inventory-management.png"
              alt="inventory"
              className="absolute z-50 bottom-0 right-[40%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
