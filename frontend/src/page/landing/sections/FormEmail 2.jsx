import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const FormEmail = () => {
  return (
    <div className="bg-slate-800 py-10 px-4 flex flex-col gap-8">
      <p className="text-white text-[24px] font-semibold text-center">
        Ready to take a leap and experience what CocoTrade has to offer?
        Schedule a demo now.
      </p>
      <div className="cta flex flex-col items-center gap-6">
        <input className="w-full p-4" placeholder="Email" />
        <CtaBtn size="S" innerTxt="Send" />
      </div>
    </div>
  );
};

export default FormEmail;
