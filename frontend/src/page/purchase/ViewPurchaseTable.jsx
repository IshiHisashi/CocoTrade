/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import EllipseIcon from '../../assets/icons/Ellipse.svg';
import CalendarIcon from '../../assets/icons/CalendarIcon.svg';
import Pagination from "../../component/btn/Pagination";

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
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [inputLabel, setInputLabel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newlyAdded, setNewlyAdded] = useState(false);
  const recordsPerPage = 10;
  const userId = useContext(UserIdContext);


  const setNewlyAddedInLocalStorage = (value) => {
    localStorage.setItem('newlyAdded', JSON.stringify(value));
  };

  const getNewlyAddedFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('newlyAdded'));
  };

  useEffect(() => {
    const url = `${URL}/tmpFinRoute/${userId}/purchase`;
    axios
      .get(url)
      .then((response) => {
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPurchases(sortedData);
        setFilteredPurchases(sortedData);
        const newlyAddedFromStorage = getNewlyAddedFromLocalStorage();
        setNewlyAdded(newlyAddedFromStorage);
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
      return "0.00";
    }
    const number = parseFloat(decimal128.$numberDecimal).toFixed(decimalPlaces);
    return formatWithCommas(number);

  };

  const handleDeleteClick = async (purchase, e) => {
    e.preventDefault();
    e.stopPropagation();    try {
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
        setNewlyAdded(false); // Do not set newly added on delete
          setNewlyAddedInLocalStorage(false);
        })
        .catch((error) => {
          console.error("Error fetching purchases:", error);
        });
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  useEffect(() => {
    const filterPurchases = () => {
      const filtered = purchases.filter((purchase) => {
        const purchaseDate = new Date(purchase.purchase_date);
        const start = dateRange.startDate
          ? new Date(dateRange.startDate).setHours(0, 0, 0, 0)
          : null;
        const end = dateRange.endDate
          ? new Date(dateRange.endDate).setHours(23, 59, 59, 999)
          : null;
        return (
          (!start || purchaseDate >= start) && (!end || purchaseDate <= end)
        );
      });
      setFilteredPurchases(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    };
    filterPurchases();
  }, [purchases, dateRange]);

  const toggleDateModal = () => {
    setIsDateModalOpen(!isDateModalOpen);
    setIsDatePickerVisible(false); // Reset to initial state when closing the modal
    setDateRange({ startDate: null, endDate: null }); // Reset date range when opening the modal
    setDateLabel(""); // Clear the date label
    setInputLabel("");
  };
  const handleDateChange = (update) => {
    setDateRange({ startDate: update[0], endDate: update[1] });
    setDateLabel("");
    setInputLabel("");
  };

  const handlePredefinedRange = (range) => {
    const today = new Date();
    let start;
    let end;
    let label = "";
    switch (range) {
      case "today":
        label = today.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        setInputLabel("Today");
        start = new Date(today.setHours(0, 0, 0, 0));
        end = new Date(today.setHours(23, 59, 59, 999));
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
    if (newlyAdded && currentPage === 1 && index === 0) return 'bg-neutral-100 cursor-pointer';
    return index % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-bluegreen-100 cursor-pointer';
  };

  const handleRowClick = (index) => {
    if (index === 0) {
      setNewlyAdded(false);
      setNewlyAddedInLocalStorage(false);
    }
  };

// Add this useEffect to handle clicks outside the dropdown
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};



  return (
    <div>
<div className="flex lg:justify-end mb-4 py-5 text-p14 font-dm-sans font-medium">
  <label className="mr-4">
    <span className="h3-sans">{dateLabel}</span>
  </label>
  <div className="relative flex items-center">
    <label className="mr-2 font-bold">
      Filter by date:
    </label>
    <div className="relative flex cursor-pointer">
      <input
        type="text"
        readOnly
        value={inputLabel}
        onClick={() => setIsDateModalOpen(true)}
        className="w-60 py-2 px-2 border rounded cursor-pointer text-neutral-400  border-bluegreen-200"
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
  </div>
</div>
      <Modal isOpen={isDateModalOpen} onRequestClose={toggleDateModal}   shouldCloseOnOverlayClick
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-p14 font-dm-sans font-medium">
<div className="bg-white p-6 rounded-lg w-[380px] h-[445px]">
        <h2>Select Date Range</h2>
        {isDatePickerVisible ? (
          <>
            <DatePicker
              selectsRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateChange}
              inline
            />
            <button type="button" onClick={hideDatePicker}>
              Back
            </button>
            <button type="button" onClick={submitDateRange}>
              Submit
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="MM/DD/YY - MM/DD/YY"
              readOnly
              onClick={showDatePicker}
            />

            <div>
              <button
                type="button"
                onClick={() => handlePredefinedRange("today")}
              >
                Today
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handlePredefinedRange("thisWeek")}
              >
                This Week
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handlePredefinedRange("thisMonth")}
              >
                This Month
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handlePredefinedRange("lastMonth")}
              >
                Last Month
              </button>
            </div>
          </>
        )}
         </div>
      </Modal>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border-collapse text-p14 font-dm-sans font-medium">
          <thead>
            <tr className="bg-black text-white text-left">
            <th className="p-2.5 rounded-tl-[8px] min-w-[150px]">Invoice No.</th>
    <th className="p-2.5 min-w-[100px]">Date</th>
    <th className="p-2.5 min-w-[150px]">Farmers Name</th>
    <th className="p-2.5 min-w-[150px]">Copra Bought</th>
    <th className="p-2.5 min-w-[150px]">Moisture</th>
    <th className="p-2.5 min-w-[150px]">Price Per kg</th>
    <th className="p-2.5 min-w-[150px]">Total Purchase</th>
    <th className="p-2.5 rounded-tr-[8px] min-w-[100px]">Action</th>
 
            </tr>
          </thead>
          <tbody>
          {currentRecords.map((purchase, index) => (
   <tr
   key={purchase._id}
   className={getRowClassName(index)}
   onClick={(e) => {
     e.stopPropagation(); // Prevent the event from bubbling up to the document click handler
     handleRowClick(index);
   }}
 >
         <td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{purchase.invoice_number}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{formatDate(purchase.purchase_date)}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{purchase.farmer_id ? purchase.farmer_id.full_name : "-"}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{`${formatDecimal(purchase.amount_of_copra_purchased)} kg.`}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{`${formatDecimal(purchase.moisture_test_details, 0)}%`}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{`Php ${formatDecimal(purchase.sales_unit_price)}`}</td>
<td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>{`Php ${formatDecimal(purchase.total_purchase_price)}`}</td>
<td className="px-2 py-0 relative" style={{ width: '123px', height: '43px' }}>
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
      <div className="dropdown-content absolute top-0 right-0  bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={(e) => handleEditClick(purchase, e)}

                        >          <img src={CalendarIcon} alt="Edit" className="mr-2" />

                          Edit
                        </button>
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"

                          onClick={(e) => handleDeleteClick(purchase, e)}
                          >
                                    <img src={CalendarIcon} alt="Delete" className="mr-2" />

                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
           {Array.from({ length: recordsPerPage - currentRecords.length }).map((_, index) => (
    <tr
      // eslint-disable-next-line react/no-array-index-key
      key={`empty-${index}`}
      className={index % 2 === 0 ? 'bg-white' : 'bg-bluegreen-100'}
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
