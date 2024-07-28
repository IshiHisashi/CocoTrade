import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const LandingFooter = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-[22px] items-center md:justify-between bg-neutral-600 px-[120px] py-[30px] text-bluegreen-100">
      <div>
        <p className="p14 lg:h4-sans-uppercase">
          &copy; 2024 CocoTrade. All rights reserved.
        </p>
      </div>
      <div>
        <button
          type="submit"
          className="w-52 h-[50px] bg-transparent  hover:bg-white hover:text-neutral-600
          active:bg-bluegreen-500 text-white
          active:text-neutral-0 border border-white
  font-semibold
  text-[16px]
  dm-sans
  rounded"
        >
          Download proposal
        </button>
      </div>
    </div>
  );
};

export default LandingFooter;
