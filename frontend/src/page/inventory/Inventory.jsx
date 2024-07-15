import React, { useState, useContext, useEffect } from "react";
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
  const [invInfo, setInvInfo] = useState([]);
  const [amountLeft, setAmountLeft] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const userId = useContext(UserIdContext);
  const fncShowMedal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    setAmountLeft(invInfo[0]);
    setMaxAmount(invInfo[1]);
  }, [invInfo])

  const handleFormSubmit = (message) => {
    setShowModal(false);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };
  const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] max-w-[30vw] overflow-scroll p-2";

  return (
    <div className="pt-[25px] pr-[32px] pb-[30px] pl-[35px] flex flex-wrap">
      <div id="barChartSection" className="flex flex-wrap border border-neutral-100 rounded-lg bg-neutral-0 p-[27px] mb-[15px] basis-11/12 grow shrink">
        <h2 className="basis-11/12 grow shrink mb-[14px]">Your Inventory</h2>
        <div id="infoArea" className="basis-2/5 grow shrink">
          <p className="mb-[5px] text-4xl font-bold">{ maxAmount === 0 ? "Loading" : `${((amountLeft / maxAmount) * 100).toFixed(1)} %`} </p>
          <p>{ maxAmount === 0 || amountLeft === 0 ? "Loading" : `${amountLeft}kg of ${maxAmount}kg` }</p>
        </div>
        <div id="planShipmentBtn" className="basis-2/5 grow shrink flex justify-end">
          <CtaBtn
            size="M"
            level="P"
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
            <PlanShipment 
              userId={userId} 
              setShowModal={setShowModal} 
              URL={URL} 
              onFormSubmit={handleFormSubmit}
            />
          </Modal>
        </div>
        <div id="actualBarChart" className="mt-[20px] basis-11/12 grow shrink">
          <BarChart userId={userId} URL={URL} setInvInfo={setInvInfo} />
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}        message={confirmationMessage}
      />
      <div className="flex basis-11/12 grow shrink h-[450px]">
        <div id="lineChartSection" className="basis-[63%] grow shrink border border-neutral-100 rounded-lg bg-neutral-0 mr-[10px] p-[27px]">
          <LineChartRevised
            userId={userId}
            URL={URL}
          />
        </div>
        <div id="salesTable" className="basis-[34%] grow shrink border border-neutral-100 rounded-lg bg-neutral-0 p-[27px]">
          <SalesTable
            userId={userId}
            URL={URL}
            showConfirmation={showConfirmation}
          />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
