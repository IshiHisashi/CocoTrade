/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import Pagination from "../../component/btn/Pagination";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const ViewSalesTable = ({ showEditForm, setshowEditForm, handleEdit, URL }) => {
  const userId = useContext(UserIdContext);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [inputLabel, setInputLabel] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchSales = () => {
    const url = `${URL}/user/${userId}/sales`;
    axios
      .get(url)
      .then((response) => {
        setSales(response.data);
        setFilteredSales(response.data);
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

  const formatDecimal = (decimal128) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return "0.00";
    }
    return parseFloat(decimal128.$numberDecimal).toFixed(2);
  };

  useEffect(() => {
    const filterSales = () => {
      const filtered = sales.filter((sale) => {
        const saleDate = new Date(sale.copra_ship_date);
        const start = dateRange.startDate
          ? new Date(dateRange.startDate).setHours(0, 0, 0, 0)
          : null;
        const end = dateRange.endDate
          ? new Date(dateRange.endDate).setHours(23, 59, 59, 999)
          : null;
        return (
          (!start || saleDate >= start) &&
          (!end || saleDate <= end) &&
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
  const handleDeleteClick = async (saleId) => {
    try {
      await axios.delete(`${URL}/sale/${saleId}`);
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleEditClick = (sale) => {
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

  return (
    <div>
      <div className="flex justify-between mb-4 py-5">
        <label className="mr-4">
          <span className="ml-2 font-semibold">{dateLabel}</span>
        </label>
        <label>
            Date Filter:
            <input
              type="text"
              readOnly
              value={inputLabel}
              onClick={() => setIsDateModalOpen(true)}
            />
          </label>
      </div>
      <Modal isOpen={isDateModalOpen} onRequestClose={toggleDateModal}>
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
            <label>
              <input
                type="text"
                placeholder="MM/DD/YY - MM/DD/YY"
                readOnly
                onClick={showDatePicker}
              />
            </label>
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
      </Modal>
      <table className="min-w-full bg-white border-collapse"> 
               <thead>
          <tr className="bg-black text-white text-left">
            <th>Ship Date</th>
            <th>Manufacturer</th>
            <th>Sales Unit Price</th>
            <th>Copra Sold</th>
            <th>Received On</th>
            <th>Total Sale</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((sale) => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={sale._id}>
              <td>{new Date(sale.copra_ship_date).toLocaleDateString()}</td>
              <td>
                {sale.manufacturer_id ? sale.manufacturer_id.full_name : "N/A"}
              </td>
              <td>{formatDecimal(sale.sales_unit_price)}</td>
              <td>{`${formatDecimal(sale.amount_of_copra_sold)} kg`}</td>
              <td>
                {sale.cheque_receive_date
                  ? new Date(sale.cheque_receive_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{`PHP ${formatDecimal(sale.total_sales_price)}`}</td>
              <td>{sale.status}</td>
              <td>
                <div className="dropdown">
                  <button
                    type="button"
                    className="dropbtn"
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() =>
                      setDropdownVisible(
                        // eslint-disable-next-line no-underscore-dangle
                        dropdownVisible === sale._id ? null : sale._id
                      )
                    }
                  >
                    ...
                  </button>
                  {
                    // eslint-disable-next-line no-underscore-dangle
                    dropdownVisible === sale._id && (
                      <div className="dropdown-content">
                        <button
                          type="button"
                          onClick={() => {
                            handleEditClick(sale);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            // eslint-disable-next-line no-underscore-dangle
                            handleDeleteClick(sale._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
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
