import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const Hero = () => {
  return (
    <div className="flex flex-col items-center gap-8 bg-slate-800 py-6">
      <div className="texts text-center flex flex-col gap-4">
        <h2 className="text-white text-[36px]">
          Streamline Your Copra Trading Operations
        </h2>
        <p className="text-white text-[18px]">
          Improve paperless business transactions and operations with our
          all-in-one web app.{" "}
        </p>
      </div>
      <CtaBtn innerTxt="Request a Demo" />
      <img src="#" alt="hero" />
    </div>
  );
};

export default Hero;
