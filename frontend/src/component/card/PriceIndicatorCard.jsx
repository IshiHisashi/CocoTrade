import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserIdContext from "../../page/dashboard/UserIdContext";

const getDataObjRes = async (type, userId) => {
  let dataObj;

  if (type === "market") {
    const res = await axios.get("http://localhost:5555/marketprice/latest");
    let figure = res.data.data.doc.price_PHP.$numberDecimal / 1000;
    figure = figure.toFixed(2);
    dataObj = {
      // hard-code for now. will have API for this created.
      comparison: 50,
      current: figure,
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
  const percentageDiff = ((1 - obj.current / obj.comparison) * 100).toFixed(2);
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
    <div className="flex flex-col items-center gap-4">
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
              {diffObj.arrow} {diffObj.percentageDiff}% compared to yesterday
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
