import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import CtaBtn from "../../component/btn/CtaBtn";
import Exit from "../../assets/icons/Exit.svg";

const EditSaleModal = ({ showEditForm, setshowEditForm, selectedSale, setSelectedSale, setSales, URL,onFormSubmit, }) => {
  const userId = useContext(UserIdContext);
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [user, setUser] = useState(null);

  // Just for PR
  // To controll update behaivior in API
  const [previousStatus, setPreviousStatus] = useState(null); 
  const [previousAmount, setPreviousAmount] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [previousShipDate, setPreviousShipDate] = useState(null);
  const [previousReceivedDate, setPreviousReceivedDate] = useState(null);

  // To store data filled in an edit form
  const [formData, setFormData] = useState({
    manufacturer_id: "",
    manufacturer_name: "",
    amount_of_copra_sold: "",
    sales_unit_price: "",
    status: "",
    copra_ship_date: "",
    cheque_receive_date: "",
    total_sales_price: "",
    user_id: userId,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Fetch user data
    axios
      .get(`${URL}/user/${userId}`)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    // Fetch manufacturers for the current user
    axios
    .get(`${URL}/manufacturer`, { params: { user_id: userId } })
    .then((response) => {
      setManufacturers(response.data);
      setFilteredManufacturers(response.data); // Set initial filtered manufacturer
    })
    .catch((error) => {
      console.error("Error fetching manufacturers:", error);
    });
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [selectedSale]);

  useEffect(() => {
    if (selectedSale) {
      setFormData({
        ...selectedSale,
           // eslint-disable-next-line no-underscore-dangle 
          manufacturer_id: selectedSale.manufacturer_id?._id ?? '',
          amount_of_copra_sold: parseFloat(selectedSale.amount_of_copra_sold?.$numberDecimal ?? selectedSale.amount_of_copra_sold),
          sales_unit_price: parseFloat(selectedSale.sales_unit_price?.$numberDecimal ?? selectedSale.sales_unit_price),
          copra_ship_date: selectedSale.copra_ship_date ? new Date(selectedSale.copra_ship_date).toISOString().split('T')[0] : '',
          cheque_receive_date: selectedSale.cheque_receive_date ? new Date(selectedSale.cheque_receive_date).toISOString().split('T')[0] : '',
          total_sales_price: parseFloat(selectedSale.total_sales_price?.$numberDecimal ?? selectedSale.total_sales_price),
      });
    }
  }, [selectedSale]);

  // Calculate sales per unit and automatically update it in formData
  useEffect(() => {
    const calculateTotalSalesPrice = () => {
      const totalSales = parseFloat(formData.total_sales_price);
      const amountSold = parseFloat(formData.amount_of_copra_sold);
      if ((!Number.isNaN(totalSales) && !Number.isNaN(amountSold)) && totalSales !== 0 && amountSold !== 0) {
        const salesPerUnit = totalSales / amountSold;
        setFormData((prevData) => ({
          ...prevData,
          sales_unit_price: salesPerUnit.toFixed(2),
        }));
      }
    };

    calculateTotalSalesPrice();
    console.log(new Date(formData.copra_ship_date));
    console.log(new Date());
    console.log(new Date(formData.copra_ship_date) > new Date());
  }, [formData.total_sales_price, formData.amount_of_copra_sold, formData.copra_ship_date]);

  useEffect(() => {
    if(selectedSale){
      setPreviousStatus(selectedSale.status);
      console.log("Status: ", selectedSale.status);
      setPreviousAmount(selectedSale.amount_of_copra_sold.$numberDecimal);
      console.log("Amount of copra sold: ", selectedSale.amount_of_copra_sold.$numberDecimal);
      setPreviousPrice(selectedSale.total_sales_price.$numberDecimal);
      console.log("Total price: ", selectedSale.total_sales_price.$numberDecimal);
      setPreviousShipDate(selectedSale.copra_ship_date);
      console.log("Shipment date: ", selectedSale.copra_ship_date);
      setPreviousReceivedDate(selectedSale.cheque_receive_date);
      console.log("Money received date: ", selectedSale.cheque_receive_date);
    }
  }, 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [showEditForm]) 

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
    if (name === "manufacturer_name") {
      const filtered = manufacturers.filter((manufacturer) =>
        manufacturer.full_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredManufacturers(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSelectManufacturer = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      manufacturer_name: name,
    }));
    setFilteredManufacturers(manufacturers);
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

  // Common throughout all the sales edit patterns => Good to go
  const updateSales = async () => {
    try {
      const existingManufacturer = manufacturers.find(manufacturer => manufacturer.full_name === formData.manufacturer_name);
      let manufacturerId = existingManufacturer ? existingManufacturer._id : null;

      if (!manufacturerId) {
        const manufacturerResponse = await axios.post(`${URL}/manufacturer`, {
          user_id: userId,
          full_name: formData.manufacturer_name,
        });
        manufacturerId = manufacturerResponse.data.data._id;
      }

      const updatedFormData = {
        ...formData,
        manufacturer_id: manufacturerId,
      };

      const updatedSale = await axios.patch(`${URL}/sale/${selectedSale._id}`, updatedFormData);

      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === selectedSale._id ? updatedSale.data.data : sale
        )
      );

      setshowEditForm(false);
      setSelectedSale(null);
      onFormSubmit("Sale log entry has been updated."); // Call form submit handler
    } catch (err) {
      console.error("Failed to update sales: ", err);
    }
  }
  // Object to pass to inventory update api
  // argument represents below
  // add: when it's true, api subtract number from inv
  // rev: when it's true, api reverse subtraction that occured before on inv
  // mod: when it's true api modifies inv amount accoordingly
  // shipDate: when it's true, api modifies inv amount between old ship date and new shipdate
  const createObjectToPassForInv = (sub, rev, mod, ship) => {
    const object = {
      userId,
      prevShipDate: previousShipDate,
      newShipDate: formData.copra_ship_date,
      prevAmount: previousAmount,
      newAmount: formData.amount_of_copra_sold,
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
      prevReceivedDate: previousReceivedDate,
      newReceivedDate: formData.cheque_receive_date,
      prevPrice: previousPrice,
      newPrice: formData.total_sales_price,
      addFinNeeded: add,
      reverseFinNeeded: rev,
      modifFinWithDiffNeeded: mod
    }
    return object;
  }

  const prevWasPending = previousStatus === "pending";
  const prevWasOngoing = previousStatus === "ongoing";
  const prevWasCompleted = previousStatus === "completed";
  const updateToPending = formData.status === "pending";
  const updateToOngoing = formData.status === "ongoing";
  const updateToCompleted = formData.status === "completed";


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  Update selected sales document based on id in any case of updating
      await updateSales();

      let objectToPassI;
      let objectToPassF = null;

      if (prevWasPending) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, false, false, false);
        } else if (updateToOngoing || updateToCompleted) {
          objectToPassI = createObjectToPassForInv(true, false, false, false);
          if (updateToCompleted) {
            objectToPassF = createObjectToPassForFin(true, false, false);
          }
        }
      } else if (prevWasOngoing) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, true, false, false);
        } else if (updateToOngoing || updateToCompleted) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          if (updateToCompleted) {
            objectToPassF = createObjectToPassForFin(true, false, false);
          }
        }
      } else if (prevWasCompleted) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, true, false, false);
          objectToPassF = createObjectToPassForFin(false, true, false);
        } else if (updateToOngoing) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          objectToPassF = createObjectToPassForFin(false, true, false);
        } else if (updateToCompleted) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          objectToPassF = createObjectToPassForFin(false, false, true);
        }
      }

      console.log(objectToPassF);
      axios.patch(`${URL}/inventory/updateForSales`, objectToPassI);
      if (objectToPassF !== null) {
        axios.patch(`${URL}/currentbalance/updateForSales`, objectToPassF);
      }

      setshowEditForm(false);
      setSelectedSale(null);
      // setSales((prevSales) => prevSales.map((saleData) => 
      // // eslint-disable-next-line no-underscore-dangle 
      //   saleData._id === selectedSale._id ? updatedSalesData : saleData
      // ));

    } catch (error) {
      console.error("Error creating/updating purchase:", error);
    }
  };

  const fncCloseModal = () => {
    setshowEditForm(false);
  };

  return (
    <div className="modal">
      {console.log(manufacturers)}
      <h1>Edit Sale</h1>
      <small>Update sales entry information</small>
      <form onSubmit={handleSubmit}>
      <button
        type="button"
        className="absolute top-8 right-8"
        onClick={() => setshowEditForm(false)}
      >
        <img src={Exit} alt="close" />
      </button>
      <div className="grid sm:grid-cols-2 gap-x-6 pt-8">

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
            // { value: "cancelled", label: "Cancelled" },
          ]}
          required
        />
        <Field
          label="Shipment date"
          name="copra_ship_date"
          type="date"
          value={formData.copra_ship_date}
          onChange={handleChange}
          required
        />
        </div>
      <div className="relative" ref={wrapperRef}>
        <Field
          label="Manufacturer"
          name="manufacturer_name"
          type="text"
          value={formData.manufacturer_name}
          onChange={handleChange}
          onFocus={handleFocus}
            onBlur={handleBlur}
          required
        />
        {showSuggestions && filteredManufacturers.length > 0 && (
          <ul className="suggestions absolute bg-white border border-gray-300 w-full mt-1 z-10">
            {filteredManufacturers.map((manufacturer) => (
              <li key={manufacturer._id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <button
                  type="button"
                  onClick={() => handleSelectManufacturer(manufacturer.full_name)}
                >
                  {manufacturer.full_name}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">
        <Field
          label="Sales unit price"
          name="sales_unit_price"
          type="number"
          value={formData.sales_unit_price}
          onChange={handleChange}
          unit="PHP"
          adornment="start"
          adornmentEnd="per kg"
          disabled
        />      
        <Field
          label="Copra Sold"
          name="amount_of_copra_sold"
          type="number"
          value={formData.amount_of_copra_sold}
          onChange={handleChange}
          unit="kg"
          adornment="end"
          required
          min="0"
          step="0.0001"
        />               
        <Field
          label="Received on"
          name="cheque_receive_date"
          type="date"
          value={formData.cheque_receive_date}
          onChange={handleChange}
          disabled={formData.status !== "completed"}
          required={formData.status === "completed"}
           />
        <Field
          label="Total Sale"
          name="total_sales_price"
          type="number"
          value={formData.total_sales_price}
          onChange={handleChange}
          disabled={formData.status !== "completed"}
          required={formData.status === "completed"}
          unit="PHP"
          adornment="start"
          min="0"
          step="0.0001"
        />
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 pt-8">   
        <CtaBtn
          size="M"
          level="O"
          innerTxt="Clear"
          onClickFnc={fncCloseModal}
        />
        <CtaBtn 
          size="M" 
          level={new Date(formData.copra_ship_date) > new Date() && formData.status !== "pending" || formData.status === "completed" && Number(formData.total_sales_price) <= 0 ? "D" : "P"}
          type="submit"
          innerTxt="Save" 
          disabled = {new Date(formData.copra_ship_date) > new Date() && formData.status !== "pending" || formData.status === "completed" && Number(formData.total_sales_price) <= 0}
        />
        </div> 
      </form>
    </div>
  );
};

export default EditSaleModal;
