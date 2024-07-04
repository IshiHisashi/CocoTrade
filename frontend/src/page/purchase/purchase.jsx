import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import ViewPurchaseTable from "./ViewPurchaseTable";
import AddPurchaseForm from "./AddPurchaseForm.jsx";

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

  return (
    <div>
      <h2>Purchase Log</h2>
      <button
        type="button"
        onClick={() => {
          setShowAddForm(true);
          setSelectedPurchase(null);
        }}
      >
        Add New Purchase
      </button>
      <Modal
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
