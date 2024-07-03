import React, { useState } from "react";
import Modal from "react-modal";
import Nav from "./component/nav/Nav";
import Header from "./component/header/Header";

const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px]";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
  },
};

const Layout = (props) => {
  const { children } = props;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <>
      <Header />
      <Nav />
      <main className="ml-64 p-8 bg-[#F1F7F8] h-screen">{children}</main>

      <Modal
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        className={classNameForModal}
        style={styleForModal}
      >
        {/* <AuthInputModal
          authType={authType}
          fnToChangeAuthType={setAuthType}
          fnToSetNextModalType={setConfirmationType}
          fnToOpenNextModal={setIsConfirmationModalOpen}
          fnToCloseThisModal={setIsAuthModalOpen}
        /> */}
      </Modal>
    </>
  );
};

export default Layout;
