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
          showEditForm={showEditForm} 
          setshowEditForm={setshowEditForm} 
          selectedSale={selectedSale} 
          setSelectedSale={setSelectedSale} 
          setSales={setSales} 
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
