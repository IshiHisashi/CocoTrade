import React, { Children } from "react";

const LandingFeatureCard = ({ title, description, children }) => {
  return (
    <div>
      <div className="texts">
        <h3 className="text-[24px] font-semibold">{title}</h3>
        <p>{description}</p>
        {children}
      </div>
    </div>
  );
};

export default LandingFeatureCard;
