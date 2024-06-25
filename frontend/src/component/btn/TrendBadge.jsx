import React from 'react'

const TrendBadge = ({ trend="U", num="20.50" }) => {

  let imgSrc = './src/component/btn/btn-imgs/uptrend.svg';
  let imgAlt = "Upward Arrow";
  const width = "w-32";
  const height = "h-8";
  const padX = "px-2.5";
  let bgc = "bg-slate-100";
  const radius = "rounded-xl";
  const flexSetting = "flex flex-wrap gap-2 justify-center content-center items-center"

  if (trend === "D") {
    imgSrc = './src/component/btn/btn-imgs/downtrend.svg';
    imgAlt = "Downward Arrow";
    bgc = "bg-orange-50";
  }

  const badgeClass = [width, height, padX, bgc, radius, flexSetting].join(" ");

  return (
    <div className={ badgeClass }>
      <img src={ imgSrc } alt={ imgAlt } className='w-3 h-3'/>
      <p className='text-sm font-medium text-gray-600 font-sans'>Php {num}</p>
    </div>
  )
}

export default TrendBadge
