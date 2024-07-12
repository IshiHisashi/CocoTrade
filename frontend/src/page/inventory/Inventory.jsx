import React, { useState, useContext } from "react";
import Modal from "react-modal";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SalesTable from "./SalesTable";
import PlanShipment from "./PlanShipment";
import CtaBtn from "../../component/btn/CtaBtn";
import LineChartRevised from "./LineChartRevised";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import ConfirmationModal from "../sale/ConfirmationModal";


Modal.setAppElement("#root");

const Inventory = ({ URL }) => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const userId = useContext(UserIdContext);
  const fncShowMedal = () => {
    setShowModal(true);
  };
  const handleFormSubmit = (message) => {
    setShowModal(false);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };
  const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] max-w-[30vw] overflow-scroll p-2";

  return (
    <div>
      <h1>Inventory</h1>
      <CtaBtn
        size="M"
        level="S"
        innerTxt="Plan shipment"
        onClickFnc={fncShowMedal}
      />
      <Modal
      className={classNameForModal}
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
        contentLabel="Plan Your Shipment"
      >
        <PlanShipment userId={userId} setShowModal={setShowModal} URL={URL} onFormSubmit={handleFormSubmit}
 />
      </Modal>
      <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        message={confirmationMessage}
      />
      <BarChart userId={userId} URL={URL} />
      <LineChartRevised userId={userId} URL={URL} />
      <SalesTable userId={userId} URL={URL} />
    </div>
  );
};

export default Inventory;
