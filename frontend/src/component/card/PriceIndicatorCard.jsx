import axios from "axios";
import React, { useEffect, useState } from "react";

const getData = async (type, userId) => {
  let figure;
  if (type === "market") {
    const res = await axios.get("http://localhost:5555/marketprice/latest");
    figure = res.data.data.doc.price_PHP.$numberDecimal / 1000;
    figure = figure.toFixed(2);
  } else if (type === "suggestion") {
    const res = await axios.get(
      `http://localhost:5555/user/${userId}/pricesuggestion`
    );
    figure =
      res.data.data.price_suggestion_array[0].price_suggestion.$numberDecimal;
  }
  return figure;
};

const PriceIndicatorCard = (props) => {
  const { type, userId } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const figure = await getData(type, userId);
      setData(figure);
    })();
  }, [type, userId]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-base">
        {type === "market" ? "PALM OIL PRICE" : "SUGGESTED PURCHASE PRICE"}
      </h3>
      <p className="text-3xl">Php {data}/kg</p>
      <div className="flex content-center items-center gap-4">
        <p className="bg-red-300 text-gray-500 p-2 rounded-xl">UP Php 2.85</p>
        <p className="text-gray-500">+5.12% this week</p>
      </div>
    </div>
  );
};

export default PriceIndicatorCard;
