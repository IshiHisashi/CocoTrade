import React, { useState } from "react";
import Modal from 'react-modal';
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import SalesTable from "./SalesTable";
import PlanShipment from "./PlanShipment";
import CtaBtn from "../../component/btn/CtaBtn";

Modal.setAppElement('#root');

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const userId = "66622c07858df5960bf57a06";
  const fncShowMedal = () => {
    setShowModal(true);
  }
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
        isOpen={ showModal }
        onRequestClose={() => {
          setShowModal(false);
        }}
        contentLabel="Plan Your Shipment"
      >
        <PlanShipment userId={ userId } setShowModal={setShowModal}/>
      </Modal>
      <BarChart userId={ userId } />
      <LineChart userId={ userId } />
      <SalesTable userId={ userId }/>
    </div>
  );
};

export default Inventory;
