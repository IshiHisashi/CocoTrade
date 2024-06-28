import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";

const AddPurchaseForm = ({ setShowAddForm, purchase, handleUpdate }) => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    farmer_id: "",
    invoice_number: "",
    purchase_date: "",
    sales_unit_price: "",
    amount_of_copra_purchased: "",
    moisture_test_details: "",
    total_purchase_price: "",
    user_id: "66640d8158d2c8dc4cedaf1e",
  });

  const userid = "66640d8158d2c8dc4cedaf1e";

  useEffect(() => {
    // Fetch user data
    axios
      .get(`http://localhost:5555/user/${userid}`)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    // Fetch farmers
    axios
      .get("http://localhost:5555/farmer")
      .then((response) => {
        setFarmers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching farmers:", error);
      });

    // Fetch price suggestion
    axios
      .get(`http://localhost:5555/user/${userid}/pricesuggestion/getone`)
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
  }, [purchase]); // Include purchase in the dependency array

  useEffect(() => {
    if (purchase) {
      setFormData({
        ...purchase,
        farmer_id: purchase.farmer_id?._id ?? "",
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
  }, [purchase]); // Include purchase in the dependency array

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (purchase) {
        await handleUpdate(formData);
      } else {
        const response = await axios.post(
          "http://localhost:5555/purchase",
          formData
        );
        console.log("Purchase created:", response.data);
        const purchaseId = response.data._id;

        const updatedPurchasesArray = [...user.purchases_array, purchaseId];

        await axios.patch(`http://localhost:5555/user/${userid}`, {
          purchases_array: [purchaseId],
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error creating/updating purchase:", error);
    }
  };

  return (
    <div className="modal">
      <h2>{purchase ? "Edit Purchase" : "New Purchase"}</h2>
      <form onSubmit={handleSubmit}>
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
        <Field
          label="Farmer Name"
          name="farmer_id"
          type="dropdown"
          value={formData.farmer_id}
          options={farmers.map((farmer) => ({
            value: farmer._id,
            label: farmer.full_name,
          }))}
          onChange={handleChange}
          required
        />
        <Field
          label="Price per kilo (PHP)"
          name="sales_unit_price"
          type="number"
          value={formData.sales_unit_price}
          onChange={handleChange}
          required
        />
        <Field
          label="Copra bought (kg)"
          name="amount_of_copra_purchased"
          type="number"
          value={formData.amount_of_copra_purchased}
          onChange={handleChange}
          required
        />
        <Field
          label="Moisture Test Details"
          name="moisture_test_details"
          type="text"
          value={formData.moisture_test_details}
          onChange={handleChange}
          required
        />
        <Field
          label="Total Sale (PHP)"
          name="total_purchase_price"
          type="text"
          value={formData.total_purchase_price}
          onChange={handleChange}
          disabled
        />
        <button type="button" onClick={() => setShowAddForm(false)}>
          Clear
        </button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddPurchaseForm;
