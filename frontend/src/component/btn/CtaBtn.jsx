import React from "react";

/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */

const CtaBtn = ({
  size = "L",
  level = "P",
  onClickFnc = "",
  type = "button",
  innerTxt = "Button",
  disabled = false,
  imgSource = ""
}) => {
  // Declare all the variables to use for tailwind styling
  // These values are for primary btns with Large size
  let width = "w-[185px]";
  let height = "h-[50px]";
  let bgc = "bg-[#FF5b04]";
  let hoverBgc = "hover:bg-[#FF8340]";
  let activeBgc = "active:bg-[#FE2E00]";
  let txtColor = "text-white";
  let activeTxtColor = "active:text-white";
  const fontWeight = "font-semibold";
  const fontSize = "text-[16px]";
  const fontFamily = "dm-sans";
  const radius = "rounded";
  let border = "border-0";
  const borderColor = "border-teal-900";

  // Conditioning based on size
  if (size === "M") {
    width = "w-[162px]";
    height = "h-14";
  } else if (size === "S") {
    width = "w-24";
    height = "h-12";
  }

  // Conditioning based on level(primary/secondary/disabled/outline)
  if (level === "S") {
    bgc = "bg-teal-900";
    hoverBgc = "hover:bg-teal-800";
    activeBgc = "active:bg-teal-700";
  } else if (level === "O") {
    bgc = "bg-transparent";
    hoverBgc = "hover:bg-slate-100";
    activeBgc = "active:bg-teal-700";
    txtColor = "text-teal-900";
    border = "border";
  } else if (level === "D") {
    bgc = "bg-neutral-400";
    hoverBgc = "hover:bg-neutral-400";
    activeBgc = "active:bg-neutral-400";
    txtColor = "text-neutral-100";
    activeTxtColor = "active:text-neutral-100";
  }

  // Conctenate all the class names
  const tailwindClass = [
    width,
    height,
    bgc,
    hoverBgc,
    activeBgc,
    txtColor,
    activeTxtColor,
    fontWeight,
    fontSize,
    fontFamily,
    radius,
    border,
    borderColor,
    "flex",
    "justify-center",
    "items-center",
    "gap-2"
  ].join(" ");

  return (
    <button
      type={type}
      className={tailwindClass}
      onClick={
        onClickFnc === ""
          ? () => {}
          : () => {
              onClickFnc();
            }
      }
      disabled={disabled}
    >
      {imgSource === "" ? "" : <img src={imgSource} alt="" className="h-[24px] w-[24px]"/>}
      {innerTxt}
    </button>
  );
};

export default CtaBtn;
