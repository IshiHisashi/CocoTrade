import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";


const NotificationDropdown = ({ isNotificationOpen, setIsNotificationOpen, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/notification/user/${userId}`);
        console.log('Fetched notifications:', response.data); // Debugging line
        const sortedNotifications = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedNotifications || []); // Adjust based on actual response
      } catch (err) {
        console.error('Error fetching notifications:', err); // Renamed error to err
        setError('Failed to load notifications.');
      }
    };

    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [isNotificationOpen, userId]);

  return (
    <div
      className={`absolute right-0 w-600 bg-slate-100 p-4 flex flex-col gap-4 cursor-default transition-all ease-in-out ${
        isNotificationOpen ? "translate-y-2 opacity-1" : "translate-y-0 opacity-0 invisible"
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
                                      // eslint-disable-next-line no-underscore-dangle 
            <div key={notification._id} className="p-2 border-b border-gray-300 text-left">
              <h2 className="font-semibold">{notification.title}</h2>
              <p>{notification.message}</p>
              <small className="text-gray-500 block">{formatDistanceToNow(new Date(notification.createdAt))} ago</small>
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
