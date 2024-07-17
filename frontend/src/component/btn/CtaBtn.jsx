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
  imgSource = "",
}) => {
  // Declare all the variables to use for tailwind styling
  // These values are for primary btns with Large size
  let width = "max-w-96 w-full";
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
  const borderColor = "border-bluegreen-700";

  // Conditioning based on size
  if (size === "M") {
    width = imgSource ? "w-14 lg:w-[162px]" : "w-[162px]";
    height = "h-14";
  } else if (size === "S") {
    width = "w-24";
    height = "h-12";
  }

  // Conditioning based on level(primary/secondary/disabled/outline)
  if (level === "S") {
    bgc = "bg-bluegreen-700";
    hoverBgc = "hover:bg-bluegreen-600";
    activeBgc = "active:bg-bluegreen-500";
  } else if (level === "O") {
    bgc = "bg-transparent";
    hoverBgc = "hover:bg-bluegreen-100";
    activeBgc = "active:bg-bluegreen-500";
    txtColor = "text-bluegreen-700";
    activeTxtColor = "active:text-neutral-0";
    border = "border";
  } else if (level === "D") {
    bgc = "bg-neutral-300";
    hoverBgc = "hover:bg-neutral-300";
    activeBgc = "active:bg-neutral-300";
    txtColor = "text-neutral-0";
    activeTxtColor = "active:text-neutral-0";
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
    "gap-2",
  ].join(" ");

  return (
    <button
      type={type}
      className={`${tailwindClass} ${size === "L" && "justify-self-center"}`}
      onClick={
        onClickFnc === ""
          ? () => {}
          : () => {
              onClickFnc();
            }
      }
      disabled={disabled}
    >
      {imgSource && (
        <img src={imgSource} alt="" className="h-[24px] w-[24px]" />
      )}
      <span className={imgSource && "hidden lg:inline-block"}>{innerTxt}</span>
    </button>
  );
};

export default CtaBtn;
