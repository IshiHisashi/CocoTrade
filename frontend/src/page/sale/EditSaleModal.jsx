import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import CtaBtn from "../../component/btn/CtaBtn";

const EditSaleModal = ({ showEditForm, setshowEditForm, selectedSale, setSelectedSale, setSales, URL }) => {
  const userId = useContext(UserIdContext);
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
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
    amount_of_copra_sold: "",
    sales_unit_price: "",
    status: "",
    copra_ship_date: "",
    cheque_receive_date: "",
    total_sales_price: "",
    user_id: userId,
  });

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

    // Fetch manufacturers
    axios
      .get(`${URL}/user/${userId}/manu`)
      .then((response) => {
        setManufacturers(response.data.data.manufacturers);
        console.log(response.data.data.manufacturers);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Common throughout all the sales edit patterns => Good to go
  const updateSales = async () => {
    try {
      await axios.patch(`${URL}/sale/${selectedSale._id}`, formData);
      // console.log(patchedSales.data.data);
      // 👆 This never shows proper response for some reasons.
      console.log("Sales updated");
    }
    catch(err) {
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
      prevRecievedDate: previousReceivedDate,
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

      if (prevWasPending) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, false, false, false);
        } else if (updateToOngoing || updateToCompleted) {
          objectToPassI = createObjectToPassForInv(true, false, false, false);
          if (updateToCompleted) {
            const objectToPassF = createObjectToPassForFin(true, false, false);
            console.log(objectToPassF);
          }
        }
      } else if (prevWasOngoing) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, true, false, false);
        } else if (updateToOngoing || updateToCompleted) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          if (updateToCompleted) {
            const objectToPassF = createObjectToPassForFin(true, false, false);
            console.log(objectToPassF);
          }
        }
      } else if (prevWasCompleted) {
        if (updateToPending) {
          objectToPassI = createObjectToPassForInv(false, true, false, false);
          const objectToPassF = createObjectToPassForFin(false, true, false);
          console.log(objectToPassF);
        } else if (updateToOngoing) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          const objectToPassF = createObjectToPassForFin(false, true, false);
          console.log(objectToPassF);
        } else if (updateToCompleted) {
          objectToPassI = createObjectToPassForInv(false, false, true, true);
          const objectToPassF = createObjectToPassForFin(false, false, true);
          console.log(objectToPassF);
        }
      }

      console.log(objectToPassI);
      axios.patch(`${URL}/inventory/updateForSales`, objectToPassI);

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
          required
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
            // { value: "cancelled", label: "Cancelled" },
          ]}
          required
        />
        <Field
          label="Copra Ship Date"
          name="copra_ship_date"
          type="date"
          value={formData.copra_ship_date}
          onChange={handleChange}
          required
        />
        <Field
          label="Cheque Receive Date"
          name="cheque_receive_date"
          type="date"
          value={formData.cheque_receive_date}
          onChange={handleChange}
          disabled={formData.status !== "completed"}
          required={formData.status === "completed"}
          info
          infoText="You can choose the date only when you change status to completed."
        />
        <Field
          label="Total Sales Price"
          name="total_sales_price"
          type="number"
          value={formData.total_sales_price}
          onChange={handleChange}
          disabled={formData.status !== "completed"}
          required={formData.status === "completed"}
          info
          infoText="You can type in total amount of sales only when you change status to completed."
        />
        <CtaBtn
          size="S"
          level="O"
          innerTxt="Clear"
          onClickFnc={fncCloseModal}
        />
        <CtaBtn 
          size="S" 
          level={new Date(formData.copra_ship_date) > new Date() && formData.status !== "pending" ? "D" : "P"}
          type="submit" 
          innerTxt="Save" 
          disabled = {new Date(formData.copra_ship_date) > new Date() && formData.status !== "pending"}
        />
      </form>
    </div>
  );
};

export default EditSaleModal;
