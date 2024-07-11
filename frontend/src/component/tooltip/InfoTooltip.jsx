import React from "react";
import { Tooltip as TooltipMUI, styled, tooltipClasses } from "@mui/material";

const InfoTooltip = styled(({ className, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TooltipMUI {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#243037",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#243037",
  },
}));

export default InfoTooltip;
