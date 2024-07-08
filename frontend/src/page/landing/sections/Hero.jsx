import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const Hero = () => {
  return (
    <div className="flex flex-col items-center gap-8 bg-slate-800 py-6">
      <div className="texts text-center flex flex-col gap-4">
        <h2 className="text-white display-serif">
          Streamline Your Copra Trading Operations
        </h2>
        <p className="text-white p-18">
          Improve paperless business transactions and operations with our
          all-in-one web app.{" "}
        </p>
      </div>
      <div className="btn flex gap-[10px]">
        <button type="submit" className="rounded border text-white">
          Download proposal
        </button>
        <CtaBtn innerTxt="Free 14-day trial" size="M" />
      </div>
      <div className="image-section">
        <img src="./images/hero-image_integrated.png" alt="dashboard" />
      </div>
    </div>
  );
};

export default Hero;
