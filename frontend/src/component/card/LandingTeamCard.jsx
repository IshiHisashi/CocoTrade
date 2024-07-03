import React from "react";

const LandingTeamCard = ({ imgurl, linkedin, name, position }) => {
  return (
    <div>
      <img src={imgurl} alt="member" />
      <div>
        <div className="flex justify-between">
          <h3 className="">{name}</h3>
          <img src={linkedin} alt="linkedin" />
        </div>
        <p className="">{position}</p>
      </div>
    </div>
  );
};

export default LandingTeamCard;
