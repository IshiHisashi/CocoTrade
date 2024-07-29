import React, { useState } from "react";
import Modal from "react-modal";
import ConfirmationModal from "../../auth/ConfirmationModal.jsx";
import hideScrollbar from "../../../styles/HideScrollbar.module.css";
import FormModal from "../../../component/modal/FormModal";

const classNameForModal =
  "absolute bg-white h-full top-0 left-0 right-0 bottom-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] overflow-auto sm:h-auto";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
    zIndex: 50,
  },
};

const FormTalkToUs = ({ setAuthType, setIsAuthModalOpen }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [translateX, setTranslateX] = useState("-translate-x-full");
  // translate-x-0
  // -translate-x-full
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  document.body.classList =
    isFormModalOpen ||
    isConfirmationModalOpen ||
    (translateX === "translate-x-0" && windowWidth < 640)
      ? "overflow-clip"
      : "overflow-scroll";

  return (
    <div className="bg-bluegreen-700 py-[110px] flex flex-col gap-[50px] items-center">
      <div className="text-bluegreen-100 text-center">
        <h2 className="h2-serif ">How can we help you?</h2>
        <p className="p18 px-8">
          Our team is ready to provide the best support for our current and
          potential new users may have about cocotrade.
        </p>
      </div>
      <button
        onClick={() => {
          setIsFormModalOpen(true);
        }}
        type="submit"
        className="w-52 h-[50px] bg-[#FF5b04]  hover:bg-[#FF8340]
        active:bg-[#FE2E00] text-white
        active:text-white 
        font-semibold
        text-[16px]
        dm-sans
        rounded
        border-0 border-bluegreen-700"
      >
        Talk to us{" "}
      </button>

      <Modal
        isOpen={isFormModalOpen}
        className={`${classNameForModal} sm:w-[508px]`}
        style={styleForModal}
        aria={{ labelledby: "modal-title" }}
      >
        <FormModal
          formType="support"
          fnToOpenConfirmationModal={setIsConfirmationModalOpen}
          fnToCloseThisModal={setIsFormModalOpen}
          windowWidth={windowWidth}
        />
      </Modal>

      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={() => setIsConfirmationModalOpen(false)}
        className={`${classNameForModal} ${hideScrollbar.div}`}
        style={styleForModal}
        aria={{ labelledby: "modal-title" }}
      >
        <ConfirmationModal
          confirmationType="support"
          fnToCloseThisModal={setIsConfirmationModalOpen}
          windowWidth={windowWidth}
        />
      </Modal>
    </div>
  );
};

export default FormTalkToUs;
