import React from "react";
import down from "./btn-imgs/downtrend.svg";
import up from "./btn-imgs/uptrend.svg";
import stable from "./btn-imgs/stable.svg";

const TrendBadge = ({ trend = "U", num = "00.00" }) => {
  let imgSrc = up;
  let imgAlt = "Upward Arrow";
  // const width = "w-32";
  // const height = "h-8";
  const padX = "px-4 py-2";
  let bgc = "bg-bluegreen-100";
  const radius = "rounded-xl";
  const flexSetting =
    "flex flex-wrap gap-2 justify-center content-center items-center";

  if (trend === "D") {
    imgSrc = down;
    imgAlt = "Downward Arrow";
    bgc = "bg-orange-100";
  } else if (trend === "N") {
    imgSrc = stable;
    imgAlt = "Stable Arrow";
    bgc = "bg-transparent";
  }

  const badgeClass = [padX, bgc, radius, flexSetting].join(" ");

  return (
    <div
      className={`${badgeClass} ${trend === "N" && "border border-bluegreen-500"}`}
    >
      <img src={imgSrc} alt={imgAlt} className="w-3 h-3" />
      <p
        className={`p14-medium ${trend === "U" || trend === "N" ? "text-bluegreen-500" : "text-red-100"}`}
      >
        Php {num}
      </p>
    </div>
  );
};

export default TrendBadge;
