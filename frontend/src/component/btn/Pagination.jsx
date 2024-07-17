import React from 'react'
import rightArrow from "../../assets/icons/rightArrow.svg";
import leftArrow from "../../assets/icons/leftArrow.svg";


/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */

const Pagination = ({ size = "L", onClickFnc = "", pageNum = "L" }) => {

    // Declare all the variables to use for tailwind styling
  // These values are for primary btns with Large size
  let width = "w-10";
  let height = "h-10";
  let bgc = "bg-white";
  let hoverBgc = "hover:bg-slate-100";
  let activeBgc = "active:bg-white";
  let txtColor = "text-gray-600";
  const fontWeight = "font-medium";
  const fontSize = "text-sm";
  const fontFamily = "font-sans";
  const radius = "rounded";
  const border = "border";
  let borderColor = "border-slate-100";
  let hoverBorder = "hover:border-teal-700";
  let activeBorder = "active:border-teal-700";
  let innerContent = pageNum;
  const flexSetting = "flex flex-wrap justify-center content-center";

  // Change content on pagination btn itself like "arrow icon" or number
  if (pageNum === "L") {
    innerContent = <img src={leftArrow} alt="Go to previous page" className=''/>
  } else if (pageNum === "R") {
    innerContent = <img src={rightArrow} alt="Go to next page" className=''/>
  } else {
    innerContent = pageNum;
  }

  // Conditioning based on size
  if (pageNum !== "L" && pageNum !== "R") {
    if (pageNum > 99) {
      width = "w-8";
    } else {
      width = "w-6";
    }
    height = "h-6";
    borderColor = "border-white";
    hoverBorder = "hover:border-slate-100";
    activeBorder = "active:border-teal-900"
  } else if (size === "M") {
    width = "w-8";
    height = "h-8";
  } else if (size === "S") {
    width = "w-6";
    height = "h-6";
  }

  // Conctenate all the class names
  const tailwindClass = [width, height, bgc, hoverBgc, activeBgc, txtColor, fontWeight, fontSize, fontFamily,  radius, border, borderColor, hoverBorder, activeBorder, flexSetting].join(" ");

  return (
    <button 
      type="button"
      className={tailwindClass}
      onClick={onClickFnc === "" ? () => {} : () => {onClickFnc()}}
    >
      { innerContent }
    </button>
  )
}

export default Pagination
