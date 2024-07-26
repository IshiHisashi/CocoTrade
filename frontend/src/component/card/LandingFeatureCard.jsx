import React, { Children } from "react";

const LandingFeatureCard = ({ title, description }) => {
  return (
    <div className="self-center">
      <div className="texts">
        <h2 className="h3-serif-feature sm:h2-serif text-bluegreen-700">
          {title}
        </h2>
        <p className="p18">{description}</p>
      </div>
    </div>
  );
};

export default LandingFeatureCard;
