import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";
import CocotradeLogo from "../../../assets/CocoTradeLogo.svg";

const LandingHeader = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="flex justify-between py-6 px-[120px]">
      <ul className="p16 flex items-center gap-[57px]">
        <img src={CocotradeLogo} alt="logo" />
        <li>Benefits</li>
        <li>Features</li>
        <li>Team</li>
        <li>Contact</li>
      </ul>
      <ul className=" flex items-center gap-[15px] p16 ">
        <button
          type="submit"
          onClick={() => {
            setAuthType("login");
            setIsAuthModalOpen(true);
          }}
        >
          Log In
        </button>
        <li>
          <CtaBtn
            innerTxt="Free 14-day trial"
            size="M"
            onClickFnc={() => {
              setAuthType("signup");
              setIsAuthModalOpen(true);
            }}
          />
        </li>
      </ul>
    </div>
  );
};

export default LandingHeader;
