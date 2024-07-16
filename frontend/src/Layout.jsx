import React, { useState } from "react";
import Modal from "react-modal";
import Nav from "./component/nav/Nav.jsx";
import Header from "./component/header/Header.jsx";
import FormModal from "./component/modal/FormModal.jsx";
import ConfirmationModal from "./page/auth/ConfirmationModal.jsx";

const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[95vh] overflow-scroll";

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
    translateX === "translate-x-0" && windowWidth < 640
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
      <main className="sm:ml-64 p-4 pt-0 sm:p-8 bg-[#F1F7F8] min-h-screen">
        {children}
      </main>

      <Modal
        isOpen={isFormModalOpen}
        // onRequestClose={() => setIsFormModalOpen(false)}
        className={classNameForModal}
        style={styleForModal}
      >
        <FormModal
          formType="support"
          fnToOpenConfirmationModal={setIsConfirmationModalOpen}
          fnToCloseThisModal={setIsFormModalOpen}
        />
      </Modal>

      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={() => setIsConfirmationModalOpen(false)}
        className={classNameForModal}
        style={styleForModal}
      >
        <ConfirmationModal
          confirmationType="support"
          fnToCloseThisModal={setIsConfirmationModalOpen}
        />
      </Modal>
    </>
  );
};

export default Layout;
