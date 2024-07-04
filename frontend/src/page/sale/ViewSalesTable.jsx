/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const ViewSalesTable = ({ setShowAddForm, handleEdit, URL }) => {
  const userId = useContext(UserIdContext);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
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
    const url = `${URL}/tmpFinRoute/${userId}/sale`;
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
    const url = `${URL}/tmpFinRoute/${userId}/sale`;
    axios
      .get(url)
      .then((response) => {
        setSales(response.data);
        setFilteredSales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  }, [userId, URL]);

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
  };
  const handleDateChange = (update) => {
    setDateRange({ startDate: update[0], endDate: update[1] });
    setDateLabel("");
  };

  const handlePredefinedRange = (range) => {
    const today = new Date();
    let start;
    let end;
    let label = "";
    switch (range) {
      case "today":
        label = "Today";
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
        }
        break;
      case "thisMonth":
        label = "This Month";
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        label = "Last Month";
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
    setShowAddForm(true);
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
      <div>
        <label>
          Status Filter:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Date Filter:
          <input
            type="text"
            readOnly
            value={
              dateLabel ||
              `${dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : ""} - ${dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : ""}`
            }
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
      <table>
        <thead>
          <tr>
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
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            type="button"
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ViewSalesTable;
