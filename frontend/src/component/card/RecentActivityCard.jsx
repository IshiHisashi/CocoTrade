import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserIdContext } from "../../contexts/UserIdContext";

const getTotalSum = async (type, userId, URL) => {
  let totalSum;
  try {
    if (type === "purchase") {
      const res = await axios.get(
        `${URL}/tmpFinRoute/${userId}/purchase/today-total`
      );
      totalSum = res.data.totalSum.$numberDecimal;
    } else if (type === "sales") {
      const res = await axios.get(
        `${URL}/tmpFinRoute/${userId}/sale//weekly-sales-sum`
      );
      totalSum = res.data.data.totalSales.$numberDecimal;
    }
    return Number(totalSum).toFixed(2).toLocaleString();
  } catch (error) {
    if (error.response.status === 404) {
      totalSum = 0;
      return Number(totalSum).toFixed(2).toLocaleString();
    }
    return null;
  }
};

const RecentActivityCard = (props) => {
  const { type, URL } = props;
  const userId = useContext(UserIdContext);
  const [totalSum, setTotalSum] = useState(null);
  useEffect(() => {
    (async () => {
      const totalSumRes = await getTotalSum(type, userId, URL);
      setTotalSum(totalSumRes);
    })();
  }, [type, userId, URL]);

  return (
    <div className="p-4 bg-white">
      <h3>Recent {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <p>{type === "purchase" ? "from today" : "over the last week"}</p>
      <p className="text-3xl">{totalSum ? `Php ${totalSum}` : "loading..."}</p>
    </div>
  );
};

export default RecentActivityCard;
