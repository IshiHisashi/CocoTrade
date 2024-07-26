import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import CtaBtn from "../../component/btn/CtaBtn";
import Field from "../../component/field-filter/Field";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import Exit from "../../assets/icons/Exit.svg";

const PlanShipment = ({ userId, setShowModal, refreshNotifications, URL,onFormSubmit }) => {
  const [manufacturers, setManufacturers] = useState([]);
  const userid = useContext(UserIdContext);
  const [user, setUser] = useState(null);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [latestInv, setLatestInv] = useState([]);
  const [isIrrationalCalculation, setIsIrrationalCalculation] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer_name: "",
    amount_of_copra_sold: "",
    sales_unit_price: 0,
    status: "pending",
    copra_ship_date: "",
    cheque_receive_date: "",
    total_sales_price: 0,
    user_id: userId,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(
    () => {
      // Fetch user data
      axios
        .get(`${URL}/user/${userId}`)
        .then((response) => {
          console.log(response.data.data);
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });

         // Fetch manufacturers for the current user
    axios
    .get(`${URL}/manufacturer`, { params: { user_id: userid } })
    .then((response) => {
      setManufacturers(response.data);
      setFilteredManufacturers(response.data); // Set initial filtered manufacturer
    })
    .catch((error) => {
      console.error("Error fetching manufacturers:", error);
    });

      // Fetch the latest inventory data to make a new inventory log or to modify the log
      axios
        .get(`${URL}/user/${userId}/inv`)
        .then((res) => {
          // setMaximumInv(res.data.data.max_amount);
          const invArray = res.data.data;
          const invObj = invArray.reduce((latest, current) => {
            return new Date(current.time_stamp) > new Date(latest.time_stamp)
              ? current
              : latest;
          });
          setLatestInv(invObj);
          console.log(invObj);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId]
  );

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

  // function to handle changes in a form
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

  // function to handle submit
  // How this submit works in terms of log creation/modification
  // 1. It creates a new sales log.
  // 2. Add a new id of the new sales log into sales_array in a user doc.
  // 3. Check if there is already an invetory document for today.
  // 4. If there is not an inv doc for today, create a new inventory doc with the sales id in sales_array. And after that, push this inv doc id to "inventory_amount_array" in user doc.
  // 5. If there is an inv doc for today, add a new id of the new sales log into sales_array in the latest inventory doc
  // 6. And after that reduce the number of copra from the latest inventory when there is already an existing data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let manufacturerId = "";

      if (formData.manufacturer_name) {
        const existingManufacturer = manufacturers.find(
          (manufacturer) => manufacturer.full_name === formData.manufacturer_name
        );

        if (existingManufacturer) {
          manufacturerId = existingManufacturer._id;
        } else {
          const manufacturerResponse = await axios.post(`${URL}/manufacturer`, {
            user_id: userid,
            full_name: formData.manufacturer_name,
          });
          manufacturerId = manufacturerResponse.data.data._id;
        }
      }

      const updatedFormData = {
        ...formData,
        manufacturer_id: manufacturerId,
      };
      // Create a new sales log with pending status
      const response = await axios.post(`${URL}/sale`, updatedFormData);
      console.log("Shipment/sale created:", response.data);

      // Add a new id of the sales log into sales_array in the user document.
      // eslint-disable-next-line no-underscore-dangle
      const saleId = response.data._id;
      const patchedSalesArray = await axios.patch(`${URL}/user/${userId}`, {
        sales_array: { action: "push", value: saleId },
      });
      console.log("Sales data in user's doc updated: ", patchedSalesArray.data);

      // Add a new id of the sales log into sales_array in the inventory document.
      const today = new Date();
      const todayISO = today.toISOString();
      const invDate = new Date(latestInv.time_stamp);
      console.log(latestInv.current_amount_left);
      console.log(response.data.amount_of_copra_sold);
      const newCurrentAmntLft =
        latestInv.current_amount_left.$numberDecimal -
        response.data.amount_of_copra_sold.$numberDecimal;
      // IF THERE IS NO INVENTORY LOG FOR TODAY, CREATE A NEW ONE
      if (
        !(
          today.getFullYear() === invDate.getFullYear() &&
          today.getMonth() === invDate.getMonth() &&
          today.getDate() === invDate.getDate()
        )
      ) {
        const newInvData = {
          user_id: userId,
          purchase_array: [],
          sales_array: [saleId],
          time_stamp: todayISO,
          current_amount_left: newCurrentAmntLft,
          current_amount_with_pending: latestInv.current_amount_with_pending,
        };
        // (FROM AKI TO ISHI) it's ok to use just post without userId as each inventory doc has userId in it and the id of the inventory is gonna be added to user doc in the http request below.
        const createdInv = await axios.post(
          `${URL}/inventory/simple`,
          newInvData
        );
        console.log("New inv doc created: ", createdInv.data);

        // Add this new inv doc to "inventory_amount_array" in user's doc
        // eslint-disable-next-line no-underscore-dangle
        const invId = createdInv.data.data._id;
        const patchedInvArray = await axios.patch(`${URL}/user/${userId}`, {
          inventory_amount_array: { action: "push", value: invId },
        });
        console.log("Inv data in user's doc updated: ", patchedInvArray.data);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const currentInvId = latestInv._id;
        const updatedSalesArray = [...latestInv.sales_array, saleId];
        const patchedInvDoc = await axios.patch(
          `${URL}/inventory/${currentInvId}`,
          { 
            sales_array: updatedSalesArray,
            current_amount_left: newCurrentAmntLft,
          }
        );
        console.log(
          "Sales data in sales_array in inv doc updated: ",
          patchedInvDoc.data
        );
      }
      // Create notification
      const formattedDate = format(
        new Date(updatedFormData.copra_ship_date),
        "MMMM do, yyyy"
      );
      const notificationData1 = {
        user_id: userId,
        title: "Prepare your trucks!",
        message: `You have an upcoming shipment on ${formattedDate}!`,
      };
      const notificationResponse1 = await axios.post(
        `${URL}/notification`,
        notificationData1
      );
      console.log("Notification created:", notificationResponse1.data);

      // Create notification to generate when current amount left become 50% ox maxcapacity
      if (newCurrentAmntLft >= user.max_inventory_amount / 2) {
        const notificationData2 = {
          user_id: userId,
          title: "Your inventory is 50% full!",
          message: `It's time to plan your shipment!`,
        };
        const notificationResponse2 = await axios.post(
          `${URL}/notification`,
          notificationData2
        );
        console.log("Notification created:", notificationResponse2.data);
      }
      // Refresh unread notifications count
      if (refreshNotifications) {
        refreshNotifications();
      }
      onFormSubmit(`Shipment was successfully scheduled on ${formattedDate}.`);
    } catch (error) {
      console.error("Error creating/updating sale or notification:", error);
    }
  };

  const fncCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (
      formData.amount_of_copra_sold &&
      latestInv &&
      latestInv.current_amount_left &&
      latestInv.current_amount_left.$numberDecimal
    ) {
      if(Number(formData.amount_of_copra_sold) > Number(latestInv.current_amount_left.$numberDecimal)) {
        setIsIrrationalCalculation(true);
      } else {
        setIsIrrationalCalculation(false);
      }
    }
  }, [formData, latestInv])

  return (
    <div className="p-[32px]">
      <h3 className="h3-sans mb-[25px]">Plan your shipment</h3>
      <form onSubmit={handleSubmit}>
        <button
          type="button"
          className="absolute top-[40px] right-[32px]"
          onClick={() => setShowModal(false)}
        >
          <img src={Exit} alt="close" />
        </button>
        <div ref={wrapperRef}>
          <Field
            label="Company"
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
        <div>
          <Field
            label="Shipment date"
            name="copra_ship_date"
            type="date"
            value={formData.copra_ship_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
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
        </div>
        <p className={isIrrationalCalculation || formData.amount_of_copra_sold < 0 ? "text-red-600 mb-[14px]" : "text-red-600" }>
          {isIrrationalCalculation ? "The amount of copra shipping exceedsthe amount in your warehouse. If you want to modify the amount manually, please go to a settings page." : ""}
          {formData.amount_of_copra_sold < 0 ? "The amount of copra shipping has to be a positive number" : ""}
        </p>
        <div className="flex flex-nowrap gap-[12px]">
          <CtaBtn
            size="M"
            level="O"
            innerTxt="Cancel"
            onClickFnc={fncCloseModal}
          />
          <CtaBtn 
            size="M" 
            level={ isIrrationalCalculation || formData.amount_of_copra_sold <= 0 ? "D" : "P" } 
            type="submit" 
            innerTxt="Save" 
            disabled={isIrrationalCalculation || formData.amount_of_copra_sold <= 0}
          />
        </div>
      </form>
    </div>
  );
};

export default PlanShipment;
