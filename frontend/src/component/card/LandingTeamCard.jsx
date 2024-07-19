import React from "react";

const LandingTeamCard = ({ imgurl, linkedin, name, position }) => {
  return (
    <div>
      <img src={imgurl} alt="member" />
      <div>
        <div className="flex justify-between mt-[15px]">
          <h4 className="h4-serif text-bluegreen-700">{name}</h4>
          <a href={linkedin} className="self-center" target="_blank">
            <img
              src="./icon _LinkedIn_.png"
              alt="linkedin"
              className="w-4 h-4 "
            />
          </a>
        </div>
        <p className="p14-uppercase text-neutral-600">{position}</p>
      </div>
    </div>
  );
};

export default LandingTeamCard;
