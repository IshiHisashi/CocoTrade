import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const TryCoco = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="bg-neutral-600 py-[94px] px-[100px] flex flex-col gap-8">
      <p className="h2-serif text-bluegreen-100 text-center">
        Try Cocotrade free for 14 days
      </p>
      <div className="cta flex flex-col items-center gap-6">
        <CtaBtn
          size="M"
          innerTxt="Get started"
          onClickFnc={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
        />
      </div>
    </div>
  );
};

export default TryCoco;
