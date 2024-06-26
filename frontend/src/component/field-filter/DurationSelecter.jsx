import React from "react";
import TabBtn from "../btn/TabBtn";

const DurationSelecter = ({
  setDurationType,
  setDurationValue,
  thisYear,
  thisMonth,
}) => {
  const handleDurationSelecter = (durationType, durationValue) => {
    setDurationType(durationType);
    setDurationValue(durationValue);
  };

  return (
    <div className="flex gap-4">
      <TabBtn
        innerTxt="1M"
        onClickFnc={() => handleDurationSelecter("monthly", thisMonth)}
      />
      <TabBtn
        innerTxt="1Y"
        onClickFnc={() => handleDurationSelecter("yearly", thisYear)}
      />
    </div>
  );
};

export default DurationSelecter;
