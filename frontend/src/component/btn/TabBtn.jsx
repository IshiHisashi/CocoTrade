import React from 'react'

/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */

const TabBtn = ({ type="submit", onClickFnc = "", innerTxt = "1Y", isActive = false }) => {

   // Declare all the variables to use for tailwind styling
  // These values are for primary btns with Large size
  const width = "w-14";
  const height = "h-8";
  const bgc = "bg-white";
  const hoverBgc = "hover:bg-slate-100";
  const activeBgc = "active:bg-teal-900";
  const bgcForActiveState = "bg-teal-900"
  const txtColor = "text-neutral-400";
  const activeTxtColor = "active:text-white";
  const txtColorForActive = "text-white";
  const fontWeight = "font-semibold";
  const fontSize = "text-sm";
  const fontFamily = "font-sans";
  const radius = "rounded";
  const border = "border";
  const borderColor = "border-neutral-100";
  const hoverBorder = "hover:border-teal-900";
  const activeBorder = "active:border-teal-900";


  // Conctenate all the class names
  const tailwindClass = [width, height, bgc, hoverBgc, activeBgc, txtColor, activeTxtColor, fontWeight, fontSize, fontFamily,  radius, border, borderColor, hoverBorder, activeBorder].join(" ");

  const tailwindClassForActiveState = [width, height, bgcForActiveState, txtColorForActive, fontWeight, fontSize, fontFamily,  radius, border, activeBorder].join(" ");

  return (
    <button
      type={type}
      className={isActive ? tailwindClassForActiveState : tailwindClass}
      onClick={onClickFnc === "" ? () => {} : () => {onClickFnc()}}
    >
      {innerTxt}
    </button>
  )
}

export default TabBtn
