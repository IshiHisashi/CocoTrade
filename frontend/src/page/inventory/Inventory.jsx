import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import BarChart from "./BarChart";
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
  }, [invInfo]);

  const handleFormSubmit = (message) => {
    setShowModal(false);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };
  const classNameForModal =
    "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] sm:max-w-[400px] max-w-[382px] overflow-scroll p-2";

  return (
    <div className="sm:pt-[25px] sm:pr-[32px] sm:pb-[30px] sm:pl-[35px] flex flex-wrap h-fit">
      <title>Inventory | CocoTrade</title>
      <div
        id="barChartSection"
        className="flex flex-wrap sm:border sm:border-neutral-100 sm:rounded-lg bg-neutral-0 p-[27px] mb-[14px] basis-11/12 grow shrink"
      >
        <h2 className="basis-11/12 grow shrink mb-[14px]">Your Inventory</h2>
        <div id="infoArea" className="basis-2/5 grow shrink">
          <p className="mb-[5px] text-4xl font-bold">
            {maxAmount === 0
              ? "Loading"
              : `${((amountLeft / maxAmount) * 100).toFixed(1)} %`}{" "}
          </p>
          <p>
            {maxAmount === 0 || amountLeft === 0
              ? "Loading"
              : `${amountLeft}kg of ${maxAmount}kg`}
          </p>
        </div>
        <div
          id="planShipmentBtn"
          className="basis-2/5 grow shrink flex justify-end"
        >
          <CtaBtn
            size="M"
            level="P"
            innerTxt="Plan shipment"
            onClickFnc={fncShowMedal}
            imgSource="./btn-imgs/calender.png"
          />
          <Modal
            style={{
              content: {
                zIndex: "9999",
                position: "relative",
                padding: "24px",
              },
              overlay: {
                zIndex: "9998",
                backgroundColor: "#24303790",
              },
            }}
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
          <BarChart userId={userId} URL={URL} setInvInfo={setInvInfo} showModal={showModal}/>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        message={confirmationMessage}
      />
      <div className="lg:grid lg:grid-cols-6 gap-[10px] lg:h-[450px] basis-11/12 grow shrink">
        <div
          id="lineChartSection"
          className="lg:col-start-1 lg:col-end-5 sm:border sm:border-neutral-100 sm:rounded-lg bg-neutral-0 p-[27px]"
        >
          <LineChartRevised
            userId={userId}
            URL={URL}
            chartTitle="Inventory Trend"
          />
        </div>
        <div
          id="salesTable"
          className="lg:col-start-5 lg:col-end-7 sm:border sm:border-neutral-100 sm:rounded-lg bg-neutral-0 p-[27px] mt-[14px] lg:mt-0"
        >
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
