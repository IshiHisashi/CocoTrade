import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const Hero = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="flex flex-col items-center bg-neutral-600 pt-[57px] sm:pt-[95px] pb-[45px]">
      <div className="texts text-center flex flex-col gap-4 px-[23px]">
        <h2 className="text-white h2-serif sm:display-serif">
          Streamline Your Copra Trading Operations
        </h2>
        <p className="text-white p18 pb-[26px]">
          Improve paperless business transactions and operations with our
          all-in-one web app.{" "}
        </p>
      </div>
      <div className="btn flex flex-col sm:flex-row gap-[10px] pb-[47px]">
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
          Download Proposal
        </button>
        <button
          onClick={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
          type="submit"
          className="w-52 h-[50px] bg-[#FF5b04]  hover:bg-[#FF8340]
  active:bg-[#FE2E00] text-white
  active:text-white
  font-semibold
  text-[16px]
  dm-sans
  rounded
  border-0 border-bluegreen-700"
        >
          Free 14-day trial
        </button>

        {/* THIS DOESN'T WORK in DEPLOYMENT 
        <CtaBtn
          innerTxt="Download Proposal"
          size="M-landing"
          level="O-landing"
        />
        <CtaBtn
          innerTxt="Free 14-day trial"
          size="M-landing"
          onClickFnc={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
        /> */}
      </div>
      <div className="image-section px-[15px] sm:px-[15%]">
        <img src="./images/hero-image-rev.png" alt="dashboard" />
      </div>{" "}
    </div>
  );
};

export default Hero;
