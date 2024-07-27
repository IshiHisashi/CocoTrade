import React from "react";

/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */

const TabBtn = ({
  type = "submit",
  onClickFnc = "",
  innerTxt = "1Y",
  isActive = false,
}) => {
  // Declare all the variables to use for tailwind styling
  // These values are for primary btns with Large size
  const width = "w-14";
  const height = "h-8";
  const bgc = "bg-white";
  const hoverBgc = "hover:bg-slate-100";
  const activeBgc = "active:bg-neutral-600";
  const bgcForActiveState = "bg-neutral-600";
  const txtColor = "text-neutral-300";
  const activeTxtColor = "active:text-white";
  const txtColorForActive = "text-white";
  const fontWeight = "font-700";
  const fontSize = "text-xs";
  const fontFamily = "legend14";
  const radius = "rounded";
  const border = "border";
  const borderColor = "border-neutral-100";
  const borderColorForActive = "border-neutral-600";
  const hoverBorder = "hover:border-neutral-600";
  const activeBorder = "active:border-neutral-600";

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
    hoverBorder,
    activeBorder,
  ].join(" ");

  const tailwindClassForActiveState = [
    width,
    height,
    bgcForActiveState,
    txtColorForActive,
    fontWeight,
    fontSize,
    fontFamily,
    radius,
    border,
    borderColorForActive,
    activeBorder,
  ].join(" ");

  return (
    <button
      type={type}
      className={isActive ? tailwindClassForActiveState : tailwindClass}
      onClick={
        onClickFnc === ""
          ? () => {}
          : () => {
              onClickFnc();
            }
      }
    >
      {innerTxt}
    </button>
  );
};

export default TabBtn;
