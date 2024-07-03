import React from "react";
import CtaBtn from "../../../component/btn/CtaBtn";

const FormTalkToUs = () => {
  return (
    <div className="bg-slate-700 py-10 flex flex-col gap-8 items-center">
      <div className="texts text-white text-center">
        <h3 className="text-[36px] font-bold">How can we help you?</h3>
        <p>
          Our team is ready to provide the best support for our current and
          potential new users may have about cocotrade.
        </p>
      </div>
      <CtaBtn innerTxt="Talk to us" size="M" />
    </div>
  );
};

export default FormTalkToUs;
