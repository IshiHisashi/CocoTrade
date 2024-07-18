import React from "react";

const LandingFooter = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-[22px] items-center md:justify-between bg-slate-800 px-[120px] py-[30px] text-bluegreen-100">
      <div>
        <p className="p14 lg:h4-sans-uppercase">
          &copy; 2024 CocoTrade. All rights reserved.
        </p>
      </div>
      <div>
        <button type="submit" className=" text-white  rounded border w-52 h-14">
          Download proposal
        </button>
      </div>
    </div>
  );
};

export default LandingFooter;
