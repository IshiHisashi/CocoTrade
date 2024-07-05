import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logout from "../../services/logout";

const UserMenuDropdown = (props) => {
  const { isUserMenuOpen } = props;
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault(); // Prevent the default link behavior
    try {
      await logout();
      navigate("/"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div
      className={`absolute right-0 cursor-default bg-white text-black shadow-lg transition-all ease-in-out ${
        isUserMenuOpen
          ? "translate-y-6 opacity-1"
          : "translate-y-4 opacity-0 invisible"
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
              // to="/"
              onClick={handleLogout}
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
