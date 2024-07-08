import React from "react";
import LandingTeamCard from "../../../component/card/LandingTeamCard";

const Team = () => {
  return (
    <div className="flex flex-col gap-4 px-10 py-[94px]">
      <div className="texts flex flex-col gap-2 text-center py-[60px]">
        <h2 className="h2-serif text-bluegreen-700">The Team</h2>
        <p className="p18 text-neutral-600">
          MEET THE DESIGNERS AND DEVELOPERS who worked together on this project.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-x-[20px] gap-y-[48px] px-[120px]">
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
        <LandingTeamCard
          name="XXX"
          position="project manager"
          imgurl="./photos/cocotrade-12.jpg"
        />
      </div>
    </div>
  );
};

export default Team;
