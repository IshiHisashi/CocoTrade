import React, { useState } from "react";
import CtaBtn from "../btn/CtaBtn";
import Field from "../field-filter/Field.jsx";
import Exit from "../../assets/icons/Exit.svg";
import CocoTradeIcon from "../../assets/icons/CocoTradeIcon-Orange.svg";

const FormModal = (props) => {
  const { formType, fnToOpenConfirmationModal, fnToCloseThisModal } = props;

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  let elementToReturn;

  switch (formType) {
    case "contact":
      elementToReturn = (
        <>
          <img src={CocoTradeIcon} alt="" aria-hidden />
          <div className="text-center">
            <h1 className="h2-serif-normal">How can we help you?</h1>
            <p className="p18">Any questions for us?</p>
          </div>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              fnToOpenConfirmationModal(true);
              fnToCloseThisModal(false);
            }}
          >
            <Field
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <Field
              type="textarea"
              label="Message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <CtaBtn type="submit" size="L" level="P" innerTxt="Submit" />
          </form>
        </>
      );
      break;
    case "support":
      elementToReturn = (
        <>
          <img src={CocoTradeIcon} alt="" aria-hidden />
          <div className="text-center">
            <h1 className="h2-serif-normal">Get in touch</h1>
            <p className="p18">We are here for you. How can we help?</p>
          </div>
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              fnToOpenConfirmationModal(true);
              fnToCloseThisModal(false);
            }}
          >
            <Field
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Company Name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              required
            />
            <Field
              label="Subject"
              type="dropdown"
              name="subject"
              // value={}
              // onChange={}
              required
              options={[
                { value: "features", label: "Features" },
                { value: "billing", label: "Billing" },
                { value: "membership", label: "Membership" },
              ]}
            />
            <Field
              label="Message"
              type="textarea"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <CtaBtn type="submit" size="L" level="P" innerTxt="Send" />
          </form>
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
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => fnToCloseThisModal(false)}
      >
        <img src={Exit} alt="close" />
      </button>

      {elementToReturn}
    </div>
  );
};

export default FormModal;
