import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const FormTalkToUs = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="bg-bluegreen-700 py-[110px] flex flex-col gap-[50px] items-center">
      <div className="text-bluegreen-100 text-center">
        <h2 className="h2-serif ">How can we help you?</h2>
        <p className="p18 px-8">
          Our team is ready to provide the best support for our current and
          potential new users may have about cocotrade.
        </p>
      </div>
      <button
        onClick={() => {
          setAuthType("signup");
          setIsAuthModalOpen(true);
        }}
        type="submit"
        className="w-52 h-[50px] bg-[#FF5b04]  hover:bg-[#FF8340]
  active:bg-[#FE2E00] text-white
  active:text-white
  font-semibold
  text-[16px]
  dm-sans
  rounded
  border-0 border-bluegreen-700"
      >
        Free 14-day trial
      </button>
    </div>
  );
};

export default FormTalkToUs;
