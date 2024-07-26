import React, { useState } from "react";
import Modal from "react-modal";
import ConfirmationModal from "../auth/ConfirmationModal";
import AuthInputModal from "../auth/AuthInputModal";
// import sections
import Benefit from "./sections/Benefit";
import Features from "./sections/Features";
import TryCoco from "./sections/TryCoco";
import FormTalkToUs from "./sections/FormTalkToUs";
import Hero from "./sections/Hero";
import Team from "./sections/Team";
import LandingHeader from "./sections/LandingHeader";
import LandingFooter from "./sections/LandingFooter";
import hideScrollbar from "../../styles/HideScrollbar.module.css";

Modal.setAppElement("#root");

const classNameForModal =
  "absolute bg-white h-full top-0 left-0 right-0 bottom-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] overflow-auto sm:h-auto";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
    zIndex: 50,
  },
};

const Landing = (props) => {
  const { fnToSetUser } = props;
  const { URL } = props;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [authType, setAuthType] = useState("");
  const [confirmationType, setConfirmationType] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  document.body.classList =
    isAuthModalOpen || isConfirmationModalOpen
      ? "overflow-clip"
      : "overflow-scroll";

  return (
    <div className=" bg-bluegreen-100">
      <LandingHeader
        setAuthType={setAuthType}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />

      <div>
        <Modal
          isOpen={isAuthModalOpen}
          onRequestClose={() => setIsAuthModalOpen(false)}
          className={`${classNameForModal} sm:w-[508px]`}
          style={styleForModal}
          aria={{ labelledby: "modal-title" }}
        >
          <AuthInputModal
            authType={authType}
            fnToChangeAuthType={setAuthType}
            fnToSetNextModalType={setConfirmationType}
            fnToOpenNextModal={setIsConfirmationModalOpen}
            fnToCloseThisModal={setIsAuthModalOpen}
            URL={URL}
          />
        </Modal>
        <Modal
          isOpen={isConfirmationModalOpen}
          onRequestClose={() =>
            confirmationType === "accountCreated" ||
            setIsConfirmationModalOpen(false)
          }
          className={`${classNameForModal} sm:min-w-[382px] ${hideScrollbar.div}`}
          style={styleForModal}
          aria={{ labelledby: "modal-title" }}
        >
          <ConfirmationModal
            confirmationType={confirmationType}
            fnToCloseThisModal={setIsConfirmationModalOpen}
            windowWidth={windowWidth}
          />
        </Modal>
      </div>
      <Hero setAuthType={setAuthType} setIsAuthModalOpen={setIsAuthModalOpen} />
      <div id="benefit">
        <Benefit />
      </div>
      <div id="features">
        <Features />
      </div>
      <TryCoco
        setAuthType={setAuthType}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />
      <div id="team">
        <Team />
      </div>
      <div id="contact">
        <FormTalkToUs
          setAuthType={setAuthType}
          setIsAuthModalOpen={setIsAuthModalOpen}
        />
      </div>
      <LandingFooter />
    </div>
  );
};

export default Landing;
