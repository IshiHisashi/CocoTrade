import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
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

  // Date reducer
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
      if (type === "integration") {
        const date = new Date(current.date).toISOString().split("T")[0]; // Extract date part
        if (!acc[date]) {
          acc[date] = { date: current.date, sale: 0, purchase: 0 };
        }
        acc[date].sale += current.sale;
        acc[date].purchase += current.purchase;
        return acc;
      }
      return acc;
    }, {});
  };
  // Combine two array into one
  const combineByDate = (sales, purchases) => {
    const consolidated = {};
    // Add sales data to the consolidated object
    sales.forEach((item) => {
      if (!consolidated[item.date]) {
        consolidated[item.date] = {
          date: item.date,
          sale: item.sale,
          purchase: 0,
        };
      } else {
        consolidated[item.date].sale = item.sale;
      }
    });

    // Add purchases data to the consolidated object
    purchases.forEach((item) => {
      if (!consolidated[item.date]) {
        consolidated[item.date] = {
          date: item.date,
          sale: 0,
          purchase: item.purchase,
        };
      } else {
        consolidated[item.date].purchase = item.purchase;
      }
    });

    // Convert the consolidated object back to an array
    return Object.values(consolidated);
  };
  // Execute the data integration
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
    // combine and integrate (reduce) the date
    const integratedObj = consolidateByDate(
      combineByDate(labeledSale, labeledPurchase),
      "integration"
    );
    // Then, extracted objArr is put into state.
    setTransactionArr(Object.values(integratedObj));
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
            <tr key={transaction.date}>
              <td>{transaction.date.slice(0, 10)}</td>
              <td>{transaction.sale}</td>
              <td>{transaction.purchase}</td>
            </tr>
          ))}
        </table>
      </section>
    </div>
  );
};

export default MonthlyTable;
