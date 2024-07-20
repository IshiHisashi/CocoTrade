import React from "react";
import { Tooltip as TooltipMUI, styled, tooltipClasses } from "@mui/material";

const InfoTooltip = styled(({ className, ...props }) => (
  <TooltipMUI
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    arrow
    classes={{ popper: className }}
    enterTouchDelay={0}
  />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#243037",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#243037",
  },
}));

export default InfoTooltip;
