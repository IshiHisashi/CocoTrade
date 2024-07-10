import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Routes, Route } from "react-router-dom";
import BusinessProfile from "./BusinessProfile";
import OperationsSettings from "./OperationsSettings";
import { UserIdContext } from "../../contexts/UserIdContext";
import Overview from "./Overview";
import ConfirmationModal from "../auth/ConfirmationModal";

Modal.setAppElement("#root");

const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[95vh] overflow-scroll";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
  },
};

const Onboarding = ({ URL }) => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [margin, setMargin] = useState(null);
  const [maxInventoryAmount, setMaxInventoryAmount] = useState(null);
  const [amountPerShip, setAmountPerShip] = useState(null);
  const [currentAmountLeft, setCurrentAmountLeft] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${URL}/user/${userId}`);
      setFullName(
        sessionStorage.getItem("fullName") || res.data.data.full_name
      );
      setEmail(sessionStorage.getItem("email") || res.data.data.email);
      setCompanyName(
        sessionStorage.getItem("companyName") || res.data.data.company_name
      );
      if (res.data.data.country) {
        setCountry(sessionStorage.getItem("country") || res.data.data.country);
      }
      setMargin(sessionStorage.getItem("margin") || res.data.data.margin);
      setMaxInventoryAmount(
        sessionStorage.getItem("maxInventoryAmount") ||
          res.data.data.max_inventory_amount
      );
      setAmountPerShip(
        sessionStorage.getItem("amountPerShip") || res.data.data.amount_per_ship
      );

      setCurrentAmountLeft(sessionStorage.getItem("currentAmountLeft"));
      setCurrentBalance(sessionStorage.getItem("currentBalance"));
    })();
  }, [userId, URL]);

  const modifiedSetMargin = (num) => {
    if (num >= 0 && num <= 100) {
      setMargin(num);
    }
  };

  const modifiedSetMaxInventoryAmount = (num) => {
    if (num >= 0) {
      setMaxInventoryAmount(num);
    }
  };

  const modifiedSetAmoutPerShip = (num) => {
    if (num >= 0 && num <= 100) {
      setAmountPerShip(num);
    }
  };

  const modifiedSetCurrentAmountLeft = (num) => {
    if (num >= 0) {
      setCurrentAmountLeft(num);
    }
  };

  const modifiedSetCurrentBalance = (num) => {
    if (num >= 0) {
      setCurrentBalance(num);
    }
  };

  return (
    <>
      <div className="p-8">
        <Routes>
          <Route
            path="business"
            element={
              <BusinessProfile
                fullName={fullName}
                setFullName={setFullName}
                companyName={companyName}
                setCompanyName={setCompanyName}
                email={email}
                setEmail={setEmail}
                country={country}
                setCountry={setCountry}
              />
            }
          />
          <Route
            path="operations"
            element={
              <OperationsSettings
                margin={margin}
                setMargin={modifiedSetMargin}
                maxInventoryAmount={maxInventoryAmount}
                setMaxInventoryAmount={modifiedSetMaxInventoryAmount}
                amountPerShip={amountPerShip}
                setAmountPerShip={modifiedSetAmoutPerShip}
                currentAmountLeft={currentAmountLeft}
                setCurrentAmountLeft={modifiedSetCurrentAmountLeft}
                currentBalance={currentBalance}
                setCurrentBalance={modifiedSetCurrentBalance}
              />
            }
          />
          <Route
            path="overview"
            element={
              <Overview
                fullName={fullName}
                email={email}
                companyName={companyName}
                country={country}
                margin={margin}
                maxInventoryAmount={maxInventoryAmount}
                amountPerShip={amountPerShip}
                currentAmountLeft={currentAmountLeft}
                currentBalance={currentBalance}
                fnToShowModal={setIsConfirmationModalOpen}
                URL={URL}
              />
            }
          />
        </Routes>
      </div>

      <Modal
        isOpen={isConfirmationModalOpen}
        className={classNameForModal}
        style={styleForModal}
      >
        <ConfirmationModal confirmationType="accountAllSet" />
      </Modal>
    </>
  );
};

export default Onboarding;
