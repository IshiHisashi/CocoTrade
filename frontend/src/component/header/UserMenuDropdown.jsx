import React from "react";
import { NavLink } from "react-router-dom";

const UserMenuDropdown = (props) => {
  const { isUserMenuOpen } = props;

  return (
    <div
      className={`absolute right-0 cursor-default bg-slate-100 transition-all ease-in-out ${
        isUserMenuOpen
          ? "translate-y-2 opacity-1"
          : "translate-y-0 opacity-0 invisible"
      }`}
    >
      <nav>
        <ul className="p-2">
          <li>
            <NavLink
              to="/settings"
              className="block p-2 cursor-pointer hover:bg-slate-300"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className="block p-2 cursor-pointer hover:bg-slate-300"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserMenuDropdown;
