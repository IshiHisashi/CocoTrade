// ConfirmationModal.jsx
import React from "react";
import Modal from "react-modal";
import CtaBtn from "../../component/btn/CtaBtn";
import Exit from "../../assets/icons/Exit.svg";
import Delete from "../../assets/icons/DeleteIcon.svg";


const DeleteConfirmationModal = ({ isOpen, onRequestClose, onDelete }) => {
  const classNameForModal =
  "absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-95vh max-w-md overflow-auto p-6 shadow-lg";

  return (
    <Modal
    style={{
      content: {
        zIndex: '9999',
        position: 'relative',
        padding: '24px'
      },
      overlay: {
        zIndex: '9998',
        backgroundColor: "rgba(36, 48, 55, 0.1)",
      }
    }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={classNameForModal}
      contentLabel="Confirmation"
    >
     <div className="flex flex-col items-center justify-center gap-5"><div>
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onRequestClose}
          aria-label="Close"
        >
          <img src={Exit} alt="Close" className="w-6 h-6" />
        </button>
        </div>
        <img src={Delete} alt="" aria-hidden />
        <h1 className="text-xl font-bold mb-2 text-center">Delete Log Entry</h1>
        <p className="text-gray-700">Log entry will be deleted permanently</p>
        <div className="flex items-center justify-center gap-4 mt-4 w-[200px]">

        <CtaBtn
        size="M"
        level="P"
        innerTxt="Delete"
        onClickFnc={() => {
          onDelete();
          onRequestClose(); 
        }}
      />        
      <CtaBtn size="M" level="O" innerTxt="Back" onClickFnc={() => {
          onRequestClose(true);
          window.location.reload();
        }} />
      </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
