import React from "react";
import LandingTeamCard from "../../../component/card/LandingTeamCard";

const Team = () => {
  return (
    <div className="flex flex-col gap-4 px-10 py-[60px] sm:py-[94px]">
      <div className="texts flex flex-col gap-2 text-center py-[60px]">
        <h2 className="h2-serif text-bluegreen-700">The Team</h2>
        <p className="p18 text-neutral-600 px-4">
          Meet the designers and developers who worked together on this project{" "}
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[48px] px-[120px]">
        <LandingTeamCard
          name="Kathreen Nervez"
          position="Project Manager & UI/UX Designer"
          imgurl="./photos/kat.png"
          linkedin="https://www.linkedin.com/in/kathreen-grace-nervez-1b53b058/"
        />
        <LandingTeamCard
          name="Jennifer Mallari"
          position="Lead UI/UX Designer"
          imgurl="./photos/jen.png"
          linkedin="https://www.linkedin.com/in/jennifer-mallari-bb84b4109/"
        />
        <LandingTeamCard
          name="Hazel Lao"
          position="UI/UX Designer"
          imgurl="./photos/hazel.png"
          linkedin="https://www.linkedin.com/in/hazel-lao-34376a293/"
        />
        <LandingTeamCard
          name="Eliza Francisco"
          position="UI/UX Designer"
          imgurl="./photos/eliza.png"
          linkedin="https://www.linkedin.com/in/eliza-francisco-1160a893/"
        />
        <LandingTeamCard
          name="Hisashi Ishihara"
          position="Dev Lead & Full-stack Developer"
          imgurl="./photos/ishi.png"
          linkedin="https://www.linkedin.com/in/ishi-hisashi-ishihara-618760229/"
        />
        <LandingTeamCard
          name="Sachi Asano"
          position="Full-stack Developer"
          imgurl="./photos/sacha.png"
          linkedin="https://www.linkedin.com/in/sachi-sacha-asano/"
        />
        <LandingTeamCard
          name="Akifumi Hayashi"
          position="Full-stack Developer"
          imgurl="./photos/aki.png"
          linkedin="https://www.linkedin.com/in/akifumi-hayashi-2b877923b/"
        />
        <LandingTeamCard
          name="Prathibha Wijetunga"
          position="Full-stack Developer"
          imgurl="./photos/prathibha.png"
          linkedin="https://lk.linkedin.com/in/shehani-wijetunga-20002b184"
        />
      </div>
    </div>
  );
};

export default Team;
