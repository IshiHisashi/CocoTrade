import React, { useState } from "react";
import Modal from "react-modal";
import ConfirmationModal from "../auth/ConfirmationModal";
import AuthInputModal from "../auth/AuthInputModal";
// import sections
import Benefit from "./sections/Benefit";
import Features from "./sections/Features";
import FormEmail from "./sections/FormEmail";
import FormTalkToUs from "./sections/FormTalkToUs";
import Hero from "./sections/Hero";
import Team from "./sections/Team";
import LandingHeader from "./sections/LandingHeader";
import LandingFooter from "./sections/LandingFooter";

Modal.setAppElement("#root");

const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[95vh] overflow-scroll";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
  },
};

const Landing = (props) => {
  const { fnToSetUser } = props;

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [authType, setAuthType] = useState("");
  const [confirmationType, setConfirmationType] = useState("");

  return (
    <div className=" bg-slate-200">
      <LandingHeader />
      <div>
        <button
          type="button"
          onClick={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthType("login");
            setIsAuthModalOpen(true);
          }}
        >
          Log in
        </button>
        <Modal
          isOpen={isAuthModalOpen}
          onRequestClose={() => setIsAuthModalOpen(false)}
          className={classNameForModal}
          style={styleForModal}
        >
          <AuthInputModal
            authType={authType}
            fnToChangeAuthType={setAuthType}
            fnToSetNextModalType={setConfirmationType}
            fnToOpenNextModal={setIsConfirmationModalOpen}
            fnToCloseThisModal={setIsAuthModalOpen}
          />
        </Modal>
        <Modal
          isOpen={isConfirmationModalOpen}
          onRequestClose={() => setIsConfirmationModalOpen(false)}
          className={classNameForModal}
          style={styleForModal}
        >
          <ConfirmationModal
            confirmationType={confirmationType}
            fnToCloseThisModal={setIsConfirmationModalOpen}
          />
        </Modal>
      </div>
      <Hero />
      <Benefit />
      <Features />
      <FormEmail />
      <Team />
      <FormTalkToUs />
      <LandingFooter />
    </div>
  );
};

export default Landing;
