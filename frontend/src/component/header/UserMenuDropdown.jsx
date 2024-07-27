import React, { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logout from "../../services/logout";
import Settings from "../../assets/icons/Settings.svg";
import Out from "../../assets/icons/Logout.svg";

const UserMenuDropdown = memo((props) => {
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
      aria-label="user menu"
    >
      <nav className="w-[136px]">
        <ul className="p-2">
          <li>
            <NavLink
              to="/settings"
              className="block p-2 cursor-pointer hover:bg-bluegreen-100"
            >
              <img
                src={Settings}
                alt=""
                aria-hidden
                className="inline-block pr-2"
              />
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={handleLogout}
              className="block p-2 cursor-pointer hover:bg-bluegreen-100"
            >
              <img src={Out} alt="" aria-hidden className="inline-block pr-2" />
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
});

export default UserMenuDropdown;
