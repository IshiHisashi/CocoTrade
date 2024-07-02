import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryElement from "./SummaryElement";
import CtaBtn from "../../component/btn/CtaBtn";
import { UserIdContext } from "../../contexts/UserIdContext";

const Overview = (props) => {
  const {
    fullName,
    email,
    companyName,
    country,
    margin,
    maxInventoryAmount,
    amountPerShip,
    currentAmountLeft,
    currentBalance,
    fnToShowModal,
  } = props;

  const userId = useContext(UserIdContext);
  const navigate = useNavigate();

  const onClickSave = async () => {
    const inventoryInfo = {
      user_id: userId,
      current_amount_left: currentAmountLeft,
      current_amount_with_pending: 0,
      time_stamp: new Date(),
    };

    const balanceInfo = {
      user_id: userId,
      purchases_sum: 0,
      sales_sum: 0,
      current_balance: currentBalance,
      date: new Date(),
    };

    try {
      const [resInventoryDoc, resBalanceDoc] = await Promise.all([
        axios.post("http://localhost:5555/inventory", inventoryInfo),
        axios.post(
          `http://localhost:5555/tmpFinRoute/${userId}/currentbalance`,
          balanceInfo
        ),
      ]);

      const userInfo = {
        company_name: companyName,
        full_name: fullName,
        email,
        country,
        margin,
        max_inventory_amount: maxInventoryAmount,
        amount_per_ship: amountPerShip,
        inventory_amount_array: {
          action: "push",
          value: resInventoryDoc.data.data._id,
        },
        balance_array: {
          action: "push",
          value: resBalanceDoc.data.data.newCurrentBalance._id,
        },
      };

      await axios.patch(`http://localhost:5555/user/${userId}`, userInfo);

      fnToShowModal(true);
    } catch (error) {
      window.alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <h1>OVERVIEW</h1>
      </div>

      <h2 className="text-4xl">Here&apos;s a summary of your profile</h2>
      <p>Review the following details to finish setting up your profile</p>

      <section className="my-8">
        <h3>BUSINESS PROFILE</h3>
        <div className="grid grid-cols-2 gap-4 my-4 sm:grid-cols-4">
          <SummaryElement label="Full name" detail={fullName} />
          <SummaryElement label="Email address" detail={email} />
          <SummaryElement label="Company name" detail={companyName} />
          <SummaryElement label="Country" detail={country} />
        </div>
      </section>

      <section className="my-8">
        <h3>OPERATIONS SETTING</h3>
        <div className="grid grid-cols-2 gap-4 my-4 sm:grid-cols-4">
          <SummaryElement label="Profit margin %" detail={margin} />
          <SummaryElement
            label="Max. warehouse capacity"
            detail={maxInventoryAmount}
          />
          <SummaryElement label="Shipment threshold %" detail={amountPerShip} />
          <SummaryElement
            label="Current inventory"
            detail={currentAmountLeft}
          />
          <SummaryElement label="Initial balance" detail={currentBalance} />
        </div>
      </section>

      <CtaBtn
        size="M"
        level="O"
        innerTxt="Back"
        onClickFnc={() => navigate("/onboarding/operations")}
      />

      <CtaBtn
        size="M"
        level="P"
        innerTxt="Save"
        onClickFnc={() => onClickSave()}
      />
    </>
  );
};

export default Overview;
