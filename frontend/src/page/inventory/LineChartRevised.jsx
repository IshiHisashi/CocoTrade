import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { useLoading } from "../../contexts/LoadingContext.jsx";

// Custom plungin to show the line on the chart.
const verticalLinePlugin = {
  id: "verticalLinePlugin",
  beforeDraw: (chart) => {
    // eslint-disable-next-line no-underscore-dangle
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const {
        ctx,
        scales: {
          y: { top: topY, bottom: bottomY },
        },
        tooltip: {
          _active: [
            {
              element: { x },
            },
          ],
        },
      } = chart;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
      ctx.restore();
    }
  },
};

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  verticalLinePlugin
);

const LineChartRevised = ({
  userId,
  URL,
  dashboard = false,
  chartTitle = "",
}) => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);
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
  const { startLoading, stopLoading } = useLoading();
  const [load, setLoad] = useState(null);

  useEffect(
    () => {
      startLoading();
      // Current inventory
      axios
        .get(`${URL}/user/${userId}/inv`)
        .then((res) => {
          setInventory(res.data.data);
          stopLoading();
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
      if (chartRef.current) {
        // Color settings
        const chart = chartRef.current.canvas.getContext("2d");
        const gradientColor = chart.createLinearGradient(0, 0, 0, 300);
        gradientColor.addColorStop(0, "rgba(75, 192, 192, 0.5)");
        gradientColor.addColorStop(1, "rgba(75, 192, 192, 0)");
        if (gradient === null) {
          setGradient(gradientColor);
        }
      }
      // Create a new data array based on duration
      if (inventory.length > 0) {
        // Get start date and end date for the duration
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

        // Generate all the date during the duration
        const generateDateRange = (start, end) => {
          const dates = [];
          const currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(new Date(currentDate).toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        };
        const dateRange = generateDateRange(startDate, new Date())

        // Create a raw inv data array based on duration without filling missing date
        const modifiedInvData = inventory.filter((inv) => {
          const invDate = new Date(inv.time_stamp);
          return invDate > startDate;
        });

        // Convert raw data into a way that suits chart.js
        const rawDataPoints = modifiedInvData.map((inv) => ({
          x: inv.time_stamp.slice(0, 10),
          y: inv.current_amount_with_pending.$numberDecimal,
        }));

        const fillInMissingData = (dates, dataPoints) => {
          const dataMap = new Map(dataPoints.map(point => [point.x, point.y]));
          let lastKnownY = dataPoints[dataPoints.length - 1].y;
          return dates.map(date => {
            const y = dataMap.get(date);
            if (y !== undefined) {
              lastKnownY = y;
            }
            return { x: date, y: lastKnownY };
          });
        };

        const dataPoints = fillInMissingData(dateRange, rawDataPoints);

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
              backgroundColor: gradient,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              // stepped: 'after'
            },
          ],
        });

        setOptions({
          responsive: true,
          maintainAspectRatio: false,
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
              ticks: {
                callback(value) {
                  const valueToShow = value === 0 ? "0" : `${value / 1000}k`;
                  return valueToShow;
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            verticalLinePlugin: true,
          },
          elements: {
            line: {
              tension: 0.2, // Smoothing effect
            },
            point: {
              radius: 0, // Hide points
            },
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inventory, durationType, timeOption, chartRef, gradient]
  );

  return (
    <div>
      <div
        id="topLayer"
        className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4"
      >
        <h3 className="h3-sans font-semibold text-neutral-600">{chartTitle}</h3>
        <DurationSelecter
          setDurationType={setDurationType}
          setDurationValue={setDurationValue}
          thisYear={thisYear}
          thisMonth={thisMonth}
          dashboard={dashboard}
        />
      </div>
      <div id="chartLayer" className="h-[330px]">
        {data.datasets.length ? (
          <Line ref={chartRef} data={data} options={options} />
        ) : (
          "Loading"
        )}
      </div>
    </div>
  );
};

export default LineChartRevised;
