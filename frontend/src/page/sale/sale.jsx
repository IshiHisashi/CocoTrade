import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import ViewSalesTable from "./ViewSalesTable";
import EditSaleModal from "./EditSaleModal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const Sale = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
  };

  const handleUpdate = async (updatedSale) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      await axios.patch(
        `http://localhost:5555/sale/${updatedSale._id}`,
        updatedSale
      );
      setShowAddForm(false);
      setSelectedSale(null);
      setSales((prevSales) =>
        prevSales.map((sale) =>
          // eslint-disable-next-line no-underscore-dangle
          sale._id === updatedSale._id ? updatedSale : sale
        )
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  return (
    <div>
      <div>Sales Log</div>
      <Modal
        isOpen={showAddForm}
        onRequestClose={() => {
          setShowAddForm(false);
          window.location.reload();
        }}
        contentLabel="Edit Sales Form"
      >
        <EditSaleModal
          setShowAddForm={setShowAddForm}
          sale={selectedSale}
          handleUpdate={handleUpdate}
        />
      </Modal>
      <ViewSalesTable setShowAddForm={setShowAddForm} handleEdit={handleEdit} />
    </div>
  );
};

export default Sale;
