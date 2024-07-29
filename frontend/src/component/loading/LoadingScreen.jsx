import React, { useEffect } from "react";

const LoadingScreen = ({ children, onClose }) => {
  // ESC kyedown
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-95 h-screen bg-neutral-600 z-50 flex flex-col justify-center items-center ">
        <img src="./images/Logo_loading.svg" alt="loading icon" />
        <h4 className="h4-sans-uppercase text-white">Loading...</h4>
        {children}
      </div>
    </div>
  );
};

export default LoadingScreen;
