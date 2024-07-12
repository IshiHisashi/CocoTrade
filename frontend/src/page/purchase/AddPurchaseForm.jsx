import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";
import CtaBtn from "../../component/btn/CtaBtn";
import Exit from "../../assets/icons/Exit.svg";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const AddPurchaseForm = ({
  setShowAddForm,
  purchase,
  handleUpdate,
  setPurchasesFromParent,
  URL,
  onFormSubmit,
}) => {
  const userid = useContext(UserIdContext);
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    farmer_name: "",
    invoice_number: "",
    purchase_date: "",
    sales_unit_price: "",
    amount_of_copra_purchased: "",
    moisture_test_details: "",
    total_purchase_price: "",
    user_id: userid,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Fetch user data
    axios
      .get(`${URL}/user/${userid}`)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

      // Fetch farmers for the current user
    axios
    .get(`${URL}/farmer`, { params: { user_id: userid } })
    .then((response) => {
      setFarmers(response.data);
      setFilteredFarmers(response.data); // Set initial filtered farmers
    })
    .catch((error) => {
      console.error("Error fetching farmers:", error);
    });
    
    // Fetch price suggestion
    axios
      .get(`${URL}/user/${userid}/pricesuggestion/getone`)
      .then((response) => {
        if (response.data.status === "success") {
          setFormData((prevData) => ({
            ...prevData,
            sales_unit_price: parseFloat(
              response.data.data?.$numberDecimal ?? response.data.data
            ),
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching price suggestion:", error);
      });

    // Generate invoice number
    if (!purchase) {
      const generateInvoiceNumber = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "IN";
        for (let i = 0; i < 8; i += 1) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };

      setFormData((prevData) => ({
        ...prevData,
        invoice_number: generateInvoiceNumber(),
      }));
    }
  }, [purchase, userid, URL]); // Include purchase in the dependency array

  useEffect(() => {
    if (purchase) {
      setFormData({
        ...purchase,
        // eslint-disable-next-line no-underscore-dangle
        farmer_name: purchase.farmer_id ? purchase.farmer_id.full_name : "",
        sales_unit_price: parseFloat(
          purchase.sales_unit_price?.$numberDecimal ?? purchase.sales_unit_price
        ),
        amount_of_copra_purchased: parseFloat(
          purchase.amount_of_copra_purchased?.$numberDecimal ??
            purchase.amount_of_copra_purchased
        ),
        moisture_test_details: parseFloat(
          purchase.moisture_test_details?.$numberDecimal ??
            purchase.moisture_test_details
        ),
        total_purchase_price: parseFloat(
          purchase.total_purchase_price?.$numberDecimal ??
            purchase.total_purchase_price
        ),
        purchase_date: purchase.purchase_date
          ? new Date(purchase.purchase_date).toISOString().split("T")[0]
          : "",
        user_id: userid,
      });
    }
  }, [purchase, userid]); // Include purchase in the dependency array

  useEffect(() => {
    const calculateTotalPurchasePrice = () => {
      const unitPrice = parseFloat(formData.sales_unit_price);
      const amountPurchased = parseFloat(formData.amount_of_copra_purchased);
      const moistureLevel = parseFloat(formData.moisture_test_details);
      let total = unitPrice * amountPurchased;

      if (moistureLevel > 7) {
        total *= 0.85;
      }

      if (!Number.isNaN(total)) {
        setFormData((prevData) => ({
          ...prevData,
          total_purchase_price: total.toFixed(2),
        }));
      }
    };

    calculateTotalPurchasePrice();
  }, [
    formData.sales_unit_price,
    formData.amount_of_copra_purchased,
    formData.moisture_test_details,
  ]);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  }; 

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "farmer_name") {
      const filtered = farmers.filter((farmer) =>
        farmer.full_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFarmers(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSelectFarmer = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      farmer_name: name,
    }));
    setFilteredFarmers(farmers);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding the suggestions to allow selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // -----UPDATE PURCHASE LOG-----
      // Update purchase document
      let farmerId = "";

      if (formData.farmer_name) {
        const existingFarmer = farmers.find(
          (farmer) => farmer.full_name === formData.farmer_name
        );

        if (existingFarmer) {
          farmerId = existingFarmer._id;
        } else {
          const farmerResponse = await axios.post(`${URL}/farmer`, {
            user_id: userid,
            full_name: formData.farmer_name,
          });
          farmerId = farmerResponse.data.data._id;
        }
      }

      const updatedFormData = {
        ...formData,
        farmer_id: farmerId,
      };

      if (purchase) {
        await handleUpdate(updatedFormData, purchase, userid);
      } else {
        // -----NEW PURCHASE LOG-----
        // 1). Create purchase document
        const newPurchaseDoc = await axios.post(`${URL}/purchase`, updatedFormData);
        // eslint-disable-next-line no-underscore-dangle
        const purchaseId = newPurchaseDoc.data._id;

        // 2). Create cash_balance:
        const newCashDoc = await axios.post(
          `${URL}/tmpFinRoute/${userid}/currentbalance`,
          {
            user_id: userid,
            changeValue: formData.total_purchase_price,
            date: formData.purchase_date,
            type: "purchase",
          }
        );
        // eslint-disable-next-line no-underscore-dangle
        const newCashBalanceId = newCashDoc?.data?.data?.newCurrentBalance._id;

        // 3). Create inventory
        const newInventoryDoc = await axios.post(
          `${URL}/tmpFinRoute/${userid}/inventory`,
          {
            user_id: userid,
            changeValue: formData.amount_of_copra_purchased,
            date: formData.purchase_date,
            type: "purchase",
          }
        );
        // eslint-disable-next-line no-underscore-dangle
        const newInventoryId = newInventoryDoc?.data?.data?.newInventory._id;

        // 4). Send ids to the corresponding user documents
        const updateData = {
          purchases_array: { action: "push", value: purchaseId },
        };
        // add an arrays if there's any new document created under CashBalance, Inventory collection
        if (newCashBalanceId) {
          updateData.balance_array = {
            action: "push",
            value: newCashBalanceId,
          };
        }
        if (newInventoryId) {
          updateData.inventory_amount_array = {
            action: "push",
            value: newInventoryId,
          };
        }
        await axios.patch(`${URL}/user/${userid}`, updateData);
        setPurchasesFromParent(newPurchaseDoc.data);

        setShowAddForm(false);
        onFormSubmit(`Invoice #${formData.invoice_number} has been logged successfully.`);
      }
      } catch (error) {
      console.error("Error creating/updating purchase:", error);
    }
  };

  return (
    <div className="modal">
<h1>{purchase ? "Edit Purchase" : "New Purchase"}</h1>
<small>Add a new puchase for today</small>
      <form onSubmit={handleSubmit}>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setShowAddForm(false)}
      >
        <img src={Exit} alt="close" />
      </button>
      <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
        <Field
          label="Invoice No"
          name="invoice_number"
          value={formData.invoice_number}
          onChange={handleChange}
          type="text"
          disabled
        />
        <Field
          label="Date Purchased"
          name="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={handleChange}
          required
        />
        </div>
        <div className="relative" ref={wrapperRef}>
        <Field
          label="Farmer Name"
          name="farmer_name"
          type="text"
          value={formData.farmer_name}
          onChange={handleChange}
          onFocus={handleFocus}
            onBlur={handleBlur}
          required
        />
        {showSuggestions && filteredFarmers.length > 0 && (
          <ul className="suggestions absolute bg-white border border-gray-300 w-full mt-1 z-10">
            {filteredFarmers.map((farmer) => (
              <li key={farmer._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <button
                  type="button"
                  onClick={() => handleSelectFarmer(farmer.full_name)}
                >
                  {farmer.full_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
        <Field
          label="Price per kilo (PHP)"
          name="sales_unit_price"
          type="number"
          value={formData.sales_unit_price}
          onChange={handleChange}
          required
          unit="PHP"
          adornment="start"
        />
        <Field
          label="Copra bought (kg)"
          name="amount_of_copra_purchased"
          type="number"
          value={formData.amount_of_copra_purchased}
          onChange={handleChange}
          required
          unit="kg"
          adornment="end"
        />
        <Field
          label="Moisture Test Details"
          name="moisture_test_details"
          type="number"
          value={formData.moisture_test_details}
          onChange={handleChange}
          required
          unit="%"
          adornment="end"
          min="0"
          max="100"
        />
        <Field
          label="Total Sale (PHP)"
          name="total_purchase_price"
          type="number"
          value={formData.total_purchase_price}
          onChange={handleChange}
          disabled
          unit="PHP"
          adornment="start"
        />
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">   
 <CtaBtn
        size="M"
        level="O"
        innerTxt="Clear"
        onClickFnc={() => {
          setShowAddForm(false);
          window.location.reload();
        }}
      />
        <CtaBtn
        size="M"
        level="P"
        innerTxt="Save"
        type="submit"
      />
      </div> 
      </form>
    </div>
  );
};

export default AddPurchaseForm;
