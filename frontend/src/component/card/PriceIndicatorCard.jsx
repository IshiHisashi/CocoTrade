import axios from "axios";
import React, { memo, useContext, useEffect, useState } from "react";
import { UserIdContext } from "../../contexts/UserIdContext";
import MUp from "../../assets/icons/MarketPrice-Up.svg";
import MDown from "../../assets/icons/MarketPrice-Down.svg";
import SPPUp from "../../assets/icons/SPP-Up.svg";
import SPPDown from "../../assets/icons/SPP-Down.svg";
import TrendBadge from "../btn/TrendBadge";

const getDataObjRes = async (type, userId, URL) => {
  let dataObj;

  if (type === "market") {
    const res = await axios.get(`${URL}/marketprice/latest-2`);

    const resArray = res.data.data.docs;

    dataObj = {
      comparison: Number(resArray[1].price_PHP.$numberDecimal / 1000).toFixed(
        2
      ),
      current: Number(resArray[0].price_PHP.$numberDecimal / 1000).toFixed(2),
    };
  } else if (type === "suggestion") {
    const res = await axios.get(`${URL}/user/${userId}/pricesuggestion/gettwo`);

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
  let trend;
  if (priceDiff > 0) {
    arrow = "+";
    trend = "U";
  } else if (priceDiff < 0) {
    arrow = "";
    trend = "D";
  } else {
    arrow = "±";
    trend = "N";
  }

  return { priceDiff, percentageDiff, arrow, trend };
};

const PriceIndicatorCard = memo((props) => {
  const { type, URL } = props;
  const userId = useContext(UserIdContext);
  const [dataObj, setDataObj] = useState(null);

  useEffect(() => {
    (async () => {
      const dataObjRes = await getDataObjRes(type, userId, URL);
      setDataObj(dataObjRes);
    })();
  }, [type, userId, URL]);

  let diffObj;
  let iconSrc;
  if (dataObj) {
    diffObj = calculateDiff(dataObj);
    if (type === "market") {
      if (diffObj.trend === "U" || diffObj.trend === "N") {
        iconSrc = MUp;
      } else if (diffObj.trend === "D") {
        iconSrc = MDown;
      }
    } else if (type === "suggestion") {
      if (diffObj.trend === "U" || diffObj.trend === "N") {
        iconSrc = SPPUp;
      } else if (diffObj.trend === "D") {
        iconSrc = SPPDown;
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 p-8 bg-white sm:rounded-lg sm:border sm:border-bluegreen-200">
      <div>
        <h3 className="h3-sans text-neutral-600">
          {type === "market" ? "Coconut Oil Price" : "Copra Purchase Price"}
        </h3>
        <p className="p14 text-neutral-400">
          {type === "market"
            ? "Based on world market price"
            : "Suggested buying for farmers"}
        </p>
      </div>
      {dataObj ? (
        <>
          <div className="flex justify-between items-center gap-2">
            <p className="display-sans text-bluegreen-700">
              Php {dataObj.current}/kg
            </p>
            <img src={iconSrc} alt="" aria-hidden className="h-16 w-16" />
          </div>
          <div className="grid grid-cols-2 @2xl:flex content-center items-center gap-4">
            <TrendBadge
              trend={diffObj.trend}
              num={`${diffObj.arrow}${diffObj.priceDiff}`}
            />
            <p
              className={`p14-medium justify-self-center ${diffObj.trend === "U" || diffObj.trend === "N" ? "text-bluegreen-500" : "text-red-100"}`}
            >
              {diffObj.arrow}
              {diffObj.percentageDiff}% today
            </p>
          </div>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
});

export default PriceIndicatorCard;
