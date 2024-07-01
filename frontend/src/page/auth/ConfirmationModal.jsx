import React from "react";
import CtaBtn from "../../component/btn/CtaBtn.jsx";

const ConfirmationModal = (props) => {
  const { confirmationType } = props;

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
      {/* eslint-disable-next-line no-nested-ternary  */}
      {confirmationType === "accountCreated" ? (
        <>
          <h1>Account created</h1>
          <CtaBtn size="M" level="P" innerTxt="Set up account" />
          {/* onClickFnc={} */}
        </>
      ) : confirmationType === "PasswordRequest" ? (
        <p>Request received</p>
      ) : (
        <p>else</p>
      )}
    </div>
  );
};

export default ConfirmationModal;
