import React from "react";

const LandingBenefitsCard = ({ title, description, imgurl }) => {
  return (
    <div className="flex flex-col gap-[26px] items-center bg-white py-8 px-[35px]">
      <img src={imgurl} alt="card" className="w-[119px] h-[90px]" />
      <div className="texts text-center">
        <h3 className="h3-serif text-neutral-600">{title}</h3>
        <p className="p18 text-neutral-600">{description}</p>
      </div>
    </div>
  );
};

export default LandingBenefitsCard;
