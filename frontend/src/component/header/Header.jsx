import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import UserIdContext from "../../page/dashboard/UserIdContext.jsx";
import UserMenuDropdown from "./UserMenuDropdown.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import PlanShipment from "../../page/inventory/LineChartRevised.jsx"; // Update the path accordingly

const Header = () => {
  const userId = useContext(UserIdContext);
  const [companyName, setCompanyName] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5555/notification/user/${userId}`);
      const notifications = response.data.data || [];
      setUnreadCount(notifications.filter(notification => !notification.read).length);
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
    }
  }, [userId]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`http://localhost:5555/user/${userId}`);
      setCompanyName(res.data.data.company_name);
    })();
  }, [userId]);


  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount, userId]);


  useEffect(() => {
    const handleBodyClick = () => {
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  const handleNotificationClick = async (e) => {
    e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserMenuOpen(false);

    if (!isNotificationOpen) {
      try {
        await axios.patch(`http://localhost:5555/notification/user/${userId}/mark-read`);
        setUnreadCount(0);
      } catch (err) {
        console.error('Error marking notifications as read:', err);
      }
    }
  };

  return (
    <header className="bg-lime-300 ml-52 h-24 sticky top-0 flex justify-between items-center p-4">
      <h2 className="text-4xl">Hello {companyName}</h2>
      <div className="flex gap-4">
        <span
          className="w-6 h-6 bg-slate-400 text-center rounded-[50%] relative cursor-pointer"
          onClick={handleNotificationClick}
          onKeyDown={(e) => {
            e.stopPropagation();
            handleNotificationClick(e);
          }}
          role="button"
          tabIndex="0"
        >
          N
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
          <NotificationDropdown
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            userId={userId}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
        <span
          className="w-6 h-6 bg-[#0C7F8E] text-center rounded-[50%] relative cursor-pointer"
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
