/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const ViewPurchaseTable = ({
  setShowAddForm,
  handleEdit,
  purchasesFromParent,
  URL,
}) => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const userId = useContext(UserIdContext);

  // const fetchPurchases = () => {
  //   const url = `http://localhost:5555/tmpFinRoute/${userId}/purchase`;
  //   axios
  //     .get(url)
  //     .then((response) => {
  //       setPurchases(response.data);
  //       setFilteredPurchases(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching purchases:", error);
  //     });
  // };

  useEffect(() => {
    const url = `${URL}/tmpFinRoute/${userId}/purchase`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        setPurchases(response.data);
        setFilteredPurchases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, [purchasesFromParent, userId, URL]);

  const formatDecimal = (decimal128) => {
    if (!decimal128 || !decimal128.$numberDecimal) {
      return "0.00";
    }
    return parseFloat(decimal128.$numberDecimal).toFixed(2);
  };

  const handleDeleteClick = async (purchase) => {
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
          setPurchases(response.data);
          setFilteredPurchases(response.data);
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

  const handleEditClick = (purchase) => {
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

  return (
    <div>
<div className="flex justify-end mb-4 py-5">
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
      </Modal>
      <table className="min-w-full bg-white border-collapse"> 
               <thead>
          <tr className="bg-black text-white text-left">
            <th>Invoice No.</th>
            <th>Date</th>
            <th>Farmers Name</th>
            <th>Copra Bought</th>
            <th>Moisture</th>
            <th>Price Per kg</th>
            <th>Total Purchase</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((purchase) => (
            // eslint-disable-next-line no-underscore-dangle
            <tr key={purchase._id}>
              <td>{purchase.invoice_number}</td>
              <td>{new Date(purchase.purchase_date).toISOString().split("T")[0]}</td>
              <td>
                {purchase.farmer_id ? purchase.farmer_id.full_name : "N/A"}
              </td>
              <td>{`${formatDecimal(purchase.amount_of_copra_purchased)} kg`}</td>
              <td>{`${formatDecimal(purchase.moisture_test_details)}%`}</td>
              <td>{`PHP ${formatDecimal(purchase.sales_unit_price)}`}</td>
              <td>{`PHP ${formatDecimal(purchase.total_purchase_price)}`}</td>
              <td>
                <div className="dropdown">
                  <button
                    type="button"
                    className="dropbtn"
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() =>
                      setDropdownVisible(
                        dropdownVisible === purchase._id ? null : purchase._id
                      )
                    }
                  >
                    ...
                  </button>
                  {dropdownVisible === purchase._id && (
                    <div className="dropdown-content">
                      <button
                        type="button"
                        onClick={() => handleEditClick(purchase)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          // eslint-disable-next-line no-underscore-dangle
                          handleDeleteClick(purchase)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
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

export default ViewPurchaseTable;
