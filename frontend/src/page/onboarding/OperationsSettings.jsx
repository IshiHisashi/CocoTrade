import React from "react";
import { useNavigate } from "react-router-dom";
import Field from "../../component/field-filter/Field";
import CtaBtn from "../../component/btn/CtaBtn";

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

  const navigate = useNavigate();

  const onClickNext = () => {
    if (
      margin &&
      maxInventoryAmount &&
      amountPerShip &&
      currentAmountLeft &&
      currentBalance
    ) {
      sessionStorage.setItem("margin", margin);
      sessionStorage.setItem("maxInventoryAmount", maxInventoryAmount);
      sessionStorage.setItem("amountPerShip", amountPerShip);
      sessionStorage.setItem("currentAmountLeft", currentAmountLeft);
      sessionStorage.setItem("currentBalance", currentBalance);
      navigate("/onboarding/overview");
    } else {
      window.alert("Please fill out all the input fields.");
    }
  };

  return (
    <>
      <div>
        <h1>OPERATIONS SETTINGS</h1>
      </div>

      <h2 className="text-4xl">Tell us about your operations</h2>
      <p>Your operation details will help provide a tailored experience</p>

      <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
        <Field
          label="Profit margin percentage"
          name="margin"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
          type="number"
          required
          unit="%"
          adornment="end"
          info
          infoText="This setting will provide a suggested price for purchasing copra"
        />
        <Field
          label="Maximum warehouse capacity"
          name="maxInventoryAmount"
          value={maxInventoryAmount}
          onChange={(e) => setMaxInventoryAmount(e.target.value)}
          type="number"
          required
          unit="kg"
          adornment="end"
          info
          infoText="This setting will provide insight for inventory and shipment"
        />
        <Field
          label="Shipment threshold percentage"
          name="amountPerShip"
          value={amountPerShip}
          onChange={(e) => setAmountPerShip(e.target.value)}
          type="number"
          required
          unit="%"
          adornment="end"
          info
          infoText="This setting will provide insight for inventory and shipment"
        />
        <Field
          label="Current inventory"
          name="currentAmountLeft"
          value={currentAmountLeft}
          onChange={(e) => setCurrentAmountLeft(e.target.value)}
          type="number"
          required
          unit="kg"
          adornment="end"
        />
        <Field
          label="Initial balance"
          name="currentBalance"
          value={currentBalance}
          onChange={(e) => setCurrentBalance(e.target.value)}
          type="number"
          required
          unit="PHP"
          adornment="start"
        />
      </div>

      <CtaBtn
        size="M"
        level="O"
        innerTxt="Back"
        onClickFnc={() => navigate("/onboarding/business")}
      />

      <CtaBtn
        size="M"
        level="P"
        innerTxt="Next"
        onClickFnc={() => onClickNext()}
      />
    </>
  );
};

export default OperationsSettings;
