import React from "react";

const LandingBenefitsCard = ({ title, description, imgurl }) => {
  return (
    <div className="flex flex-col items-center bg-white py-8 px-4">
      <img src={imgurl} alt="card" />
      <div className="texts text-center">
        <h3 className="text-[20px] font-semibold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default LandingBenefitsCard;
