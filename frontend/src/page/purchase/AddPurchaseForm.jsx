import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from 'moment-timezone';
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
  const  [isSubmitting, setIsSubmitting] =useState(false);
  const getCurrentDateForVancouver = () => {
    return moment().tz("America/Vancouver").format('YYYY-MM-DD'); // Formats the date as "YYYY-MM-DD"
  };
  
  const [formData, setFormData] = useState({
    farmer_name: "",
    invoice_number: "",
    purchase_date: getCurrentDateForVancouver(), // Set default to today's date in Vancouver
    sales_unit_price: "",
    amount_of_copra_purchased: "",
    moisture_test_details: "",
    total_purchase_price: "",
    user_id: userid,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const [showDeductionMessage, setShowDeductionMessage] = useState(false);
  
  const formatDateForVancouver = (dateString) => {
    // Check if dateString is truthy; if not, return an empty string
    if (!dateString) return "";
    // Convert the dateString to the specific Vancouver time zone and format it
    return moment(dateString).tz("America/Vancouver").format('YYYY-MM-DD');
  };
  
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
          ?  new Date(purchase.purchase_date).toISOString('en-CA').split("T")[0]
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
        setShowDeductionMessage(true);
      } else {
        setShowDeductionMessage(false);
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
    setIsSubmitting(true);
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
        purchase_date: new Date(formData.purchase_date).toISOString(),
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
      console.error("Error creating/updating purchase:", error)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal">

      <form onSubmit={handleSubmit}>
        
      <button
        type="button"
        className="absolute top-7 right-5"
        onClick={() => setShowAddForm(false)}
      >
        <img src={Exit} alt="close" />
      </button>
      <h1 className="text-neutral-600 font-dm-sans font-bold text-[24px]">{purchase ? "Edit Purchase" : "New Purchase"}</h1>
<small className="text-[#8E9299] font-dm-sans">Add a new puchase for today</small>
      <div className="grid grid-cols-2 gap-x-6 pt-3">
        <Field
        className="w-[183px] text-neutral-400"
          label="Invoice no."
          name="invoice_number"
          value={formData.invoice_number}
          onChange={handleChange}
          type="text"
          disabled
        />
        <Field
          className="w-[183px]"
          label="Date purchased"
          name="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={handleChange}
          required
          />
        </div>
        <div className="relative" ref={wrapperRef}>
        <Field
          className="w-[380px]"
          label="Farmer's Name"
          name="farmer_name"
          type="text"
          value={formData.farmer_name}
          onChange={handleChange}
          onFocus={handleFocus}
            onBlur={handleBlur}
          required
        />
        {showSuggestions && filteredFarmers.length > 0 && (
          <ul className="suggestions absolute bg-white border border-gray-300 w-full mt-[-23px] z-10">
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
        <div className="grid grid-cols-2 gap-x-6">
        <Field
          className="w-[183px]"
          label="Price per kg"
          name="sales_unit_price"
          type="number"
          value={formData.sales_unit_price}
          onChange={handleChange}
          required
          unit="Php"
          adornment="start"
          min="0"
          step="0.0001"
          disabled
        />
        <Field
          className="w-[183px]"
          label="Copra bought"
          name="amount_of_copra_purchased"
          type="number"
          value={formData.amount_of_copra_purchased}
          onChange={handleChange}
          required
          unit="kg"
          adornment="end"
          min="0"
          step="0.0001"
        />
        <div className="relative pb-2">
        <Field
          className="w-[183px]"
          label="Moisture level"
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
         {showDeductionMessage && (
    <div className="col-span-2 absolute text-red-500 text-xs text-right top-20 pt-3 right-0">
            15% sale deduction applied
          </div>
        )}
        </div>
        <Field
          className="w-[183px]"
          label="Total Sale"
          name="total_purchase_price"
          type="number"
          value={formData.total_purchase_price}
          onChange={handleChange}
          disabled
          unit="Php"
          adornment="start"
        />
        
        </div>
       
        <div className="grid grid-cols-2 gap-x-6 mt-3">   
 <CtaBtn
        size="L"
        level="O"
        innerTxt="Clear"
        onClickFnc={() => {
          setShowAddForm(false);
          window.location.reload();
        }}
      />
        <CtaBtn
        size="L"
        level="P"
        innerTxt="Save"
        type="submit"
        disabled={isSubmitting}
      />
      </div> 
      </form>
    </div>
  );
};

export default AddPurchaseForm;
