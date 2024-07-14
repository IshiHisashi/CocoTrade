import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";
// import CocotradeLogo from "../../../assets/CocoTradeLogoForDarkBg.svg";

const LandingHeader = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="flex justify-between py-6 lg:px-[3%] xl-[5%] 2xl-[10%]">
      <ul className="p16 flex items-center gap-[40px] xl:gap-[60px]">
        <img src="./images/logo-b.png" alt="logo" />
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
          className="border-[1.5px] border-neutral-800 h-14 w-24 rounded"
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
