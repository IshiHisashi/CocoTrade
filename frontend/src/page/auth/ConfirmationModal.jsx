import React from "react";
import { useNavigate } from "react-router-dom";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Exit from "../../assets/icons/Exit.svg";

const ConfirmationModal = (props) => {
  const { confirmationType, fnToCloseThisModal } = props;
  const navigate = useNavigate();

  let elementToReturn;

  switch (confirmationType) {
    case "accountCreated":
      elementToReturn = (
        <>
          <h1>Account created</h1>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Set up account"
            onClickFnc={() => navigate("/onboarding")}
          />
        </>
      );
      break;
    case "PasswordRequest":
      elementToReturn = (
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
      );
      break;
    case "accountAllSet":
      elementToReturn = (
        <>
          <h1>Your account is all set</h1>
          <p>Welcome to CocoTrade!</p>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Go to Dashboard"
            onClickFnc={() => navigate("/dashboard")}
          />
        </>
      );
      break;
    default:
      elementToReturn = (
        <>
          <h1>Something went wrong...</h1>
          <p>Please try again.</p>
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center m-7 gap-5">
      {confirmationType !== "accountAllSet" && (
        <button
          type="button"
          className="absolute top-8 right-8"
          onClick={() => fnToCloseThisModal(false)}
        >
          <img src={Exit} alt="close" />
        </button>
      )}

      {elementToReturn}
    </div>
  );
};

export default ConfirmationModal;
