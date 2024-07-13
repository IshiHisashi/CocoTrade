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
          <div className="self-center max-w-[750px]">
            <img
              src="./photos/f1d.png"
              alt="monthly transaction"
              className=""
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
          <div className="row-start-1	row-end-2 self-center">
            <img src="./photos/f2d.png" alt="copra pic" className="" />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="h-[600px] flex">
            <LandingFeatureCard
              title="Inventory Management"
              description="Keep track of your purchases and observe the trend from daily to yearly."
            />
          </div>
          <div className="self-center">
            <img src="./photos/f3d.png" alt="copra pic" className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
