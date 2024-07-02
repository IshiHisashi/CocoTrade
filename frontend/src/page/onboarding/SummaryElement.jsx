import React from "react";

const SummaryElement = (props) => {
  const { label, detail } = props;
  return (
    <div>
      <p className="mb-2">{label}</p>
      <p>{detail}</p>
    </div>
  );
};

export default SummaryElement;
