import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Field from "../../component/field-filter/Field";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";

const EditSaleModal = ({ showEditForm, setshowEditForm, selectedSale, setSelectedSale, setSales, URL }) => {
  const userId = useContext(UserIdContext);
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState([]);
  const [user, setUser] = useState(null);
  const [latestInv, setLatestInv] = useState([]);
  const [latestFin, setLatestFin] = useState([]);

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

    // Fetch the latest inventory doc
    axios.get(`${URL}/user/${userId}/latestInv`)
      .then(response => {
        setLatestInv(response.data.latestInv[0]);
        // console.log(response.data.latestInv[0]);
      })
      .catch((error) => {
        console.error("Error fetching latest inventory:", error);
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
  }, [formData.total_sales_price, formData.amount_of_copra_sold]);

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
      // await axios.patch(`http://localhost:5555/sale/${selectedSale._id}`, formData);
      // // console.log(patchedSales.data.data);
      // // 👆 This never shows proper response for some reasons.
      console.log("Sales updated");
    }
    catch(err) {
      console.error("Failed to update sales: ", err);
    }
  }

  const createNewInventory = async (shipDate) => {
    // Here is gonna be http request to make a new inv doc on the shipDate if there is no inv doc on the date. But if there is, the request does nothing and returns just "Did nothing. To specify the date, I have to pass shipDate"
    console.log("Created a new inventory doc for the date: ", shipDate);
  }

  const createNewFinance = async (receivedDate) => {
    // Here is gonna be http request to make a new fin doc on the ReceivedDate if there is no fin doc on the date. But if there is, the request does nothing and returns just "Did nothing. To specify the date, I have to pass ReceivedDate"
    console.log("Created a new finance doc for the date: ", receivedDate);
  }

  // 1. update inventory. All the manipulations are done in the backend API
  const updateInventory = async () => {
    try {
      // Pass prevShipDate, newShipDate, preAmount, newAmount, subtractInvNeeded, reverseInvNeeded, and modifInvWithDiffNeeded as a json object in req.body
      // if copra_amount changed, and if shipDate changed, they are examined in the api
      // Update inventorie docs in one single http request based on the req.body

      // const newInvAmountLeft = Number(latestInv.current_amount_left.$numberDecimal) - difference;
      // // eslint-disable-next-line no-underscore-dangle
      // const currentInvId = latestInv._id;
      // await axios.patch(
      //   `http://localhost:5555/inventory/${currentInvId}`,
      //   {
      //     $set: {
      //       current_amount_left: {
      //         $numberDecimal: newInvAmountLeft.toString(),
      //       }
      //     }
      //   }
      // );
      console.log("Inventory update");
    }
    catch(err) {
      console.error("Failed to update", err);
    }
  }

  const updateFinance = async () => {
    try {
      // Pass prevReceivedDate, newReceivedDate, prePrice, newPrice, addFinNeeded, reverseFinNeeded, and modifyFinWithDiffNeeded as a json object in req.body
      // Update finance docs in one single http request based on the req.body

      console.log("Finance updated");
    }
    catch(err) {
      console.error("Failed to update", err);
    }
  }

  const createObjectToPassForInv = (sub, rev, mod) => {
    const object = {
      prevShipDate: previousShipDate,
      newShipDate: formData.copra_ship_date,
      preAmount: previousAmount,
      newAmount: formData.amount_of_copra_sold,
      subtractInvNeeded: sub,
      reverseInvNeeded: rev,
      modifInvWithDiffNeeded: mod
    }
    return object;
  }

  const createObjectToPassForFin = (add, rev, mod) => {
    // Pass prevReceivedDate, newReceivedDate, prePrice, newPrice, addFinNeeded, reverseFinNeeded, and modifyFinWithDiffNeeded as a json object in req.body
    const object = {
      prevRecievedDate: previousReceivedDate,
      newReceivedDate: formData.cheque_receive_date,
      prePrice: previousPrice,
      newPrice: formData.total_sales_price,
      addFinNeeded: add,
      reverseFinNeeded: rev,
      modifFinWithDiffNeeded: mod
    }
    return object;
  }

  const updateInvWithPending = async () => {
    // // Calculate the updated number of copra in a warehouse after shipment is done
    // const afterSubtractingPending = Number(latestInv.current_amount_with_pending.$numberDecimal) - formData.amount_of_copra_sold;
    // // eslint-disable-next-line no-underscore-dangle
    // const currentInvId = latestInv._id;
    // await axios.patch(
    //   `http://localhost:5555/inventory/${currentInvId}`,
    //   {
    //     $set: {
    //       current_amount_with_pending: {
    //         $numberDecimal: afterSubtractingPending.toString(),
    //       }
    //     }
    //   }
    // );
    console.log("Now copra is shipped and inv_amount_with_pending is updated");
  }  

  const reverseInvWithPending = async () => {
    // const reversedInventory = Number(latestInv.current_amount_with_pending.$numberDecimal) + Number(previousAmount);
    // // eslint-disable-next-line no-underscore-dangle
    // const currentInvId = latestInv._id;
    // await axios.patch(
    //   `http://localhost:5555/inventory/${currentInvId}`,
    //   {
    //     $set: {
    //       current_amount_with_pending: {
    //         $numberDecimal: reversedInventory.toString(),
    //       }
    //     }
    //   }
    // );
  }

  const modifyInvWithPendingWithDiff = async () => {
    try {
    //   const difference = formData.amount_of_copra_sold - Number(previousAmount);
    //   const newInvAmountWithPending = Number(latestInv.current_amount_with_pending.$numberDecimal) - difference;
    //   // eslint-disable-next-line no-underscore-dangle
    //   const currentInvId = latestInv._id;
    //   await axios.patch(
    //     `http://localhost:5555/inventory/${currentInvId}`,
    //     {
    //       $set: {
    //         current_amount_with_pending: {
    //           $numberDecimal: newInvAmountWithPending.toString(),
    //         }
    //       }
    //     }
    //   );
      console.log("Inventory amount with pending is updated with the difference between prevAmount and new data amount of copra sold");
    }
    catch(err) {
      console.error("Failed to update inventory data based on the difference between prevAmount and new data amount of copra sold: ", err);
    }
  }

  const prevWasPending = previousStatus === "pending";
  const prevWasOngoing = previousStatus === "ongoing";
  const prevWasCompleted = previousStatus === "completed";
  const updateToPending = formData.status === "pending";
  const updateToOngoing = formData.status === "ongoing";
  const updateToCompleted = formData.status === "completed";
  const copraAmountSoldIsUpdated = previousAmount !== formData.amount_of_copra_sold.toString();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  Update selected sales document based on id in any case of updating
      await updateSales();

      if (prevWasPending) {
        if (updateToPending) {
          const objectToPassI = createObjectToPassForInv(false, false, false);
          console.log(objectToPassI);
          // axios.patch(`http://localhost:5555/inventory/updateForSales`, objectToPassI);
        } else if (updateToOngoing || updateToCompleted) {
          const objectToPassI = createObjectToPassForInv(true, false, false);
          console.log(objectToPassI);
          if (updateToCompleted) {
            const objectToPassF = createObjectToPassForFin(true, false, false);
            console.log(objectToPassF);
          }
        }
      } else if (prevWasOngoing) {
        if (updateToPending) {
          const objectToPassI = createObjectToPassForInv(false, true, false);
          console.log(objectToPassI);
        } else if (updateToOngoing) {
          const objectToPassI = createObjectToPassForInv(false, false, true);
          console.log(objectToPassI);
          if (updateToCompleted) {
            const objectToPassF = createObjectToPassForFin(true, false, false);
            console.log(objectToPassF);
          }
        }
      } else if (prevWasCompleted) {
        if (updateToPending) {
          const objectToPassI = createObjectToPassForInv(false, true, false);
          console.log(objectToPassI);
          const objectToPassF = createObjectToPassForFin(false, true, false);
          console.log(objectToPassF);
        } else if (updateToOngoing) {
          const objectToPassI = createObjectToPassForInv(false, false, true);
          console.log(objectToPassI);
          const objectToPassF = createObjectToPassForFin(false, true, false);
          console.log(objectToPassF);
        } else if (updateToCompleted) {
          const objectToPassI = createObjectToPassForInv(false, false, true);
          console.log(objectToPassI);
          const objectToPassF = createObjectToPassForFin(false, false, true);
          console.log(objectToPassF);
        }
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
            setshowEditForm(false);
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
