import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Exit from "../../assets/icons/Exit.svg";

const NotificationDropdown = ({
  isNotificationOpen,
  setIsNotificationOpen,
  userId,
  URL,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${URL}/notification/user/${userId}`);
        console.log("Fetched notifications:", response.data); // Debugging line
        const sortedNotifications = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications || []); // Adjust based on actual response
      } catch (err) {
        console.error("Error fetching notifications:", err); // Renamed error to err
        setError("Failed to load notifications.");
      }
    };

    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen, userId, URL]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  });

  return (
    <div
      className={`absolute right-0 w-600 bg-white shadow-lg p-4 flex flex-col gap-4 cursor-default transition-all ease-in-out ${
        isNotificationOpen
          ? "translate-y-2 opacity-1"
          : "translate-y-0 opacity-0 invisible"
      } ${windowWidth > 700 ? "w-96" : "w-72"} overflow-auto rounded-2xl`}
      style={{ maxHeight: windowHeight - 80 }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="none"
    >
      <div className="flex justify-between items-center">
        <p className="h3-sans">Notifications</p>
        <button
          type="button"
          className="hover:bg-bluegreen-100 cursor-pointer p-1 rounded"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <img src={Exit} alt="close notification" />
        </button>
      </div>
      <div className="mt-2">
        {error && <p className="text-red-500">{error}</p>}
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification._id}
              className={`p-2 border-b border-gray-300 text-left pl-9 relative ${
                notification.read ? "bg-white" : "bg-bluegreen-100"
              }`}
            >
              <div className="flex items-center">
                {!notification.read && (
                  <div className="absolute top-50 left-2 w-3 h-3 bg-red-500 rounded-full" />
                )}
                <h2 className="text-left flex-1 h5-dashboard">
                  {notification.title}
                </h2>
              </div>
              <p className="p14">{notification.message}</p>
              <small className="text-[#9C9C9C] block p14">
                {formatDistanceToNow(new Date(notification.createdAt))} ago
              </small>
            </div>
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
