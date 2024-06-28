import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";

const EditSaleModal = ({ setShowAddForm, sale, handleUpdate }) => {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    manufacturer_id: "",
    amount_of_copra_sold: "",
    sales_unit_price: "",
    status: "",
    copra_ship_date: "",
    cheque_receive_date: "",
    total_sales_price: "",
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

    // Fetch manufacturers
    axios
      .get("http://localhost:5555/manufacturer")
      .then((response) => {
        setManufacturers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching manufacturers:", error);
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
  }, [sale]); // Include purchase in the dependency array

  useEffect(() => {
    if (sale) {
      setFormData({
        ...sale,
        // eslint-disable-next-line no-underscore-dangle
        manufacturer_id: sale.manufacturer_id?._id ?? "",
        amount_of_copra_sold: parseFloat(
          sale.amount_of_copra_sold?.$numberDecimal ?? sale.amount_of_copra_sold
        ),
        sales_unit_price: parseFloat(
          sale.sales_unit_price?.$numberDecimal ?? sale.sales_unit_price
        ),
        copra_ship_date: sale.copra_ship_date
          ? new Date(sale.copra_ship_date).toISOString().split("T")[0]
          : "",
        cheque_receive_date: sale.cheque_receive_date
          ? new Date(sale.cheque_receive_date).toISOString().split("T")[0]
          : "",
        total_sales_price: parseFloat(
          sale.total_sales_price?.$numberDecimal ?? sale.total_sales_price
        ),
      });
    }
  }, [sale]); // Depend on saleId and isOpen to re-run this effect

  // Calculate total sales price
  useEffect(() => {
    const calculateTotalSalesPrice = () => {
      const unitPrice = parseFloat(formData.sales_unit_price);
      const amountSold = parseFloat(formData.amount_of_copra_sold);
      if (!Number.isNaN(unitPrice) && !Number.isNaN(amountSold)) {
        const total = unitPrice * amountSold;
        setFormData((prevData) => ({
          ...prevData,
          total_sales_price: total.toFixed(2),
        }));
      }
    };

    calculateTotalSalesPrice();
  }, [formData.sales_unit_price, formData.amount_of_copra_sold]);

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
      if (sale) {
        await handleUpdate(formData);
      } else {
        const response = await axios.post(
          "http://localhost:5555/sale",
          formData
        );
        console.log("Sale created:", response.data);
        // eslint-disable-next-line no-underscore-dangle
        const saleId = response.data._id;

        // const updatedSalesArray = [...user.sales_array, saleId];

        await axios.patch(`http://localhost:5555/user/${userid}`, {
          sales_array: { action: "push", value: saleId },
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error creating/updating purchase:", error);
    }
  };
  return (
    <div className="modal">
      <h2>Edit Sale</h2>
      <form onSubmit={handleSubmit}>
        <Field
          label="Manufacturer Name"
          name="manufacturer_id"
          value={formData.manufacturer_id}
          onChange={handleChange}
          type="dropdown"
          options={manufacturers.map((manufacturer) => ({
            // eslint-disable-next-line no-underscore-dangle
            value: manufacturer._id,
            label: manufacturer.full_name,
          }))}
          required
        />
        <Field
          label="Amount of Copra Sold"
          name="amount_of_copra_sold"
          type="number"
          value={formData.amount_of_copra_sold}
          onChange={handleChange}
        />
        <Field
          label="Sales Unit Price"
          name="sales_unit_price"
          type="number"
          value={formData.sales_unit_price}
          onChange={handleChange}
          disabled
        />
        <Field
          label="Status"
          name="status"
          type="dropdown"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "pending", label: "Pending" },
            { value: "ongoing", label: "Ongoing" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
        <Field
          label="Copra Ship Date"
          name="copra_ship_date"
          type="date"
          value={formData.copra_ship_date}
          onChange={handleChange}
        />
        <Field
          label="Cheque Receive Date"
          name="cheque_receive_date"
          type="date"
          value={formData.cheque_receive_date}
          onChange={handleChange}
        />
        <Field
          label="Total Sales Price"
          name="total_sales_price"
          type="number"
          value={formData.total_sales_price}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => {
            setShowAddForm(false);
            window.location.reload();
          }}
        >
          Clear
        </button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditSaleModal;
