import React from "react";

const NotificationDropdown = (props) => {
  const { isNotificationOpen, setIsNotificationOpen } = props;

  return (
    <div
      className={`absolute right-0 bg-slate-100 p-4 flex justify-between gap-4 cursor-default transition-all ease-in-out ${
        isNotificationOpen
          ? "translate-y-2 opacity-1"
          : "translate-y-0 opacity-0 invisible"
      }`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="none"
    >
      <p>Notification</p>
      <button
        type="button"
        className="hover:bg-slate-300 cursor-pointer"
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
      >
        x
      </button>
    </div>
  );
};

export default NotificationDropdown;
