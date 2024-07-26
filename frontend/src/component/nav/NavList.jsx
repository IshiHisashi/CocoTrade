import React from "react";
import { NavLink } from "react-router-dom";
import dashboard from "../../assets/icons/Dashboard.svg";
import dashboardActive from "../../assets/icons/dashboard-active.svg";
import inventory from "../../assets/icons/Inventory.svg";
import inventoryActive from "../../assets/icons/inventory-active.svg";
import purchase from "../../assets/icons/Purchase.svg";
import purchaseActive from "../../assets/icons/purchase-active.svg";
import sales from "../../assets/icons/Sales.svg";
import salesActive from "../../assets/icons/sales-active.svg";
import finances from "../../assets/icons/Finances.svg";
import financesActive from "../../assets/icons/finances-active.svg";

const NavList = (props) => {
  const { page, fnToToggleNav } = props;
  const pageName = page
    .split("")
    .map((el, index) => (index === 0 ? el.toUpperCase() : el))
    .join("");

  let src;
  let srcActive;
  switch (page) {
    case "dashboard":
      src = dashboard;
      srcActive = dashboardActive;
      break;
    case "inventory":
      src = inventory;
      srcActive = inventoryActive;
      break;
    case "purchase":
      src = purchase;
      srcActive = purchaseActive;
      break;
    case "sales":
      src = sales;
      srcActive = salesActive;
      break;
    case "finances":
      src = finances;
      srcActive = financesActive;
      break;
    default:
      break;
  }

  return (
    <li>
      <NavLink
        to={`/${page}`}
        end
        className={({ isActive }) =>
          `flex items-center px-8 py-4 w-full h5-dashboard text-white min-h-[68px] hover:border-r-8 hover:border-r-[#FF5B04] ${isActive ? "border-r-8 border-r-[#FF5B04] p16-bold" : ""}`
        }
        onClick={() => fnToToggleNav("-translate-x-full")}
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? srcActive : src}
              alt=""
              className="inline-block mr-5"
              aria-hidden
            />
            {pageName}
          </>
        )}
      </NavLink>
    </li>
  );
};

export default NavList;
