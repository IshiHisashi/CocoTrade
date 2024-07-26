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
`
  absolute bg-white h-full top-0 left-0 right-0 bottom-0 sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:mr-[-50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[10px] sm:max-h-[95vh] overflow-scroll sm:h-auto sm:w-[508px]`;
 
  return (
    <div>
      <Modal
  style={{
    content: {
      zIndex: '9999',
      position: 'relative',
      padding: '24px'
    },
    overlay: {
      zIndex: '9998',
      backgroundColor: "#24303790",
    }
  }}
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
      <div className=" sm:border sm:border-neutral-100 sm:rounded-lg bg-neutral-0 p-[27px] lg:m-[30px]">

      <ViewSalesTable
        showEditForm={showEditForm}
        setshowEditForm={setshowEditForm}
        handleEdit={handleEdit}
        URL={URL}
      />
      </div>
        <ConfirmationModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        message={confirmationMessage}
      />
    </div>
  );
};

export default Sale;
