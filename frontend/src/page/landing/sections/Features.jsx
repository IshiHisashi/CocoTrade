import React from "react";
import LandingFeatureCard from "../../../component/card/LandingFeatureCard";

const Features = () => {
  return (
    <div className="bg-white pt-[60px] sm:pt-[94px] pb-[88px] sm:pb-[136px] px-[120px]">
      <div className="texts text-center pb-[120px]">
        <h2 className="h2-serif text-bluegreen-700">Features</h2>
        <p className="p18 text-neutral-600">
          Discover the key features of the web app
        </p>
      </div>

      <div className="flex flex-col gap-[50px]">
        <div className="grid lg:grid-cols-2 grid-rows-1 gap-[30px] lg:gap-[80px]">
          <div className="lg:h-[450px] xl:h-[600px] flex">
            <LandingFeatureCard
              title="Simplify Finances"
              description="Take a quick glance at your monthly activity to track purchases and sales."
            />
          </div>
          <div className="self-center">
            <picture>
              <source srcSet="./photos/f1d.png" media="(min-width: 800px)" />
              <img
                src="./photos/f1m.png"
                alt="Responsive"
                className="w-full h-auto"
              />
            </picture>
          </div>
        </div>

        <div className="flex flex-col lg:flex-none lg:grid lg:grid-cols-2 lg:grid-rows-1 gap-[30px] lg:gap-[80px]">
          <div className="lg:h-[450px] xl:h-[600px] flex col-start-2 col-end-3 lg:justify-end">
            <LandingFeatureCard
              title="Real-time Market Pricing"
              description="Set your own copra price relative to the world market price."
            />
          </div>
          <div className="row-start-1	row-end-2 self-center">
            <picture>
              <source srcSet="./photos/f2d.png" media="(min-width: 800px)" />
              <img
                src="./photos/f2m.png"
                alt="Responsive"
                className="w-full h-auto"
              />
            </picture>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-[30px]  lg:gap-[80px]">
          <div className="lg:h-[450px] xl:h-[600px] flex">
            <LandingFeatureCard
              title="Inventory Management"
              description="Keep track of your purchases and observe the trend from daily to yearly."
            />
          </div>
          <div className="self-center">
            <picture>
              <source srcSet="./photos/f3d.png" media="(min-width: 800px)" />
              <img
                src="./photos/f3m.png"
                alt="Responsive"
                className="w-full h-auto"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
