import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../../component/field-filter/Field";
import CtaBtn from "../../component/btn/CtaBtn";
import image2 from "./assets/image2.png";
import progress2 from "./assets/progress2.svg";

const OperationsSettings = (props) => {
  const {
    margin,
    setMargin,
    maxInventoryAmount,
    setMaxInventoryAmount,
    amountPerShip,
    setAmountPerShip,
    currentAmountLeft,
    setCurrentAmountLeft,
    currentBalance,
    setCurrentBalance,
  } = props;

  const [marginError, setMarginError] = useState(false);
  const [maxInventoryAmountError, setMaxInventoryAmountError] = useState(false);
  const [amountPerShipError, setAmountPerShipError] = useState(false);
  const [currentAmountLeftError, setCurrentAmountLeftError] = useState(false);
  const [currentBalanceError, setCurrentBalanceError] = useState(false);

  const [maxInventoryAmountErrorText, setMaxInventoryAmountErrorText] =
    useState("");
  const [currentAmountLeftErrorText, setCurrentAmountLeftErrorText] =
    useState("");

  const navigate = useNavigate();

  const modifiedSetMargin = (num) => {
    if (num >= 0 && num <= 100) {
      setMarginError(false);
    } else {
      setMarginError(true);
    }
    setMargin(num);
  };

  const modifiedSetAmountPerShip = (num) => {
    if (num >= 0 && num <= 100) {
      setAmountPerShipError(false);
    } else {
      setAmountPerShipError(true);
    }
    setAmountPerShip(num);
  };

  const modifiedSetCurrentBalance = (num) => {
    if (num >= 0) {
      setCurrentBalanceError(false);
    } else {
      setCurrentBalanceError(true);
    }
    setCurrentBalance(num);
  };

  const decideMaxAndCurrentError = (maxNum, currentNum) => {
    const m = Number(maxNum);
    const c = Number(currentNum);
    if (m < 0 && c < 0 && m < c) {
      if (maxNum) {
        setMaxInventoryAmountError(true);
        setMaxInventoryAmountErrorText(
          "Input must be a positive number and more than or equal to the current inventory amount."
        );
      }
      if (currentNum) {
        setCurrentAmountLeftError(true);
        setCurrentAmountLeftErrorText(
          "Input must be a positive number and less than or equal to the maximum warehouse capacity."
        );
      }
    } else if (m < 0 && m < c) {
      if (maxNum) {
        setMaxInventoryAmountError(true);
        setMaxInventoryAmountErrorText(
          "Input must be a positive number and more than or equal to the current inventory amount."
        );
      }
      if (currentNum) {
        setCurrentAmountLeftError(true);
        setCurrentAmountLeftErrorText(
          "Input must be less than or equal to the maximum warehouse capacity."
        );
      }
    } else if (c < 0 && m < c) {
      if (maxNum) {
        setMaxInventoryAmountError(true);
        setMaxInventoryAmountErrorText(
          "Input must be more than or equal to the current inventory amount."
        );
      }
      if (currentNum) {
        setCurrentAmountLeftError(true);
        setCurrentAmountLeftErrorText(
          "Input must be a positive number and less than or equal to the maximum warehouse capacity."
        );
      }
    } else if (m < 0 && c < 0) {
      if (maxNum) {
        setMaxInventoryAmountError(true);
        setMaxInventoryAmountErrorText("Input must be a positive number.");
      }
      if (currentNum) {
        setCurrentAmountLeftError(true);
        setCurrentAmountLeftErrorText("Input must be a positive number.");
      }
    } else if (m < 0) {
      setMaxInventoryAmountError(true);
      setCurrentAmountLeftError(false);
      setMaxInventoryAmountErrorText("Input must be a positive number.");
    } else if (c < 0) {
      setMaxInventoryAmountError(false);
      setCurrentAmountLeftError(true);
      setCurrentAmountLeftErrorText("Input must be a positive number.");
    } else if (m < c) {
      if (maxNum) {
        setMaxInventoryAmountError(true);
        setMaxInventoryAmountErrorText(
          "Input must be more than or equal to the current inventory amount."
        );
      }
      if (currentNum) {
        setCurrentAmountLeftError(true);
        setCurrentAmountLeftErrorText(
          "Input must be less than or equal to the maximum warehouse capacity."
        );
      }
    } else {
      setMaxInventoryAmountError(false);
      setCurrentAmountLeftError(false);
    }
  };

  const onClickNext = () => {
    if (
      margin &&
      maxInventoryAmount &&
      amountPerShip &&
      currentAmountLeft &&
      currentBalance
    ) {
      if (
        !marginError &&
        !maxInventoryAmountError &&
        !amountPerShipError &&
        !currentAmountLeftError &&
        !currentBalanceError
      ) {
        sessionStorage.setItem("margin", margin);
        sessionStorage.setItem("maxInventoryAmount", maxInventoryAmount);
        sessionStorage.setItem("amountPerShip", amountPerShip);
        sessionStorage.setItem("currentAmountLeft", currentAmountLeft);
        sessionStorage.setItem("currentBalance", currentBalance);
        navigate("/onboarding/overview");
      } else {
        window.alert("Please input valid numbers.");
      }
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  return (
    <section className="relative min-h-screen w-screen grid content-end md:grid-cols-3">
      <div
        className="bg-[90%_-25rem] md:bg-center bg-fixed md:bg-local md:bg-cover absolute md:static top-0 min-h-screen w-screen md:w-auto blur-sm md:filter-none -z-10 md:order-2"
        style={{ backgroundImage: `url(${image2})` }}
      />

      <div className="w-full bg-white p-8 mt-32 md:mt-8 filter-none md:order-1 md:col-span-2 max-w-[900px] mx-auto">
        <div>
          <img src={progress2} alt="" aria-hidden className="mb-4" />
          <h1 className="h4-sans-uppercase text-neutral-600">
            OPERATIONS SETTINGS
          </h1>
        </div>

        <h2 className="h2-serif-normal sm:h2-serif text-neutral-600 pt-8">
          Tell us about your operations
        </h2>
        <p className="p18 text-neutral-600">
          Your operation details will help provide a tailored experience
        </p>

        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
          <Field
            label="Profit margin percentage"
            name="margin"
            value={margin}
            onChange={(e) => modifiedSetMargin(e.target.value)}
            type="number"
            required
            unit="%"
            adornment="end"
            info
            infoText="This setting will provide a suggested price for purchasing copra."
            error={marginError}
            errorText="Percentage should be between 0 and 100."
          />
          <Field
            label="Maximum warehouse capacity"
            name="maxInventoryAmount"
            value={maxInventoryAmount}
            onChange={(e) => {
              setMaxInventoryAmount(e.target.value);
              decideMaxAndCurrentError(e.target.value, currentAmountLeft);
            }}
            type="number"
            required
            unit="kg"
            adornment="end"
            info
            infoText="This setting will provide insight for inventory and shipment."
            error={maxInventoryAmountError}
            errorText={maxInventoryAmountErrorText}
          />
          <Field
            label="Shipment threshold percentage"
            name="amountPerShip"
            value={amountPerShip}
            onChange={(e) => modifiedSetAmountPerShip(e.target.value)}
            type="number"
            required
            unit="%"
            adornment="end"
            info
            infoText="This setting will provide insight for inventory and shipment."
            error={amountPerShipError}
            errorText="Percentage should be between 0 and 100."
          />
          <Field
            label="Current inventory"
            name="currentAmountLeft"
            value={currentAmountLeft}
            onChange={(e) => {
              setCurrentAmountLeft(e.target.value);
              decideMaxAndCurrentError(maxInventoryAmount, e.target.value);
            }}
            type="number"
            required
            unit="kg"
            adornment="end"
            error={currentAmountLeftError}
            errorText={currentAmountLeftErrorText}
          />
          <Field
            label="Initial balance"
            name="currentBalance"
            value={currentBalance}
            onChange={(e) => modifiedSetCurrentBalance(e.target.value)}
            type="number"
            required
            unit="PHP"
            adornment="start"
            error={currentBalanceError}
            errorText="Input should be a positive number."
          />
        </div>

        <div className="flex justify-between gap-4 sm:mt-16">
          <CtaBtn
            size="M"
            level="O"
            innerTxt="Back"
            onClickFnc={() => navigate("/onboarding/business")}
          />

          <CtaBtn
            size="M"
            level={
              margin &&
              maxInventoryAmount &&
              amountPerShip &&
              currentAmountLeft &&
              currentBalance &&
              !marginError &&
              !maxInventoryAmountError &&
              !amountPerShipError &&
              !currentAmountLeftError &&
              !currentBalanceError
                ? "P"
                : "D"
            }
            innerTxt="Next"
            onClickFnc={() => onClickNext()}
            disabled={
              !(
                margin &&
                maxInventoryAmount &&
                amountPerShip &&
                currentAmountLeft &&
                currentBalance &&
                !marginError &&
                !maxInventoryAmountError &&
                !amountPerShipError &&
                !currentAmountLeftError &&
                !currentBalanceError
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default OperationsSettings;
