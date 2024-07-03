import React, { useState } from "react";
import CtaBtn from "../btn/CtaBtn";
import Field from "../field-filter/Field.jsx";
import Exit from "../../assets/icons/Exit.svg";

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
          <h1>How can we help you?</h1>
          <p>Any questions for us?</p>
          <form
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
          <h1>Get in touch</h1>
          <p>We are here for you. How can we help?</p>
          <form
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
              options={["Features", "Billing", "Membership"]}
            />
            <Field
              label="Message"
              type="textarea"
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
