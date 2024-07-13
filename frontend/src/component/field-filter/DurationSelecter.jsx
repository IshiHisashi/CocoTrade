import React, {useState} from "react";
import TabBtn from "../btn/TabBtn";

const DurationSelecter = ({
  setDurationType,
  setDurationValue,
  thisYear,
  thisMonth,
}) => {
  const [activeBtn, setActiveBtn] = useState(null);
  const handleDurationSelecter = (durationType, durationValue, id) => {
    setDurationType(durationType);
    setDurationValue(durationValue);
    setActiveBtn(id);
  };

  const buttons = [
    { id: 1, text: "1M", length: "monthly", pass: thisMonth},
    { id: 2, text: "1Y", length: "yearly", pass: thisYear},
  ]

  return (
    <div className="flex gap-4">
      {buttons.map((button) => (
        <TabBtn
          key={button.id}
          innerTxt={button.text}
          isActive={activeBtn === button.id}
          onClickFnc={() => handleDurationSelecter(button.length, button.pass, button.id)}
        />
      ))}

      {/* <TabBtn
        innerTxt="1M"
        onClickFnc={() => handleDurationSelecter("monthly", thisMonth)}
      />
      <TabBtn
        innerTxt="1Y"
        onClickFnc={() => handleDurationSelecter("yearly", thisYear)}
      /> */}
    </div>
  );
};

export default DurationSelecter;
