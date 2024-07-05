import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import ViewPurchaseTable from "./ViewPurchaseTable";
import AddPurchaseForm from "./AddPurchaseForm.jsx";
import CtaBtn from "../../component/btn/CtaBtn";

// Set the app element for accessibility
Modal.setAppElement("#root");

const Purchase = ({ URL }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const [purchases, setPurchases] = useState([]);
  const [purchases, setPurchases] = useState({});
  const [showAddForm, setShowAddForm] = useState(
    location.state ? location.state.showAddForm : false
  );
 
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const handleUpdate = async (updatedPurchase, currentPurchase, userid) => {
    try {
      await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `${URL}/purchase/${updatedPurchase._id}`,
        updatedPurchase
      );
      // update cach_balance
      const updateCash = await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `${URL}/tmpFinRoute/${userid}/currentbalance`,
        {
          user_id: userid,
          updatedPrice: updatedPurchase.total_purchase_price,
          currentPrice: currentPurchase.total_purchase_price.$numberDecimal,
          updatedDate: new Date(updatedPurchase.purchase_date),
          currentPurchaseDate: currentPurchase.purchase_date,
          type: "purchase",
        }
      );
      const newCashBalanceId = updateCash?.data?.data?.newCurrentBalance._id;
      // update inventory_balance
      const updateInventory = await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `${URL}/tmpFinRoute/${userid}/inventory/updatepurchase`,
        {
          user_id: userid,
          updatedCopra: updatedPurchase.amount_of_copra_purchased,
          currentCopra:
            currentPurchase.amount_of_copra_purchased.$numberDecimal,
          updatedDate: new Date(updatedPurchase.purchase_date),
          currentPurchaseDate: currentPurchase.purchase_date,
          type: "purchase",
        }
      );
      const newInventoryId = updateInventory?.data?.data?.newInventory._id;
      // Send ids to the coresponding user documents
      const updateData = {};
      if (newCashBalanceId) {
        updateData.balance_array = {
          action: "push",
          value: newCashBalanceId,
        };
      }
      if (newInventoryId) {
        updateData.inventory_amount_array = {
          action: "push",
          value: newInventoryId,
        };
      }
      if (newCashBalanceId || newInventoryId) {
        await axios.patch(`http://localhost:5555/user/${userid}`, updateData);
      }
      // UI control
      setShowAddForm(false);
      setSelectedPurchase(null);
      setPurchases(updatedPurchase);
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] max-w-[30vw] overflow-scroll p-2";

  return (
    <div>
      <h1>Purchase Log</h1>
  <div className="flex justify-end mb-4">
      <CtaBtn 

        size="M"
        level="P"
        innerTxt="Add New Purchase"
        onClickFnc={() => {
          setShowAddForm(true);
          setSelectedPurchase(null);
        }}
      />
      </div>
      <Modal
              className={classNameForModal}
        isOpen={showAddForm}
        onRequestClose={() => {
          setShowAddForm(false);
          location.state.showAddForm = false;
          // set location.state.showAddForm to false
          // (this is realted to reloading behaviour
          // when users visiting purchase page from Add Purchase button on Dashboard)
          navigate("/purchase", { state: { showAddForm: false } });
          // window.location.reload();
        }}
        contentLabel="Add Purchase Form"
      >
        <AddPurchaseForm
          setShowAddForm={setShowAddForm}
          purchase={selectedPurchase}
          handleUpdate={handleUpdate}
          setPurchasesFromParent={setPurchases}
          URL={URL}
        />
      </Modal>
      <ViewPurchaseTable
        setShowAddForm={setShowAddForm}
        handleEdit={handleEdit}
        purchasesFromParent={purchases}
        URL={URL}
      />
    </div>
  );
};

export default Purchase;
