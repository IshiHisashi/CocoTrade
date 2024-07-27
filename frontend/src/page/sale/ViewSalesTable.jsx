/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import moment from 'moment-timezone';
import Pagination from "../../component/btn/Pagination";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
 import Exit from '../../assets/icons/Exit.svg';
 import BlackEllipse from '../../assets/icons/BlackEllipse.svg';
 import BlueEllipse from '../../assets/icons/BlueEllipse.svg';
 import RedEclipse from '../../assets/icons/RedEclipse.svg';
 import YellowEclipse from '../../assets/icons/YellowEclipse.svg';
 import Dropdown from '../../assets/icons/Dropdown.svg';
 import CtaBtn from "../../component/btn/CtaBtn";
 import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import EditIcon from '../../assets/icons/EditIcon.svg';
import CalendarIcon from '../../assets/icons/CalendarIcon.svg';
import EllipseIcon from '../../assets/icons/Ellipse.svg';

// import CalendarIcon from '../../assets/icons/CalendarIcon.svg';


const statusOptions = [
  { value: 'all', label: 'All', icon: BlackEllipse },
  { value: 'pending', label: 'Pending', icon: YellowEclipse },
  { value: 'ongoing', label: 'Ongoing', icon: RedEclipse },
  { value: 'completed', label: 'Completed', icon: BlueEllipse },
];

const CustomDropdown = ({ options, value, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (optionValue,e) => {
    e.preventDefault();
    onChange(optionValue);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-[185px] h-[28px] p-[15px] bg-white border border-gray-300 rounded flex items-center justify-between px-2"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedOption && (
          <div className="flex items-center text-neutral-300">
            <img src={selectedOption.icon} alt={selectedOption.label} className="w-4 h-4 mr-2" />
            {selectedOption.label}
          </div>
        )}
        <span className="ml-2"><img src={Dropdown} alt={selectedOption.label} className="w-[6px] h-[4px] mr-2" />
        </span>
      </button>
      {dropdownOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 ">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex items-center hover:bg-gray-100 w-full text-left p-[15px]"
              onClick={(e) => {handleOptionClick(option.value,e);}}
            >
              <img src={option.icon} alt={option.label} className="w-4 h-4 mr-2" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ViewSalesTable = ({ showEditForm, setshowEditForm, handleEdit, URL }) => {
  const userId = useContext(UserIdContext);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const dropdownRef = useRef(null);
  const today = moment().tz("America/Vancouver").toDate(); 
  const initialStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
  const initialEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of this month
  const initialDateLabel = `${initialStartDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}`; // Label for this month
   const [dateRange, setDateRange] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [inputLabel, setInputLabel] = useState("This Month");
  const [dateLabel, setDateLabel] = useState(initialDateLabel);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [newlyAdded, setNewlyAdded] = useState(false);
  const [highlightNewlyAdded, setHighlightNewlyAdded] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const inputRef = useRef(null);
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);

  const setNewlyAddedInLocalStorage = (value) => {
    localStorage.setItem('newlyAdded', JSON.stringify(value));
  };

  const getNewlyAddedFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('newlyAdded'));
  }; 

  const fetchSales = () => {
    const url = `${URL}/user/${userId}/sales`;
    axios
      .get(url)
      .then((response) => {
        const sortedData = response.data.sort((a, b) => new Date(b.copra_ship_date) - new Date(a.copra_ship_date));
        setSales(sortedData);
        setFilteredSales(sortedData);
        const newlyAddedFromStorage = getNewlyAddedFromLocalStorage();
        setHighlightNewlyAdded(newlyAddedFromStorage);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  };

  useEffect(() => {
    fetchSales();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [userId, URL, showEditForm]);

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

  useEffect(() => {
    const filterSales = () => {
      const filtered = sales.filter((sale) => {
        const saleDate = new Date(sale.copra_ship_date).toISOString().split("T")[0];;
        const startDate = dateRange.startDate.toISOString().split("T")[0];
        const endDate = dateRange.endDate.toISOString().split("T")[0];
        return (
          (!startDate || saleDate >= startDate) &&
          (!endDate || saleDate <= endDate) &&
          (statusFilter === "all" || sale.status === statusFilter)
        );
      });
      setFilteredSales(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    };
    filterSales();
  }, [statusFilter, sales, dateRange]);

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
    } else {
      setDateLabel(initialDateLabel);
      setInputLabel("Today");
    }
    setIsDatePickerVisible(false);
    setIsDateModalOpen(false);
  };

  const handleDeleteClick = async (saleId) => {
    try {
      const targetSalesLog = await axios.get(`${URL}/sale/${saleId}`);
      console.log(targetSalesLog.data);

      // Object to pass to inventory update api
      const createObjectToPassForInv = (sub, rev, mod, ship) => {
        const object = {
          userId,
          prevShipDate: targetSalesLog.data.copra_ship_date,
          newShipDate: targetSalesLog.data.copra_ship_date,
          prevAmount: targetSalesLog.data.amount_of_copra_sold.$numberDecimal,
          newAmount: targetSalesLog.data.amount_of_copra_sold.$numberDecimal,
          subtractInvNeeded: sub,
          reverseInvNeeded: rev,
          modifInvWithDiffNeeded: mod,
          changeBasedOnShipDateNeeded: ship,
        }
        return object;
      }
      // Object to pass to inventory (only for pending) update api
      const createObjectToPassForInvForPending = (sub, rev, mod, ship) => {
        const object = {
          userId,
          prevShipDate: targetSalesLog.data.copra_ship_date,
          newShipDate: targetSalesLog.data.copra_ship_date,
          prevAmount: targetSalesLog.data.amount_of_copra_sold.$numberDecimal,
          newAmount: 0,
          subtractInvNeeded: sub,
          reverseInvNeeded: rev,
          modifInvWithDiffNeeded: mod,
          changeBasedOnShipDateNeeded: ship,
        }
        return object;
      }
      // Object to pass to finance upate api
      const createObjectToPassForFin = (add, rev, mod) => {
        const object = {
          userId,
          prevReceivedDate: targetSalesLog.data.cheque_receive_date,
          newReceivedDate: targetSalesLog.data.cheque_receive_date,
          prevPrice: targetSalesLog.data.total_sales_price.$numberDecimal,
          newPrice: targetSalesLog.data.total_sales_price.$numberDecimal,
          addFinNeeded: add,
          reverseFinNeeded: rev,
          modifFinWithDiffNeeded: mod
        }
        return object;
      }

      let objInv;
      let objFin = null;

      // conditioning      
      if (targetSalesLog.data.status === "ongoing") {
        objInv = createObjectToPassForInv(false, true, false, false);
        axios.patch(`${URL}/inventory/updateForSales`, objInv);
      } else if(targetSalesLog.data.status === "completed") {
        objInv = createObjectToPassForInv(false, true, false, false);
        axios.patch(`${URL}/inventory/updateForSales`, objInv);
        objFin = createObjectToPassForFin(false, true, false);
      }
      console.log(objInv);
      console.log(objFin);
      const objInvForPending = createObjectToPassForInvForPending(false, false, false, false);
      axios.patch(`${URL}/inventory/updateForSales`, objInvForPending);
      if (objFin !== null) {
        axios.patch(`${URL}/currentbalance/updateForSales`, objFin);
      }

      await axios.delete(`${URL}/sale/${saleId}`);
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleEditClick = (sale, e) => {
    e.preventDefault();
    e.stopPropagation();
    setshowEditForm(true);
    handleEdit(sale);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSales.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredSales.length / recordsPerPage);

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
    if (newlyAdded && currentPage === 1 && index === 0 && highlightNewlyAdded) {
      return 'bg-neutral-100 cursor-pointer';
    }
    return index % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-bluegreen-100 cursor-pointer';
  };

  const handleRowClick = (index) => {
    if (index === 0 && newlyAdded && highlightNewlyAdded) {
      setHighlightNewlyAdded(false);
      setNewlyAdded(false);
      setNewlyAddedInLocalStorage(false);
    }
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

  // Add this useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.dropdown-content')
      ) {
        setDropdownVisible(null);
        if (newlyAdded && highlightNewlyAdded) {
          setHighlightNewlyAdded(false);
          setNewlyAddedInLocalStorage(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newlyAdded, highlightNewlyAdded]);
  

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
//   return date.toLocaleDateString('en-US', options);
// };
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
  };


  const getStatusClass = (status) => {
    const baseClass = 'px-2 py-1 rounded-full text-sm font-semibold capitalize'; // Added 'capitalize' here
    switch (status) {
      case 'ongoing':
        return `${baseClass} bg-orange-200 text-orange-500`;
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-200`;
      case 'completed':
        return `${baseClass} bg-bluegreen-100 text-bluegreen-500`;
      default:
        return `${baseClass} bg-gray-400`;
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between mb-4 py-5 text-p14 font-dm-sans font-medium space-y-4 sm:space-y-0">
  <label className="mr-4">
    <span className="h3-sans">{dateLabel}</span>
  </label>
  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0">      
    <label className="mr-2 font-bold mb-2 sm:mb-0">
      <CustomDropdown
        options={statusOptions}
        value={statusFilter}
        onChange={(value) => {
          setStatusFilter(value);
          setActiveDropdown(null);        }}      />
    </label>
   
    <div className="relative flex items-center mb-2 sm:mb-0">
    <label className="mr-2 font-bold text-[14px]">
        Filter by date
      </label>
      <input
          type="text"
          readOnly
          value={inputLabel}
          onClick={() => setIsDateModalOpen(true)}
          ref={inputRef}
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
        <Modal
  isOpen={isDateModalOpen}
  onRequestClose={toggleDateModal}
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
            className="w-full py-2 px-4 mb-4 mt-2 border rounded-lg cursor-pointer text-neutral-600 border-neutral-600 w-[310px]"
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
</div>
      <table className="min-w-full bg-white border-collapse text-p14 font-dm-sans font-medium">
                       <thead>
                       <tr className="bg-neutral-600 text-white text-left">
                       <th className="p-2.5 rounded-tl-[8px] min-w-[109px]">Ship date</th>
                       <th className="p-2.5 min-w-[169px]">Manufacturer</th>
                       <th className="p-2.5 min-w-[143px]">Unit sales price</th>
                       <th className="p-2.5 min-w-[139px]">Copra Sold</th>
                       <th className="p-2.5 min-w-[123px]">Received On</th>
                       <th className="p-2.5 min-w-[156px]">Total sale</th>
                       <th className="p-2.5 min-w-[141px]">Status</th>
            <th className="p-2.5 rounded-tr-[8px] min-w-[100px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((sale, index) => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={sale._id} className={getRowClassName(index)}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the event from bubbling up to the document click handler
              handleRowClick(index);
            }}>
              <td className="px-2 py-0" style={{ width: '109px', height: '43px' }}>{formatDate(sale.copra_ship_date)}</td>
              <td className="px-2 py-0" style={{ width: '169px', height: '43px' }}>
                {sale.manufacturer_id ? sale.manufacturer_id.full_name : "-"}
              </td>
              <td className="px-2 py-0" style={{ width: '143px', height: '43px' }}>{formatDecimal(sale.sales_unit_price)}</td>
              <td className="px-2 py-0" style={{ width: '139px', height: '43px' }}>{`${formatDecimal(sale.amount_of_copra_sold)} kg`}</td>
              <td className="px-2 py-0" style={{ width: '123px', height: '43px' }}>
                {sale.cheque_receive_date
                  ? new Date(sale.cheque_receive_date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-2 py-0" style={{ width: '156px', height: '43px' }}>
  {sale.total_sales_price && parseFloat(sale.total_sales_price.$numberDecimal) === 0 
    ? '-' 
    : `Php ${formatDecimal(sale.total_sales_price)}`}
</td> 
<td className="px-2 py-0" style={{ width: '141px', height: '43px' }}>
  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusClass(sale.status)}`}>
    {sale.status}
  </span>
</td>              <td className="px-2 py-0 relative" style={{ width: '72px', height: '43px' }}>               
                 <div className="dropdown" ref={dropdownRef}>
                  <button
                    type="button"
                    className="dropbtn"
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={(e) =>{
                      e.stopPropagation();
                      setDropdownVisible(
                        // eslint-disable-next-line no-underscore-dangle
                        dropdownVisible === sale._id ? null : sale._id
                      )
                    }}
                  >
  <img src={EllipseIcon} alt="Options" />
                    </button>
                  {
                    // eslint-disable-next-line no-underscore-dangle
                    dropdownVisible === sale._id && (
                      <div className="dropdown-content absolute top-11 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 text-neutral-600 hover:bg-bluegreen-100 pr-8"
                          onClick={(e) => {
                            handleEditClick(sale,e);
                            setActiveDropdown(null);
                          }}
                        >
                            <img src={EditIcon} alt="Edit" />
                          Edit
                        </button>
                        <button type="button" className="flex items-center px-4 py-2 text-neutral-600 hover:bg-bluegreen-100" onClick={(e) => {
        handleDeleteClick(sale._id, e);
        setActiveDropdown(null); // Close dropdown after action
      }}>
        <img src={DeleteIcon} alt="Delete" />
        Delete
      </button>
                      </div>
                    )
                  }
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

export default ViewSalesTable;
