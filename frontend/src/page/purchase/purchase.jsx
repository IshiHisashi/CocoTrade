import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import ViewPurchaseTable from "./ViewPurchaseTable";
import AddPurchaseForm from "./AddPurchaseForm.jsx";

// Set the app element for accessibility
Modal.setAppElement("#root");

const Purchase = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [purchases, setPurchases] = useState([]);
  const [showAddForm, setShowAddForm] = useState(
    location.state ? location.state.showAddForm : false
  );
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
  };

  const handleUpdate = async (updatedPurchase) => {
    try {
      await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `http://localhost:5555/purchase/${updatedPurchase._id}`,
        updatedPurchase
      );
      setShowAddForm(false);
      setSelectedPurchase(null);
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          // eslint-disable-next-line no-underscore-dangle
          purchase._id === updatedPurchase._id ? updatedPurchase : purchase
        )
      );
      // window.location.reload();
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
        />
      </Modal>
      <ViewPurchaseTable
        setShowAddForm={setShowAddForm}
        handleEdit={handleEdit}
        purchasesFromParent={purchases}
      />
    </div>
  );
};

export default Purchase;
