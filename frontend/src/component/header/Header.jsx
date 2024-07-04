import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import UserMenuDropdown from "./UserMenuDropdown.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import PlanShipment from "../../page/inventory/LineChartRevised.jsx"; // Update the path accordingly
import NotificationIcon from "../../assets/icons/Notification.svg";

const Header = ({ URL }) => {
  const userId = useContext(UserIdContext);
  const [companyName, setCompanyName] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/notification/user/${userId}`);
      const notifications = response.data.data || [];
      setUnreadCount(
        notifications.filter((notification) => !notification.read).length
      );
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  }, [userId, URL]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${URL}/user/${userId}`);
      setCompanyName(res.data.data.company_name);
    })();
  }, [userId, URL]);

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
        await axios.patch(`${URL}/notification/user/${userId}/mark-read`);
        setUnreadCount(0);
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
  };

  return (
    <header className="bg-[#F1F7F8] border-b border-[#DAE5E7] ml-64 h-24 sticky top-0 flex justify-between items-center px-8">
      <h2 className="text-4xl">Hello {companyName}</h2>
      <div className="flex gap-4">
        <button
          type="button"
          className="relative"
          onClick={handleNotificationClick}
        >
          <img src={NotificationIcon} alt="notification" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
          <NotificationDropdown
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            userId={userId}
            URL={URL}
            onClick={(e) => e.stopPropagation()}
          />
        </button>
        <button
          type="button"
          className="w-6 h-6 bg-[#0C7F8E] text-white text-center rounded-[50%] relative"
          onClick={(e) => {
            e.stopPropagation();
            setIsUserMenuOpen(!isUserMenuOpen);
            setIsNotificationOpen(false);
          }}
        >
          {companyName.split("")[0]}
          <UserMenuDropdown isUserMenuOpen={isUserMenuOpen} />
        </button>
      </div>
    </header>
  );
};

export default Header;
