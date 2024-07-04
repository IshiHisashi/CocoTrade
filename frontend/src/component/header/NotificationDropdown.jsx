import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

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

  return (
    <div
      className={`absolute right-0 w-600 bg-white shadow-lg p-4 flex flex-col gap-4 cursor-default transition-all ease-in-out ${
        isNotificationOpen
          ? "translate-y-2 opacity-1"
          : "translate-y-0 opacity-0 invisible"
      } w-96`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="none"
    >
      <div className="flex justify-between items-center">
        <p className="font-bold">Notifications</p>
        <button
          type="button"
          className="hover:bg-slate-300 cursor-pointer p-1 rounded"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          x
        </button>
      </div>
      <div className="mt-2">
        {error && <p className="text-red-500">{error}</p>}
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification._id}
              className={`p-2 border-b border-gray-300 text-left pl-9 relative ${
                notification.read ? "bg-white" : "bg-red-100"
              }`}
            >
              <div className="flex items-center">
                {!notification.read && (
                  <div className="absolute top-50 left-2 w-3 h-3 bg-red-500 rounded-full" />
                )}
                <h2 className="text-left flex-1 font-semibold">
                  {notification.title}
                </h2>
              </div>
              <p>{notification.message}</p>
              <small className="text-gray-500 block">
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
