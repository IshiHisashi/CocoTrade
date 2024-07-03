import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserIdContext from "../../page/dashboard/UserIdContext";

const getDataObjRes = async (type, userId) => {
  let dataObj;

  if (type === "market") {
    const res = await axios.get("http://localhost:5555/marketprice/latest-2");

    const resArray = res.data.data.docs;

    dataObj = {
      comparison: Number(resArray[1].price_PHP.$numberDecimal / 1000).toFixed(
        2
      ),
      current: Number(resArray[0].price_PHP.$numberDecimal / 1000).toFixed(2),
    };
  } else if (type === "suggestion") {
    const res = await axios.get(
      `http://localhost:5555/user/${userId}/pricesuggestion/gettwo`
    );

    dataObj = {
      comparison: res.data.data.comparison,
      current: res.data.data.current,
    };
  }

  return dataObj;
};

const calculateDiff = (obj) => {
  const priceDiff = (obj.current - obj.comparison).toFixed(2);
  const percentageDiff = ((obj.current / obj.comparison - 1) * 100).toFixed(2);
  let arrow;
  if (priceDiff > 0) {
    arrow = "↑";
  } else if (priceDiff < 0) {
    arrow = "↓";
  } else {
    arrow = "±";
  }
  return { priceDiff, percentageDiff, arrow };
};

const PriceIndicatorCard = (props) => {
  const { type } = props;
  const userId = useContext(UserIdContext);
  const [dataObj, setDataObj] = useState(null);

  useEffect(() => {
    (async () => {
      const dataObjRes = await getDataObjRes(type, userId);
      setDataObj(dataObjRes);
    })();
  }, [type, userId]);

  let diffObj;
  if (dataObj) {
    diffObj = calculateDiff(dataObj);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white">
      <h3 className="text-base">
        {type === "market" ? "PALM OIL PRICE" : "SUGGESTED PURCHASE PRICE"}
      </h3>
      {dataObj ? (
        <>
          <p className="text-3xl">Php {dataObj.current}/kg</p>
          <div className="flex content-center items-center gap-4">
            <p className="bg-red-300 text-gray-500 p-2 rounded-xl">
              {diffObj.arrow} Php {diffObj.priceDiff}
            </p>
            <p className="text-gray-500">
              {diffObj.arrow} {diffObj.percentageDiff}% today
            </p>
          </div>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default PriceIndicatorCard;
