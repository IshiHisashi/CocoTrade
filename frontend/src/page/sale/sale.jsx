import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import ViewSalesTable from "./ViewSalesTable";
import EditSaleModal from "./EditSaleModal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const Sale = ({ URL }) => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showEditForm, setshowEditForm] = useState(false);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
  };

  const handleUpdate = async (updatedSale) => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      await axios.patch(`${URL}/sale/${updatedSale._id}`, updatedSale);
      setshowEditForm(false);
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
        isOpen={showEditForm}
        onRequestClose={() => {
          setshowEditForm(false);
        }}
        contentLabel="Edit Sales Form"
      >
        <EditSaleModal
          setshowEditForm={setshowEditForm}
          sale={selectedSale}
          handleUpdate={handleUpdate}
          URL={URL}
        />
      </Modal>
      <ViewSalesTable
        showEditForm={showEditForm}
        setshowEditForm={setshowEditForm}
        handleEdit={handleEdit}
        URL={URL}
      />
    </div>
  );
};

export default Sale;
