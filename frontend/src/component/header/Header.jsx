import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserIdContext from "../../page/dashboard/UserIdContext.jsx";
import UserMenuDropdown from "./UserMenuDropdown.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

const Header = () => {
  const userId = useContext(UserIdContext);
  const [companyName, setCompanyName] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`http://localhost:5555/user/${userId}`);
      setCompanyName(res.data.data.company_name);
    })();
  }, [userId]);

  useEffect(() => {
    const handleBodyClick = () => {
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
    };

    document.body.addEventListener("click", handleBodyClick);

    // Cleanup event listener on component unmount
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <header className="bg-lime-300 ml-52 h-24 sticky top-0 flex justify-between items-center p-4">
      <h2 className="text-4xl">Hello {companyName}</h2>
      <div className="flex gap-4">
        <span
          className="w-6 h-6 bg-slate-400 text-center rounded-[50%] relative"
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
            setIsUserMenuOpen(false);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
            setIsUserMenuOpen(false);
          }}
          role="button"
          tabIndex="0"
        >
          N
          <NotificationDropdown
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
        <span
          className="w-6 h-6 bg-[#0C7F8E] text-center rounded-[50%] relative"
          onClick={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen(!isUserMenuOpen);
            setIsNotificationOpen(false);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen(!isUserMenuOpen);
            setIsNotificationOpen(false);
          }}
          role="button"
          tabIndex="0"
        >
          {companyName.split("")[0]}
          <UserMenuDropdown isUserMenuOpen={isUserMenuOpen} />
        </span>
      </div>
    </header>
  );
};

export default Header;
