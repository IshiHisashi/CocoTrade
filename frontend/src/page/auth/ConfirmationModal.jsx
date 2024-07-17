import React from "react";
import { useNavigate } from "react-router-dom";
import CtaBtn from "../../component/btn/CtaBtn.jsx";
import Exit from "../../assets/icons/Exit.svg";
import Confirm from "../../assets/icons/Confirm.svg";

const commonClassName = "text-neutral-600 max-w-96 w-full text-center";

const ConfirmationModal = (props) => {
  const { confirmationType, fnToCloseThisModal, windowWidth } = props;
  const navigate = useNavigate();

  let elementToReturn;

  switch (confirmationType) {
    case "accountCreated":
      elementToReturn = (
        <>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={Confirm} alt="" aria-hidden />
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Account created
            </h1>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
            level="P"
            innerTxt="Set up account"
            onClickFnc={() => navigate("/onboarding/business")}
          />
        </>
      );
      break;
    case "PasswordRequest":
      elementToReturn = (
        <>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={Confirm} alt="" aria-hidden />
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Request received
            </h1>
            <p className={`p16 ${commonClassName}`}>
              An email has been sent with password reset instructions.
            </p>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
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
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={Confirm} alt="" aria-hidden />
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Your account is all set
            </h1>
            <p className={`p16 ${commonClassName}`}>Welcome to CocoTrade!</p>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
            level="P"
            innerTxt="Go to Dashboard"
            onClickFnc={() => navigate("/dashboard")}
          />
        </>
      );
      break;
    case "contact":
      elementToReturn = (
        <>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={Confirm} alt="" aria-hidden />
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Talk to you soon!
            </h1>
            <p className={`p16 ${commonClassName}`}>
              Thank you for your inquiry! We&apos;ve received your inquiry and
              will respond as soon as possible.
            </p>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      );
      break;
    case "support":
      elementToReturn = (
        <>
          <div className="flex flex-col items-center justify-center gap-5">
            <img src={Confirm} alt="" aria-hidden />
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Talk to you soon!
            </h1>
            <p className={`p16 ${commonClassName}`}>
              We&apos;ve received your message and will respond within 24 hours.
            </p>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      );
      break;
    default:
      elementToReturn = (
        <>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className={`h2-serif-normal ${commonClassName}`}>
              Something went wrong...
            </h1>
            <p className={`p16 ${commonClassName}`}>Please try again.</p>
          </div>
          <CtaBtn
            size={windowWidth < 640 ? "L" : "M"}
            level="P"
            innerTxt="Close"
            onClickFnc={() => fnToCloseThisModal(false)}
          />
        </>
      );
  }

  return (
    <div className="grid grid-rows-[1fr_auto] py-8 sm:py-0 sm:flex sm:flex-col items-center justify-center mx-4 sm:m-7 gap-5 h-full">
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
