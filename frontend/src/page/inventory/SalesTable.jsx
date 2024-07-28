import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

const SalesTable = ({ userId, URL, showConfirmation }) => {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [load, setLoad] = useState(null);

  useEffect(
    () => {
      startLoading();
      axios.get(`${URL}/user/${userId}/fivesales`).then((response) => {
        setSales(response.data.data);
        stopLoading();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showConfirmation, startLoading, stopLoading]
  );

  return (
    <div>
      <h3 className="h3-sans font-semibold text-neutral-600 mb-[14px]">Latest Sales</h3>
      <div id="tableArea" className="overflow-auto rounded-lg border border-bluegreen-200">
        <table className="w-full overflow-auto">
          <thead className="text-white bg-neutral-600">
            <tr className="legend14">
              <th className="text-start p-[10px]">Date</th>
              <th className="text-start p-[10px]">Company</th>
              <th className="text-start p-[10px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              // eslint-disable-next-line no-underscore-dangle
              <tr key={sale._id} className="p14-medium even:bg-bluegreen-100">
                <td className="pl-[10px] py-[12.5px]">
                  {sale.copra_ship_date.split("T")[0].slice(5, 7)}/
                  {sale.copra_ship_date.split("T")[0].slice(8, 10)}/
                  {sale.copra_ship_date.split("T")[0].slice(2, 4)}
                </td>
                <td className="pl-[10px] py-[12.5px]">
                  {sale.manufacturer_id.full_name}
                </td>
                <td className="pl-[10px] py-[12.5px]">{sale.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate("/sales")}
        type="button"
        className="mt-[37px] p14 font-semibold w-full text-right"
      >
        View sales log →
      </button>
    </div>
  );
};

export default SalesTable;
