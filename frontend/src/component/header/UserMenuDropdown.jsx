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
      window.alert("Logout Error:", error.message);
    }
  };

  return (
    <div
      className={`absolute right-0 cursor-default bg-white text-black shadow-lg transition-all ease-in-out ${
        isUserMenuOpen
          ? "translate-y-3 opacity-1"
          : "translate-y-1 opacity-0 invisible"
      }`}
    >
      <nav>
        <ul className="p-2">
          <li>
            <NavLink
              to="/settings"
              className="block p-2 cursor-pointer hover:bg-bluegreen-100"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              // to="/"
              onClick={handleLogout}
              className="block p-2 cursor-pointer hover:bg-bluegreen-100"
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
