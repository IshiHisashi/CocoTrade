import React from "react";
import LandingTeamCard from "../../../component/card/LandingTeamCard";

const Team = () => {
  return (
    <div className="py-10 flex flex-col gap-4 px-10">
      <div className="texts flex flex-col gap-2 text-center">
        <h3 className="text-[36px] font-bold">The Team</h3>
        <p>
          MEET THE DESIGNERS AND DEVELOPERS who worked together on this project.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
        <LandingTeamCard name="XXX" position="project manager" />
      </div>
    </div>
  );
};

export default Team;
