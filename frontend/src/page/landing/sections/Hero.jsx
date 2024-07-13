import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const Hero = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="flex flex-col items-center bg-neutral-600 pt-[95px] pb-[45px]">
      <div className="texts text-center flex flex-col gap-4">
        <h2 className="text-white display-serif">
          Streamline Your Copra Trading Operations
        </h2>
        <p className="text-white p18 pb-[26px]">
          Improve paperless business transactions and operations with our
          all-in-one web app.{" "}
        </p>
      </div>
      <div className="btn flex gap-[10px] pb-[47px]">
        <button
          type="submit"
          className=" text-white p16 rounded border w-52 h-14"
        >
          Download proposal
        </button>
        <CtaBtn
          innerTxt="Free 14-day trial"
          size="M"
          onClickFnc={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
        />
      </div>
      <div className="image-section px-[15%]">
        <img src="./images/hero-image-rev.png" alt="dashboard" />
      </div>{" "}
    </div>
  );
};

export default Hero;
