/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import moment from 'moment-timezone';
import DeleteConfirmationModal from "./DeleteConfirmationModal.jsx"
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import EllipseIcon from '../../assets/icons/Ellipse.svg';
import CalendarIcon from '../../assets/icons/CalendarIcon.svg';
import Pagination from "../../component/btn/Pagination";
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import EditIcon from '../../assets/icons/EditIcon.svg';
import CtaBtn from "../../component/btn/CtaBtn";



const ViewPurchaseTable = ({
  setShowAddForm,
  handleEdit,
  purchasesFromParent,
  URL,
}) => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);
  const today = moment().tz("America/Vancouver").startOf('day').toDate();
  const endOfToday = moment().tz("America/Vancouver").endOf('day').toDate();
  
  const [dateRange, setDateRange] = useState({
    startDate: today,
    endDate: endOfToday,
  });
  const initialDateLabel = moment(today).format("MMMM DD, YYYY"); 
const [dateLabel, setDateLabel] = useState(initialDateLabel);
const [inputLabel, setInputLabel] = useState("Today");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const userId = useContext(UserIdContext);
  const inputRef = useRef(null);
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedPurchase, setSelectedPurchase] = useState(null);
const [activeDropdown, setActiveDropdown] = useState(null);

  const sortPurchaseData = (purchaseData) => {
    return purchaseData.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));
  };

  useEffect(() => {
    const url = `${URL}/tmpFinRoute/${userId}/purchase`;
    axios
      .get(url)
      .then((response) => {
        const sortedData = sortPurchaseData(response.data);
        setPurchases(sortedData);
        setFilteredPurchases(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, [purchasesFromParent, userId, URL]);


  const formatWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDecimal = (decimal128, decimalPlaces = 2) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return "0";
    }
    const number = parseFloat(decimal128.$numberDecimal);
  return number % 1 === 0 ? number.toString() : number.toFixed(decimalPlaces);
  };

  const deletePurchase = async (purchase) => {
      try {
      // cash balance
      await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `${URL}/tmpFinRoute/${userId}/currentbalance`,
        {
          user_id: userId,
          updatedPrice: 0,
          currentPrice: purchase.total_purchase_price.$numberDecimal,
          updatedDate: new Date(purchase.purchase_date),
          currentPurchaseDate: purchase.purchase_date,
          type: "purchase",
        }
      );
      // inventory
      await axios.patch(
        // eslint-disable-next-line no-underscore-dangle
        `http://localhost:5555/tmpFinRoute/${userId}/inventory/updatepurchase`,
        {
          user_id: userId,
          updatedCopra: 0,
          currentCopra: purchase.amount_of_copra_purchased.$numberDecimal,
          updatedDate: new Date(purchase.purchase_date),
          currentPurchaseDate: purchase.purchase_date,
          type: "purchase",
        }
      );

      // delete the id from user document(**CurrentBalance and inventory are not deleted. It's not necessary)
      await axios.patch(`${URL}/user/${userId}`, {
        purchases_array: { action: "pull", value: purchase._id },
      });

      // delete the doc
      await axios.delete(`${URL}/purchase/${purchase._id}`);

      // Refresh the purchases list
      const url = `${URL}/tmpFinRoute/${userId}/purchase`;
      axios
        .get(url)
        .then((response) => {
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPurchases(sortedData);
          setFilteredPurchases(sortedData);
        })
        .catch((error) => {
          console.error("Error fetching purchases:", error);
        });
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };


  const handleDeleteClick = (purchase, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPurchase(purchase);
    setIsDeleteModalOpen(true);
  };


  useEffect(() => {
    const filterPurchases = () => {
      const filtered = purchases.filter((purchase) => {
        if (!purchase.purchase_date) {
          return false; // Skip this purchase if the date is invalid
        }
        const purchaseDate = new Date(purchase.purchase_date);
        if (Number.isNaN(purchaseDate.getTime())) {
          return false; // Check if the date is valid
        }
        const purchaseDateString = purchaseDate.toISOString().split("T")[0];
        const startDateString = dateRange.startDate.toISOString().split("T")[0];
        const endDateString = dateRange.endDate.toISOString().split("T")[0];
        return purchaseDateString >= startDateString && purchaseDateString <= endDateString;
      });
      setFilteredPurchases(filtered);
      setCurrentPage(1);
    };
    filterPurchases();
}, [purchases, dateRange]);
  

 
const toggleDateModal = (handlePredefinedRange) => () => {
  setIsDateModalOpen(current => {
    // When closing the modal and no date is selected, default to this month
    if (current && (!dateRange.startDate || !dateRange.endDate)) {
      handlePredefinedRange("today");
    }
    return !current;
  });
  setIsDatePickerVisible(false); // Reset to initial state when closing the modal
};

const handleDateChange = (update) => {
  // Only update the range if both dates are selected
  if (update.length === 2 && update[0] && update[1]) {
    const [start, end] = update;
    if (start instanceof Date && end instanceof Date && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      setDateRange({
        startDate: start,
        endDate: end
      });
    } else {
      console.error("Invalid dates selected", start, end);
    }
  } else if (update.length === 2 && update[0] && !update[1]) {
    // Handle scenario where the start date is selected but the end date is not yet picked
    setDateRange(prev => ({ ...prev, startDate: update[0]}));
  }
};

  const handlePredefinedRange = (range) => {
    let start;
    let end;
    let label = "";
    switch (range) {
      case "today":
        label = today.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        setInputLabel("Today");
        start = new Date(today);
        end = new Date(today);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        label = "This Week";
        {
          const dayOfWeek = today.getDay();
          start = new Date(today.setDate(today.getDate() - dayOfWeek));
          start.setHours(0, 0, 0, 0);
          end = new Date(start);
          end.setDate(end.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          label = `${start.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })} - ${end.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}`;
          setInputLabel("This Week");
        }
        break;
      case "thisMonth":
        label = `${today.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}`;
        setInputLabel("This Month");
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        label = `${today.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}`;
        setInputLabel("Last Month");
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = today;
        end = today;
    }
    setDateRange({ startDate: start, endDate: end });
    setDateLabel(label);
    setIsDateModalOpen(false);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const submitDateRange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      const end = new Date(dateRange.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      setDateLabel(`${start} - ${end}`);
      setInputLabel(`${start} - ${end}`);
    }else {
      setDateLabel(initialDateLabel);
      setInputLabel("Today");
    }
    setIsDatePickerVisible(false);
    setIsDateModalOpen(false);
  };

  const handleEditClick = (purchase, e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddForm(true);
    handleEdit(purchase);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPurchases.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );  
  const totalPages = Math.ceil(filteredPurchases.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRowClassName = (index) => {
    return (index + indexOfFirstRecord) % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-bluegreen-100 cursor-pointer';
  };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !event.target.closest('.dropdown-content')
        ) {
          setDropdownVisible(null);
        }
      };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // const formatDateForVancouver = (dateString) => {
  //   // Parse the date string with moment, and then set the timezone to Vancouver
  //   const date = moment(dateString).tz("America/Vancouver");
  //   // Format the date as 'YYYY-MM-DD' which is the ISO date format
  //   return date.format('YYYY-MM-DD');
  // };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
    };

const updateModalPosition = () => {
  if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX
      });
  }
};

useEffect(() => {
updateModalPosition();
window.addEventListener('resize', updateModalPosition);
window.addEventListener('scroll', updateModalPosition);
return () => {
    window.removeEventListener('resize', updateModalPosition);
    window.removeEventListener('scroll', updateModalPosition);
};
}, []);

  return (
    <div>
 
      
      <div className="overflow-x-auto rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between mb-4 py-5 text-p14 font-dm-sans font-medium space-y-4 sm:space-y-0">
   <label className="mr-4">
    <span className="h3-sans">{dateLabel}</span>
  </label>
  <div className="relative flex items-center">
    <label className="mr-2 font-bold text-[14px]">
      Filter by date:
    </label>
    <div className="relative flex cursor-pointer">
      <input
        type="text"
        readOnly
        value={inputLabel}
        ref={inputRef}
        onClick={() => setIsDateModalOpen(true)}
        className="sm:w-32 md:w-60 py-2 px-2 border rounded cursor-pointer text-neutral-400  border-bluegreen-200"
      />
      <button 
        type="button" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setIsDateModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsDateModalOpen(true);
          }
        }}
      >
        <img src={CalendarIcon} alt="Calendar" />
      </button>
    </div>
    <Modal
  isOpen={isDateModalOpen}
  onRequestClose={toggleDateModal(handlePredefinedRange)}
  shouldCloseOnOverlayClick
  className="absolute z-10"
  overlayClassName="absolute inset-0 bg-black bg-opacity-0"
  style={{
    content: {
        top: `${inputPosition.top+40}px`, 
        left: `${inputPosition.left-60}px`,
        right: 'auto',
        bottom: 'auto',
        marginRight: '0',
        marginTop: '0',
        transform: 'none'
    }
}}>
  <div className="bg-white p-6 rounded-lg shadow-lg sm:w-[250px] md:w-[300px]">
    <h2 className="text-sm font-semibold text-neutral-600 mb-4">Select date range</h2>
    {isDatePickerVisible ? (
  <>
  <DatePicker
    selectsRange
    startDate={dateRange.startDate}
    endDate={dateRange.endDate}
    onChange={handleDateChange}
    inline
  />
<div className="grid grid-cols-2 pt-3 gap-3"> 
    <CtaBtn
      className="w-[183px]"
      size="M"
      level="O"
      innerTxt="Back"
      onClickFnc={hideDatePicker}
    />
    <CtaBtn
      className="w-[183px]"
      size="M"
      level="P"
      innerTxt="Submit"
      onClickFnc={submitDateRange}
    />
  </div>
</>

    ) : (
      <>
        <label>
          <input
            type="text"
            placeholder="MM/DD/YY - MM/DD/YY"
            readOnly
            onClick={showDatePicker}
            className="w-full py-2 px-4 mb-4 mt-2 border rounded-lg cursor-pointer text-sm text-neutral-600 border w-[310px]"
          />
           <button
        type="button"
        className="absolute right-10 top-[80px] cursor-pointer"
        onClick={showDatePicker}
      >
        <img src={CalendarIcon} alt="Calendar" />
      </button>
        </label>
        <div className="space-y-2 font-sans text-[12px] text-bluegreen-700">
          <button
            type="button"
            onClick={() => handlePredefinedRange("today")}
            className="w-full py-2 px-4  rounded-lg hover:bg-blue-100 border w-[310px]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handlePredefinedRange("thisWeek")}
            className="w-full py-2 px-4 rounded-lg hover:bg-blue-100 border w-[310px]"
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => handlePredefinedRange("thisMonth")}
            className="w-full py-2 px-4  rounded-lg hover:bg-blue-100 border w-[310px]"
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => handlePredefinedRange("lastMonth")}
            className="w-full py-2 px-4  rounded-lg hover:bg-blue-100 border w-[310px]"
          >
            Last Month
          </button>
        </div>
      </>
    )}
  </div>
</Modal>
 
  </div>
 
</div>
        <table className="min-w-full bg-white border-collapse text-p14 font-dm-sans font-medium">
          <thead>
            <tr className="bg-neutral-600 text-white text-left">
            <th className="p-2.5 rounded-tl-[8px] min-w-[123px]">Invoice No.</th>
    <th className="p-2.5 min-w-[113px]">Date</th>
    <th className="p-2.5 min-w-[183px]">Farmers Name</th>
    <th className="p-2.5 min-w-[139px]">Copra Bought</th>
    <th className="p-2.5 min-w-[143px]">Moisture</th>
    <th className="p-2.5 min-w-[143px]">Price Per kg</th>
    <th className="p-2.5 min-w-[156px]">Total Purchase</th>
    <th className="p-2.5 rounded-tr-[8px] min-w-[72px]">Action</th>
 
            </tr>
          </thead>
          <tbody>
          {filteredPurchases.slice(indexOfFirstRecord, indexOfLastRecord).map((purchase, index) => (
 <tr
                key={purchase._id}
                className={getRowClassName(indexOfFirstRecord + index)}              >
         <td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{purchase.invoice_number}</td>
<td className="px-2 py-0" style={{ width: '113px', height: '43px' }}>{formatDate(purchase.purchase_date)}</td>
<td className="px-2 py-0" style={{ width: '183px', height: '43px' }}>{purchase.farmer_id ? purchase.farmer_id.full_name : "-"}</td>
<td className="px-2 py-0" style={{ width: '139px', height: '43px' }}>{`${formatDecimal(purchase.amount_of_copra_purchased)} kg.`}</td>
<td className="px-2 py-0" style={{ width: '143px', height: '43px' }}>{`${formatDecimal(purchase.moisture_test_details, 0)}%`}</td>
<td className="px-2 py-0" style={{ width: '143px', height: '43px' }}>{`Php ${formatDecimal(purchase.sales_unit_price)}`}</td>
<td className="px-2 py-0" style={{ width: '156px', height: '43px' }}>{`Php ${formatDecimal(purchase.total_purchase_price)}`}</td>
<td className="px-2 py-0 relative" style={{ width: '72px', height: '43px' }}>
                  <div className="dropdown" ref={dropdownRef}>
                  <button
  type="button"
  className="dropbtn"
  onClick={(e) => {
    e.stopPropagation();
    setDropdownVisible(
      dropdownVisible === purchase._id ? null : purchase._id
    )
  }}
>
  <img src={EllipseIcon} alt="Options" />
</button>
                    {dropdownVisible === purchase._id && (
      <div className="dropdown-content absolute top-11 right-0  bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 pr-8"
                          onClick={(e) => {
                            handleEditClick(purchase,e);
                            setActiveDropdown(null);
                          }}
                        >
                       <img src={EditIcon} alt="Edit" className="mr-2" />

                          Edit
                        </button>
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"

                          onClick={(e) => handleDeleteClick(purchase, e)}
                          >
                                    <img src={DeleteIcon} alt="Delete" className="mr-2" />

                          Delete
                        </button>
                      </div>
                    )}
                     <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          deletePurchase(selectedPurchase);
          setIsDeleteModalOpen(false);  // Optionally close modal immediately after invoking delete
        }}
      />
                  </div>
                </td>
              </tr>
            ))}
           {Array.from({ length: recordsPerPage - currentRecords.length }).map((_, index) => (
    <tr
      // eslint-disable-next-line react/no-array-index-key
      key={`empty-${index}`}
      className={getRowClassName(indexOfFirstRecord + currentRecords.length + index)}
      style={{ width: '123px', height: '43px' }}
    >
      <td colSpan="8" className="px-2 py-0" aria-label="Empty Row">&nbsp;</td>
      </tr>
  ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex items-center justify-center mt-4">
        <Pagination
          size = "M"
          onClickFnc={handlePrevPage} 
          pageNum = "L"
          key = "L"
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination 
            onClickFnc={() => setCurrentPage(index + 1)}
            pageNum = {index + 1}
            key = {index + 1}
          />
        ))}
        <Pagination
          size = "M"
          onClickFnc={handleNextPage} 
          pageNum = "R"
          key = "R"
        />
      </div>
    </div>
    
  );
};

export default ViewPurchaseTable;
