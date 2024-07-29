import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import { useLoading } from "../../contexts/LoadingContext.jsx";

const MonthlyTable = ({ selectedTableMonth, URL }) => {
  const [dailyTransactionSale, setDailyTransactionSale] = useState([]);
  const [dailyTransactionPurchase, setDailyTransactionPurchase] = useState([]);
  const [transactionArr, setTransactionArr] = useState([]);
  const [monthTransactionArr, setMonthTransactionArr] = useState([]);
  const userId = useContext(UserIdContext);
  const { startLoading, stopLoading } = useLoading();
  const [load, setLoad] = useState(null);

  useEffect(() => {
    startLoading();
    axios
      .get(`${URL}/tmpFinRoute/${userId}/sale`)
      .then((res) => {
        setDailyTransactionSale(res.data);
        stopLoading();
      })
      .catch();
    // Read purchas
    axios
      .get(`${URL}/tmpFinRoute/${userId}/purchase`)
      .then((res) => {
        setDailyTransactionPurchase(res.data);
        stopLoading();
      })
      .catch();
  }, [userId, URL, startLoading, stopLoading]);

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
    setTransactionArr(
      Object.values(integratedObj).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
  }, [dailyTransactionPurchase, dailyTransactionSale]);

  useEffect(() => {
    const extractSpecificMonth = (data) => {
      return data.date.slice(0, 7) === selectedTableMonth;
    };
    setMonthTransactionArr(transactionArr.filter(extractSpecificMonth));
  }, [selectedTableMonth, transactionArr]);

  const monthMapping = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const convertToMonth = (monthNumber) => {
    return monthMapping[monthNumber];
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="title flex flex-col gap-1">
        <h3 className="h3-sans">Your daily activity</h3>
        <h4 className="p16 text-neutral-300">
          For the month of {convertToMonth(selectedTableMonth.slice(5))}{" "}
          {selectedTableMonth.slice(0, 4)}
        </h4>
      </div>
      <div className="table-container h-[270px] overflow-auto rounded-[12px]">
        <table className="w-full border border-bluegreen-100">
          <thead className="sticky top-0 text-white bg-neutral-600 rounded">
            <tr className="legend14 rounded">
              <th className="text-start p-[10px]">Date</th>
              <th className="text-start p-[10px]">Sales</th>
              <th className="text-start p-[10px]">Purchase</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop over */}
            {monthTransactionArr.map((transaction) => (
              <tr
                key={transaction.date}
                className="p14-medium odd:bg-bluegreen-100"
              >
                <td className="pl-[10px] py-[12.5px]">
                  {/* {transaction.date.slice(0, 10)} */}
                  {transaction.date.slice(5, 7)}/{transaction.date.slice(8, 10)}
                  /{transaction.date.slice(2, 4)}
                </td>
                <td
                  className={`pl-[10px] py-[12.5px] ${transaction.sale === 0 ? "text-center" : ""}`}
                >
                  {transaction.sale === 0 ? "" : "Php. "}
                  {transaction.sale === 0
                    ? "-"
                    : formatNumber(transaction.sale)}
                </td>
                <td
                  className={`pl-[10px] py-[12.5px] ${transaction.purchase === 0 ? "text-center" : ""}`}
                >
                  {transaction.purchase === 0 ? "" : "Php. "}
                  {transaction.purchase === 0
                    ? "-"
                    : formatNumber(transaction.purchase)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTable;
