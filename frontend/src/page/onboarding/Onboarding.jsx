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
  "absolute bg-white h-full top-0 left-0 right-0 bottom-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] overflow-scroll sm:h-auto";

const styleForModal = {
  overlay: {
    backgroundColor: "#24303790",
    zIndex: 50,
  },
};

const Onboarding = ({ URL }) => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [margin, setMargin] = useState("");
  const [maxInventoryAmount, setMaxInventoryAmount] = useState("");
  const [amountPerShip, setAmountPerShip] = useState("");
  const [currentAmountLeft, setCurrentAmountLeft] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  document.body.classList = isConfirmationModalOpen
    ? "overflow-clip"
    : "overflow-scroll";

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

  return (
    <>
      <div className="">
        {/* md:grid grid-cols-[auto_1fr] */}
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
                setMargin={setMargin}
                maxInventoryAmount={maxInventoryAmount}
                setMaxInventoryAmount={setMaxInventoryAmount}
                amountPerShip={amountPerShip}
                setAmountPerShip={setAmountPerShip}
                currentAmountLeft={currentAmountLeft}
                setCurrentAmountLeft={setCurrentAmountLeft}
                currentBalance={currentBalance}
                setCurrentBalance={setCurrentBalance}
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
        <ConfirmationModal
          confirmationType="accountAllSet"
          windowWidth={windowWidth}
        />
      </Modal>
    </>
  );
};

export default Onboarding;
