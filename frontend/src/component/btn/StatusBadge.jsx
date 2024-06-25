import React from 'react'

const StatusBadge = ({ status="P" }) => {

  let width = "w-24";
  const height = "h-7";
  let bgc = "bg-yellow-100";
  let textColor = "text-amber-400";
  let innerTxt = "Pending";
  const radius = "rounded-full";
  const flexSetting = "flex flex-wrap gap-2 justify-center content-center items-center";

  if (status === "O") {
    bgc = "bg-orange-200";
    textColor = "text-orange-400";
    innerTxt = "Ongoing";
  } else if (status === "C") {
    width = "w-28"
    bgc = "bg-slate-100";
    textColor = "text-teal-700";
    innerTxt = "Completed";
  }

  const badgeClass = [width, height, bgc, textColor, radius, flexSetting].join(" ");

  return (
    <div className={ badgeClass }>
      <p className='text-lg font-base font-sans'>{ innerTxt }</p>
    </div>
  )
}

export default StatusBadge
