import React, { useState, useContext } from "react";
import Modal from "react-modal";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SalesTable from "./SalesTable";
import PlanShipment from "./PlanShipment";
import CtaBtn from "../../component/btn/CtaBtn";
import LineChartRevised from "./LineChartRevised";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

Modal.setAppElement("#root");

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const userId = useContext(UserIdContext);
  const fncShowMedal = () => {
    setShowModal(true);
  };
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
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
        contentLabel="Plan Your Shipment"
      >
        <PlanShipment userId={userId} setShowModal={setShowModal} />
      </Modal>
      <BarChart userId={userId} />
      <LineChartRevised userId={userId} />
      <SalesTable userId={userId} />
    </div>
  );
};

export default Inventory;
