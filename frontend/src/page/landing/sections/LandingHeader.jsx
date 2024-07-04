import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const LandingHeader = () => {
  return (
    <div className="flex justify-between py-6">
      <img src="#" alt="logo" />
      <ul className="flex gap-4">
        <li>Benefits</li>
        <li>Features</li>
        <li>Team</li>
        <li>Contact</li>
      </ul>
      <ul className=" flex gap-4">
        {/* <li>Sign up</li>
        <li>Log In</li> */}
        <li>
          <CtaBtn innerTxt="Request a Demo" size="M" />
        </li>
      </ul>
    </div>
  );
};

export default LandingHeader;
