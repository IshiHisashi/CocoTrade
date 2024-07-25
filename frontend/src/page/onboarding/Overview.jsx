import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryElement from "./SummaryElement";
import CtaBtn from "../../component/btn/CtaBtn";
import { UserIdContext } from "../../contexts/UserIdContext";
import image3 from "./assets/image3.png";
import progress3 from "./assets/progress3.svg";

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
    URL,
  } = props;

  const userId = useContext(UserIdContext);
  const navigate = useNavigate();

  const onClickSave = async () => {
    const inventoryInfo = {
      user_id: userId,
      current_amount_left: currentAmountLeft,
      current_amount_with_pending: currentAmountLeft,
      time_stamp: new Date(),
    };

    const inventoryInfoInitial = {
      user_id: userId,
      current_amount_left: currentAmountLeft,
      current_amount_with_pending: currentAmountLeft,
      time_stamp: new Date(1),
    };

    const balanceInfo = {
      user_id: userId,
      purchases_sum: 0,
      sales_sum: 0,
      current_balance: currentBalance,
      date: new Date(),
    };

    const balanceInfoInitial = {
      user_id: userId,
      purchases_sum: 0,
      sales_sum: 0,
      current_balance: currentBalance,
      date: new Date(1),
    };

    try {
      const [
        resInventoryDoc,
        resInventoryInitialDoc,
        resBalanceDoc,
        resBalanceInitialDoc,
        resPriceSuggestionDoc1,
        resPriceSuggestionDoc2,
      ] = await Promise.all([
        axios.post(`${URL}/inventory/first`, inventoryInfo),
        axios.post(`${URL}/inventory/first`, inventoryInfoInitial),
        axios.post(
          `${URL}/tmpFinRoute/${userId}/currentbalance/first`,
          balanceInfo
        ),
        axios.post(
          `${URL}/tmpFinRoute/${userId}/currentbalance/first`,
          balanceInfoInitial
        ),
        axios.post(`${URL}/user/${userId}/pricesuggestion/first`, {
          margin: margin / 100,
        }),
        axios.post(`${URL}/user/${userId}/pricesuggestion/first`, {
          margin: margin / 100,
        }),
      ]);

      const userInfo = {
        company_name: companyName,
        full_name: fullName,
        email,
        country,
        margin: margin / 100,
        max_inventory_amount: maxInventoryAmount,
        amount_per_ship: amountPerShip,
        inventory_amount_array: {
          action: "push",
          value: [
            resInventoryDoc.data.data._id,
            resInventoryInitialDoc.data.data._id,
          ],
        },
        balance_array: {
          action: "push",
          value: [
            resBalanceDoc.data.data.newCurrentBalance._id,
            resBalanceInitialDoc.data.data.newCurrentBalance._id,
          ],
        },
        price_suggestion_array: {
          action: "push",
          value: [
            resPriceSuggestionDoc1.data.data._id,
            resPriceSuggestionDoc2.data.data._id,
          ],
        },
      };

      await axios.patch(`${URL}/user/${userId}`, userInfo);

      sessionStorage.removeItem("fullName");
      sessionStorage.removeItem("margin");
      sessionStorage.removeItem("currentAmountLeft");
      sessionStorage.removeItem("amountPerShip");
      sessionStorage.removeItem("companyName");
      sessionStorage.removeItem("currentBalance");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("country");
      sessionStorage.removeItem("maxInventoryAmount");

      fnToShowModal(true);
    } catch (error) {
      window.alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <section className="relative min-h-screen w-screen grid content-end md:grid-cols-3">
      <div
        className="bg-[90%_-25rem] md:bg-center bg-fixed md:bg-local md:bg-cover absolute md:static top-0 min-h-screen w-screen md:w-auto blur-sm md:filter-none -z-10 md:order-2"
        style={{ backgroundImage: `url(${image3})` }}
      />

      <div className="w-full bg-white p-8 mt-32 md:mt-8 filter-none md:order-1 md:col-span-2 max-w-[900px] mx-auto">
        <div>
          <img src={progress3} alt="" aria-hidden className="mb-4" />
          <h1 className="h4-sans-uppercase text-neutral-600">OVERVIEW</h1>
        </div>

        <h2 className="font-['Rasa'] text-[30px] font-[600] sm:text-[40px] text-neutral-600 pt-8">
          Here&apos;s your profile summary
        </h2>
        <p className="p18 text-neutral-600">
          Review the following details to finish setting up your profile
        </p>

        <section className="my-9">
          <h3 className="h4-sans-uppercase text-neutral-600">
            BUSINESS PROFILE
          </h3>
          <div className="grid grid-cols-2 gap-4 my-4 sm:grid-cols-4">
            <SummaryElement label="Full name" detail={fullName} />
            <SummaryElement label="Email address" detail={email} />
            <SummaryElement label="Company name" detail={companyName} />
            <SummaryElement label="Country" detail={country} />
          </div>
        </section>

        <section className="my-9">
          <h3 className="h4-sans-uppercase text-neutral-600">
            OPERATIONS SETTING
          </h3>
          <div className="grid grid-cols-2 gap-4 my-4 sm:grid-cols-4">
            <SummaryElement label="Profit margin %" detail={margin} unit="%" />
            <SummaryElement
              label="Max. warehouse capacity"
              detail={maxInventoryAmount}
              unit=" kg"
            />
            <SummaryElement
              label="Shipment threshold %"
              detail={amountPerShip}
              unit="%"
            />
            <SummaryElement
              label="Current inventory"
              detail={currentAmountLeft}
              unit=" kg"
            />
            <SummaryElement
              label="Initial balance"
              detail={currentBalance}
              preUnit="Php "
            />
          </div>
        </section>

        <div className="flex justify-between gap-4 mt-4 sm:mt-16">
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
        </div>
      </div>
    </section>
  );
};

export default Overview;
