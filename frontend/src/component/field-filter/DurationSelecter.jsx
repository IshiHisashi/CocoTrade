import React from "react";

const DurationSelecter = ({
  setDurationType,
  setDurationValue,
  thisYear,
  thisMonth,
}) => {
  const handleDurationSelecter = (durationType, durationValue) => {
    setDurationType(durationType);
    setDurationValue(durationValue);
    console.log("clicked");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleDurationSelecter("monthly", thisMonth)}
        type="submit"
      >
        1M
      </button>
      <button
        onClick={() => handleDurationSelecter("yearly", thisYear)}
        type="submit"
      >
        1Y
      </button>
    </div>
  );
};

export default DurationSelecter;
