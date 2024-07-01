import React from "react";
import CtaBtn from "../../component/btn/CtaBtn.jsx";

const ConfirmationModal = (props) => {
  const { confirmationType, fnToCloseThisModal } = props;

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => fnToCloseThisModal(false)}
      >
        x
      </button>

      {/* eslint-disable-next-line no-nested-ternary  */}
      {confirmationType === "accountCreated" ? (
        <>
          <h1>Account created</h1>
          <CtaBtn size="M" level="P" innerTxt="Set up account" />
          {/* onClickFnc={} */}
        </>
      ) : confirmationType === "PasswordRequest" ? (
        <>
          <h1>Request received</h1>
          <p>An email has been sent with password reset instructions.</p>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      ) : (
        <p>else</p>
      )}
    </div>
  );
};

export default ConfirmationModal;
