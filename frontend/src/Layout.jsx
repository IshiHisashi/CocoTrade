import React, { useState } from "react";
import Modal from "react-modal";
import Nav from "./component/nav/Nav.jsx";
import Header from "./component/header/Header.jsx";
import FormModal from "./component/modal/FormModal.jsx";
import ConfirmationModal from "./page/auth/ConfirmationModal.jsx";
import hideScrollbar from "./styles/HideScrollbar.module.css";

const classNameForModal =
  "absolute bg-white h-full top-0 left-0 right-0 bottom-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] overflow-auto sm:h-auto";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
    zIndex: 50,
  },
};

const Layout = (props) => {
  const { children, URL } = props;

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
    <>
      <Header URL={URL} translateX={translateX} fnToToggleNav={setTranslateX} />
      <Nav
        fnToOpenFormModal={setIsFormModalOpen}
        translateX={translateX}
        fnToToggleNav={setTranslateX}
      />
      <main className="sm:ml-64 bg-[#F6F8F8] min-h-screen @container">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>

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
    </>
  );
};

export default Layout;
