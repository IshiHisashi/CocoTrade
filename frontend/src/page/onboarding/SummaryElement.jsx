import React from "react";

const SummaryElement = (props) => {
  const { label, detail, preUnit = "", unit = "" } = props;
  return (
    <div>
      <p className="p14">{label}</p>
      <p className="p16">
        {preUnit}
        {detail}
        {unit}
      </p>
    </div>
  );
};

export default SummaryElement;
