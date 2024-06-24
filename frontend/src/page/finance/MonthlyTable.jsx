import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import UserIdContext from "./UserIdContext";

const MonthlyTable = () => {
  const [dailyTransactionSale, setDailyTransactionSale] = useState([]);
  const [dailyTransactionPurchase, setDailyTransactionPurchase] = useState([]);
  const [transactionArr, setTransactionArr] = useState([]);
  const userId = useContext(UserIdContext);
  // Would be transferred
  useEffect(() => {
    // axios
    //   .get(`http://localhost:5555/tmpFinRoute/${userId}/sale`)
    //   .then((res) => {
    //     console.log(res);
    //     dailyTransactionSale(res.data.data.salesAggregation);
    //   })
    //   .catch();
    // Read purchas
    axios
      .get(`http://localhost:5555/tmpFinRoute/${userId}/purchase`)
      .then((res) => {
        setDailyTransactionPurchase(res.data);
      })
      .catch();
  }, [userId]);

  const consolidateByDate = (data, type) => {
    return data.reduce((acc, current) => {
      if (type === "purchase") {
        if (acc[current.purchase_date]) {
          acc[current.purchase_date] +=
            +current.total_purchase_price.$numberDecimal;
        } else {
          acc[current.purchase_date] =
            +current.total_purchase_price.$numberDecimal;
        }
      } else {
        // will wite in case of sales
      }
      return acc;
    }, {});
  };

  useEffect(() => {
    // aggreagete the same day transaction
    const consolidatedPurchase = consolidateByDate(
      dailyTransactionPurchase,
      "purchase"
    );
    // consolidate two arrays into one transactionArr
    setTransactionArr(
      Object.entries(consolidatedPurchase).map(([date, purchase]) => ({
        date,
        purchase,
      }))
    );
  }, [dailyTransactionPurchase, dailyTransactionSale]);

  return (
    <div>
      <section className="title">Your daily activity</section>
      <section className="table">
        <table>
          {/* Fixed table head */}
          <tr>
            <th>Date</th>
            <th>Sales</th>
            <th>Purchase</th>
          </tr>
          {/* Loop over */}
          {console.log(transactionArr)}
          {transactionArr.map((transaction) => (
            <tr>
              <td>{transaction.date.slice(0, 10)}</td>
              <td>tbd</td>
              <td>{transaction.purchase}</td>
            </tr>
          ))}
        </table>
      </section>
    </div>
  );
};

export default MonthlyTable;
