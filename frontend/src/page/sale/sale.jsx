import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import ViewSalesTable from "./ViewSalesTable";
import EditSaleModal from "./EditSaleModal";
import ConfirmationModal from "./ConfirmationModal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const Sale = ({ URL }) => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setshowEditForm(true);
  };
  const handleFormSubmit = (message) => {
    setshowEditForm(false);
    setConfirmationMessage(message);
    setShowConfirmation(true);
  };

  const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] max-w-[30vw] overflow-scroll p-2";

  return (
    <div>
      <div>Sales Log</div>
      <Modal
      className={classNameForModal}
        isOpen={showEditForm}
         onRequestClose={() => setshowEditForm(false)}
        contentLabel="Edit Sales Form"
        shouldCloseOnOverlayClick={false} // Disable closing on outside click
      >
        <EditSaleModal
          showEditForm={showEditForm}
          setshowEditForm={setshowEditForm}
          selectedSale={selectedSale} 
          setSelectedSale={setSelectedSale} 
          setSales={setSales} 
          URL={URL}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
      <ViewSalesTable
        showEditForm={showEditForm}
        setshowEditForm={setshowEditForm}
        handleEdit={handleEdit}
        URL={URL}
      />
        <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        message={confirmationMessage}
      />
    </div>
  );
};

export default Sale;
