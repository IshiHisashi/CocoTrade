import React from "react";

const LandingTeamCard = ({ imgurl, linkedin, name, position }) => {
  return (
    <div>
      <img src={imgurl} alt="member" />
      <div>
        <div className="flex justify-between">
          <h4 className="h4-serif text-bluegreen-700">{name}</h4>
          <img src={linkedin} alt="linkedin" />
        </div>
        <p className="p14-uppercase text-neutral-600">{position}</p>
      </div>
    </div>
  );
};

export default LandingTeamCard;
