import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import ViewPurchaseTable from "./ViewPurchaseTable";
import AddPurchaseForm from "./AddPurchaseForm.jsx";
import CtaBtn from "../../component/btn/CtaBtn";
import ConfirmationModal from "./ConfirmationModal"; 
import Add from "../../assets/icons/Add.svg";

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
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal
  const [confirmationMessage, setConfirmationMessage] = useState(""); 

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setShowAddForm(true);

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
      setConfirmationMessage("Purchase has been updated successfully.");
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  const handleFormSubmit = (message) => {
    setShowAddForm(false);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };

  const classNameForModal = `
  absolute bg-white top-0 left-0 w-full h-full sm:top-[55%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] sm:h-auto sm:max-w-[30vw] overflow-scroll p-3`;
  return (
    <div className="relative">

<Modal
  style={{
    content: {
      zIndex: '9999',
      position: 'relative',
    },
    overlay: {
      zIndex: '9998',
      backgroundColor: "#24303790",
    }
  }}
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
        shouldCloseOnOverlayClick={false} // Disable closing on outside click
      >
        <AddPurchaseForm
          setShowAddForm={setShowAddForm}
          purchase={selectedPurchase}
          handleUpdate={handleUpdate}
          setPurchasesFromParent={setPurchases}
          URL={URL}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
      <div className="w-full flex justify-end items-center mb-4 pr-9 md:pr-8 md:pt-3">
      <CtaBtn 
      size="M"
      level="P"
      innerTxt="Add Purchase"
      imgSource={Add}
      onClickFnc={() => {
        setShowAddForm(true);
        setSelectedPurchase(null);
      }}
      
    />
    </div>
    <div className=" sm:border sm:border-neutral-100 sm:rounded-lg bg-neutral-0 p-[27px] m-[30px]">
    
      <ViewPurchaseTable
        setShowAddForm={setShowAddForm}
        handleEdit={handleEdit}
        purchasesFromParent={purchases}
        URL={URL}
      />
      </div>
       <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => {
          setShowConfirmation(false);
          navigate("/purchase");
        }}
        message={confirmationMessage}
      />
    </div>
  );
};

export default Purchase;
