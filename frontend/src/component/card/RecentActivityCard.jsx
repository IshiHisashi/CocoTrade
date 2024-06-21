import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserIdContext from "../../page/dashboard/UserIdContext";

const getTotalSum = async (type, userId) => {
  let totalSum;
  if (type === "purchase") {
    const res = await axios.get(
      `http://localhost:5555/tmpFinRoute/${userId}/purchase/today-total`
    );
    totalSum = res.data.totalSum.$numberDecimal;
  }
  if (type === "sales") {
    // hard code for now
    totalSum = 100;
  }
  return Number(totalSum).toFixed(2).toLocaleString();
};

const RecentActivityCard = (props) => {
  const { type } = props;
  const userId = useContext(UserIdContext);
  const [totalSum, setTotalSum] = useState(null);

  useEffect(() => {
    (async () => {
      const totalSumRes = await getTotalSum(type, userId);
      setTotalSum(totalSumRes);
    })();
  }, [type, userId]);

  return (
    <div className="border-2 p-4">
      <h3>Recent {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <p>{type === "purchase" ? "from today" : "over the last week"}</p>
      <p className="text-3xl">{totalSum ? `Php ${totalSum}` : "loading..."}</p>
    </div>
  );
};

export default RecentActivityCard;
