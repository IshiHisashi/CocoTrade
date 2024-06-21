import React from "react";
import { NavLink } from "react-router-dom";

const NavList = (props) => {
  const { page } = props;
  const pageName = page
    .split("")
    .map((el, index) => (index === 0 ? el.toUpperCase() : el))
    .join("");

  return (
    <li>
      <NavLink
        to={`/${page}`}
        end
        className={({ isActive }) =>
          isActive ? "block p-4 w-full bg-red-300" : "block p-4 w-full"
        }
      >
        {pageName}
      </NavLink>
    </li>
  );
};

export default NavList;
