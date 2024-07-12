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
  const classNameForModal =
  "absolute bg-white top-[50%] left-[50%] right-auto bottom-auto mr-[-50%] translate-x-[-50%] translate-y-[-50%] rounded-[10px] max-h-[85vh] max-w-[30vw] overflow-scroll p-2";

  return (
    <div>
      <div>Sales Log</div>
      <Modal
      className={classNameForModal}
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
