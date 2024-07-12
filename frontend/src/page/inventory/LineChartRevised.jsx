import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DurationSelecter from "../../component/field-filter/DurationSelecter.jsx";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartRevised = ({ userId, URL, dashboard = false }) => {
  const today = useMemo(() => new Date(), []);
  const thisYear = today.toLocaleDateString().split("/")[2];
  const thisMonth = today.toLocaleDateString().split("/")[0].padStart(2, "0");
  const [inventory, setInventory] = useState([]);
  const [durationType, setDurationType] = useState(
    dashboard ? "monthly" : "yearly"
  );
  const [durationValue, setDurationValue] = useState(thisYear);
  const [data, setData] = useState({ datasets: [] });
  const [options, setOptions] = useState({});
  const [timeOption, setTimeOption] = useState({});

  useEffect(
    () => {
      // Current inventory
      axios
        .get(`${URL}/user/${userId}/inv`)
        .then((res) => {
          setInventory(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, URL]
  );

  // Recalculate based on duration selector and rerender the chart
  useEffect(
    () => {
      // Create a new data array based on duration
      if (inventory.length > 0) {
        let startDate = new Date();
        if (durationType === "yearly") {
          startDate = new Date(
            today.getFullYear() - 1,
            today.getMonth(),
            today.getDate()
          );
        } else if (durationType === "monthly") {
          startDate.setDate(today.getDate() - 30);
        }
        const modifiedInvData = inventory.filter((inv) => {
          const invDate = new Date(inv.time_stamp);
          return invDate > startDate;
        });

        // Convert raw data into a way that suits chart.js
        const dataPoints = modifiedInvData.map((inv) => ({
          x: inv.time_stamp.slice(0, 10),
          y: inv.current_amount_with_pending.$numberDecimal,
        }));

        // If today's date is not the latest datapoint's date, copy the number from the latest datapoint and create a new datapoint for today.
        if (dataPoints[0].x !== today.toISOString().split("T")[0]) {
          const todaysData = {
            x: today.toISOString().split("T")[0],
            y: dataPoints[0].y,
          };
          dataPoints.unshift(todaysData);
        }

        // If the oldest data is not of the startDate, create a datapoint for the startDate
        if (dataPoints[dataPoints.length - 1].x !== startDate.toISOString().split("T")[0]) {
          const startDatesData = {
            x: startDate.toISOString().split("T")[0],
            y: dataPoints[dataPoints.length - 1].y
          };
          dataPoints.push(startDatesData);
        }

        // Create a labels and modify timeOption
        const durationLabels = [];
        if (durationType === "yearly") {
          for (let i = 0; i < 365; ) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            durationLabels.unshift(date.toISOString().split("T")[0]);
            i += 1;
          }

          if (timeOption.unit !== "month") {
            setTimeOption({
              unit: "month",
              tooltipFormat: "yyyy-MM-DD",
            });
          }
        } else if (durationType === "monthly") {
          for (let i = 0; i < 30; ) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            durationLabels.unshift(date.toISOString().split("T")[0]);
            i += 1;
          }

          if (timeOption.unit !== "week") {
            setTimeOption({
              unit: "week",
              tooltipFormat: "MM-DD",
            });
          }
        }

        // Actual configuration for the chart
        setData({
          labels: durationLabels,
          datasets: [
            {
              lebel: `Inventory`,
              data: dataPoints,
              fill: true,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              stepped: 'after'
            },
          ],
        });

        setOptions({
          responsive: true,
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            x: {
              type: "time",
              time: timeOption,
              title: {
                display: false,
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: false,
              },
              beginAtZero: true,
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: !dashboard,
              text: "Inventory history",
            },
          },
          elements: {
            line: {
              tension: 0.4, // Smoothing effect
            },
            point: {
              radius: 0, // Hide points
            },
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inventory, durationType, timeOption]
  );

  return (
    <div>
      {dashboard || (
        <DurationSelecter
          setDurationType={setDurationType}
          setDurationValue={setDurationValue}
          thisYear={thisYear}
          thisMonth={thisMonth}
        />
      )}
      {data.datasets.length ? (
        <Line data={data} options={options} />
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default LineChartRevised;
