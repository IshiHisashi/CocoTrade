import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const FormTalkToUs = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="bg-bluegreen-700 py-[110px] flex flex-col gap-[50px] items-center">
      <div className="text-bluegreen-100 text-center">
        <h2 className="h2-serif ">How can we help you?</h2>
        <p className="p18">
          Our team is ready to provide the best support for our current and
          potential new users may have about cocotrade.
        </p>
      </div>
      <CtaBtn
        innerTxt="Talk to us"
        size="M"
        onClickFnc={() => {
          setAuthType("signup");
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
};

export default FormTalkToUs;
