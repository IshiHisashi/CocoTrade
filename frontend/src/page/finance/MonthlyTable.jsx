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
    axios
      .get(`http://localhost:5555/tmpFinRoute/${userId}/sale`)
      .then((res) => {
        setDailyTransactionSale(res.data);
      })
      .catch();
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
      }
      if (type === "sale") {
        if (acc[current.copra_ship_date]) {
          acc[current.copra_ship_date] +=
            +current.total_sales_price.$numberDecimal;
        } else {
          acc[current.copra_ship_date] =
            +current.total_sales_price.$numberDecimal;
        }
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
    const consolidatedSale = consolidateByDate(dailyTransactionSale, "sale");
    // label sales and purchase
    const labeledPurchase = Object.entries(consolidatedPurchase).map(
      ([date, purchase]) => ({
        date,
        purchase,
      })
    );
    const labeledSale = Object.entries(consolidatedSale).map(
      ([date, sale]) => ({
        date,
        sale,
      })
    );
    // const trial = combineByDate(labeledSale, labeledPurchase);
    // console.log(trial);
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
