import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import CtaBtn from "../../component/btn/CtaBtn";

const PlanShipment = ({ userId, setShowModal, refreshNotifications, URL }) => {
  const [manufacturers, setManufacturers] = useState([]);
  const [user, setUser] = useState(null);
  const [latestInv, setLatestInv] = useState([]);
  const [formData, setFormData] = useState({
    manufacturer_id: "",
    amount_of_copra_sold: "",
    sales_unit_price: 0,
    status: "pending",
    copra_ship_date: "",
    cheque_receive_date: "",
    total_sales_price: 0,
    user_id: userId,
  });

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

      // Fetch manufacturers
      axios
        .get(`${URL}/user/${userId}/manu`)
        .then((response) => {
          console.log(response.data.data.manufacturers);
          setManufacturers(response.data.data.manufacturers);
          // Will delete afterwards-----;
          setManufacturers([
            { _id: "665f847c5ae48bfeb7c41b56", full_name: "PlamOil.co" },
            { _id: "665f848f5ae48bfeb7c41b58", full_name: "Coconut Langara" },
          ]);
          // ---------------------------;
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

  // function to handle changes in a form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // function to handle submit
  // How this submit works in terms of log creation/modification
  // 1. It creates a new sales log.
  // 2. Add a new id of the new sales log into sales_array in a user doc.
  // 3. Check if there is already an invetory document for today.
  // 4. If there is not an inv doc for today, create a new inventory doc with the sales id in sales_array. And after that, push this inv doc id to "inventory_amount_array" in user doc.
  // 5. If there is an inv doc for today, add a new id of the new sales log into sales_array in the latest inventory doc
  // 6. ⭕️⭕️⭕️⭕️ And after that reduce the number of copra from the latest inventory when there is already an existing data ⭕️⭕️⭕️⭕️
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new sales log with pending status
      const response = await axios.post(`${URL}/sale`, formData);
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
        new Date(formData.copra_ship_date),
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
      setShowModal(false);
    } catch (error) {
      console.error("Error creating/updating sale or notification:", error);
    }
  };

  const fncCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Plan Your Shipment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="manufacturer_id">
            Company / Manufacturer Name:
            <select
              id="manufacturer_id"
              name="manufacturer_id"
              value={formData.manufacturer_id}
              onChange={handleChange}
              required
            >
              <option value="">First name / Last name</option>
              {manufacturers.map((manu) => (
                // eslint-disable-next-line no-underscore-dangle
                <option key={manu._id} value={manu._id}>
                  {manu.full_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="copra_ship_date">
            Date Purchased:
            <input
              type="date"
              id="copra_ship_date"
              name="copra_ship_date"
              value={formData.copra_ship_date}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="amount_of_copra_sold">
            Copra sold / weight in kg:
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                id="amount_of_copra_sold"
                name="amount_of_copra_sold"
                value={formData.amount_of_copra_sold}
                onChange={handleChange}
                required
                style={{ marginRight: "5px" }}
              />
              <span>kg</span>
            </div>
          </label>
        </div>
        <div>
          <CtaBtn
            size="S"
            level="O"
            innerTxt="Cancel"
            onClickFnc={fncCloseModal}
          />
          <CtaBtn size="S" level="P" type="submit" innerTxt="Save" />
        </div>
      </form>
    </div>
  );
};

export default PlanShipment;
